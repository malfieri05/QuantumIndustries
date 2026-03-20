import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  scatterX: number
  scatterY: number
  targetX: number
  targetY: number
  radius: number
  pulsePhase: number
  pulseSpeed: number
  innerCube: boolean // true = inner cube vertex, false = outer cube vertex
}

// A tesseract (4D hypercube) projected to 2D has 16 vertices:
// an outer cube and an inner cube, connected by edges between corresponding vertices.
// We project the 4D coordinates using a simple perspective projection.

function buildTesseractVertices(cx: number, cy: number, size: number): [number, number][] {
  const verts4D: [number, number, number, number][] = []

  // Generate all 16 vertices of a 4D hypercube: each coord is -1 or +1
  for (let i = 0; i < 16; i++) {
    verts4D.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ])
  }

  // Project 4D → 3D → 2D with perspective
  const dist4D = 2.8 // 4D viewpoint distance
  const dist3D = 4.0 // 3D viewpoint distance

  return verts4D.map(([x, y, z, w]) => {
    // 4D → 3D perspective
    const scale4 = dist4D / (dist4D - w)
    const x3 = x * scale4
    const y3 = y * scale4
    const z3 = z * scale4

    // 3D → 2D perspective
    const scale3 = dist3D / (dist3D - z3)
    const x2 = x3 * scale3
    const y2 = y3 * scale3

    return [cx + x2 * size, cy + y2 * size]
  })
}

// Tesseract edges: two vertices share an edge if they differ in exactly one coordinate
function buildTesseractEdges(): [number, number][] {
  const edges: [number, number][] = []
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const xor = i ^ j
      // Check if exactly one bit differs
      if (xor && (xor & (xor - 1)) === 0) {
        edges.push([i, j])
      }
    }
  }
  return edges
}

export function NeuralNetwork({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<[number, number][]>([])
  const animRef = useRef<number>(0)
  const initRef = useRef(false)
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    const w = () => canvas.width / dpr
    const h = () => canvas.height / dpr

    const CYCLE_DURATION = 10

    function initNodes() {
      const width = w()
      const height = h()
      const cx = width * 0.5
      const cy = height * 0.5
      const size = Math.min(width, height) * 0.18

      const verts = buildTesseractVertices(cx, cy, size)
      edgesRef.current = buildTesseractEdges()

      const nodes: Node[] = verts.map((v, i) => {
        const scatterAngle = Math.random() * Math.PI * 2
        const scatterR = 120 + Math.random() * Math.min(width, height) * 0.35
        const sx = cx + Math.cos(scatterAngle) * scatterR
        const sy = cy + Math.sin(scatterAngle) * scatterR
        const isInner = (i & 8) !== 0 // w = +1 → inner cube in projection

        return {
          x: sx, y: sy,
          scatterX: sx, scatterY: sy,
          targetX: v[0], targetY: v[1],
          radius: isInner ? 2.2 : 2.8,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.006,
          innerCube: isInner,
        }
      })

      nodesRef.current = nodes
    }

    if (!initRef.current) {
      initNodes()
      initRef.current = true
    }

    const nodes = nodesRef.current
    const edges = edgesRef.current
    const startTime = performance.now()

    const draw = (time: number) => {
      const width = w()
      const height = h()
      const cx = width * 0.5
      const cy = height * 0.5
      const size = Math.min(width, height) * 0.18

      ctx.clearRect(0, 0, width, height)

      const elapsed = (time - startTime) * 0.001
      const cycleT = (elapsed % CYCLE_DURATION) / CYCLE_DURATION

      // Convergence: scattered → tesseract → hold → scatter
      let convergence: number
      if (cycleT < 0.6) {
        const t = cycleT / 0.6
        convergence = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      } else if (cycleT < 0.85) {
        convergence = 1
      } else {
        const t = (cycleT - 0.85) / 0.15
        convergence = 1 - t * t
      }

      // Slow rotation of the tesseract over time
      const rotAngle = time * 0.0001
      const verts = buildTesseractRotated(cx, cy, size, rotAngle)

      // Update target positions with rotation and lerp nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.targetX = verts[i][0]
        node.targetY = verts[i][1]

        const baseX = node.scatterX + (node.targetX - node.scatterX) * convergence
        const baseY = node.scatterY + (node.targetY - node.scatterY) * convergence

        // Gentle breathing
        const breathAmp = node.innerCube ? 2 : 3
        const breathSpeed = 0.15 + node.pulseSpeed * 5
        const breathX = Math.sin(time * 0.001 * breathSpeed + node.pulsePhase) * breathAmp * (1 - convergence * 0.7)
        const breathY = Math.cos(time * 0.001 * breathSpeed * 0.7 + node.pulsePhase * 1.3) * breathAmp * (1 - convergence * 0.7)

        node.x = baseX + breathX
        node.y = baseY + breathY
        node.pulsePhase += node.pulseSpeed
      }

      // Draw edges
      for (const [i, j] of edges) {
        const ni = nodes[i]
        const nj = nodes[j]
        const dx = ni.x - nj.x
        const dy = ni.y - nj.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Determine edge type for styling
        const bothOuter = !ni.innerCube && !nj.innerCube
        const bothInner = ni.innerCube && nj.innerCube
        // When scattered, only show edges if nodes are close enough
        const maxScatterDist = 130
        const structuredAlpha = convergence
        const scatteredAlpha = dist < maxScatterDist ? (1 - dist / maxScatterDist) * 0.25 : 0
        const alpha = Math.max(scatteredAlpha, structuredAlpha * 0.5)

        if (alpha < 0.01) continue

        // Edge brightness by type
        let brightness: number
        let lineWidth: number
        if (bothOuter) {
          brightness = 1.0
          lineWidth = 1.2
        } else if (bothInner) {
          brightness = 0.7
          lineWidth = 0.8
        } else {
          brightness = 0.45
          lineWidth = 0.6
        }

        ctx.beginPath()
        ctx.moveTo(ni.x, ni.y)
        ctx.lineTo(nj.x, nj.y)
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * brightness})`
        ctx.lineWidth = lineWidth
        ctx.stroke()

        // Traveling pulses along edges when converged
        if (convergence > 0.4 && (i + j) % 4 === 0) {
          const pulsePos = ((time * 0.0003 + i * 0.2) % 1)
          const px = ni.x + (nj.x - ni.x) * pulsePos
          const py = ni.y + (nj.y - ni.y) * pulsePos
          const pulseAlpha = alpha * brightness * 2 * Math.sin(pulsePos * Math.PI) * convergence

          ctx.beginPath()
          ctx.arc(px, py, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(96, 165, 250, ${Math.min(pulseAlpha, 0.8)})`
          ctx.fill()
        }
      }

      // Also draw proximity connections when scattered (neural-net feel)
      if (convergence < 0.8) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            // Skip actual tesseract edges (already drawn)
            if (edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) continue

            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 100) {
              const alpha = (1 - dist / 100) * 0.15 * (1 - convergence)
              ctx.beginPath()
              ctx.moveTo(nodes[i].x, nodes[i].y)
              ctx.lineTo(nodes[j].x, nodes[j].y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
              ctx.lineWidth = 0.4
              ctx.stroke()
            }
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7
        const brightness = node.innerCube ? 0.75 : 1.0

        // Glow
        const glowSize = node.radius * (7 + convergence * 3)
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        )
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.2 * pulse * brightness})`)
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        const coreScale = 0.85 + convergence * 0.15
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulse * coreScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${(0.6 + pulse * 0.4) * brightness})`
        ctx.fill()

        // Bright center
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 0.5 * pulse * coreScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(219, 234, 254, ${0.9 * pulse * brightness})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const onResize = () => {
      ctx.resetTransform()
      resize()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [dpr])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

/**
 * Build tesseract vertices with slow 4D rotation applied before projection.
 */
function buildTesseractRotated(
  cx: number,
  cy: number,
  size: number,
  angle: number,
): [number, number][] {
  const verts4D: [number, number, number, number][] = []

  for (let i = 0; i < 16; i++) {
    verts4D.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ])
  }

  // Rotate in XW and YZ planes for interesting motion
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  const cosB = Math.cos(angle * 0.7)
  const sinB = Math.sin(angle * 0.7)

  const dist4D = 2.8
  const dist3D = 4.0

  return verts4D.map(([x, y, z, w]) => {
    // Rotate XW plane
    const x1 = x * cosA - w * sinA
    const w1 = x * sinA + w * cosA

    // Rotate YZ plane
    const y1 = y * cosB - z * sinB
    const z1 = y * sinB + z * cosB

    // 4D → 3D perspective
    const scale4 = dist4D / (dist4D - w1)
    const x3 = x1 * scale4
    const y3 = y1 * scale4
    const z3 = z1 * scale4

    // 3D → 2D perspective
    const scale3 = dist3D / (dist3D - z3)
    const x2 = x3 * scale3
    const y2 = y3 * scale3

    return [cx + x2 * size, cy + y2 * size]
  })
}
