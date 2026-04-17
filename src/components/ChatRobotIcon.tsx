function rrPath(x: number, y: number, w: number, h: number, r: number) {
  const t = Math.min(r, w / 2, h / 2)
  return `M ${x + t} ${y} H ${x + w - t} A ${t} ${t} 0 0 1 ${x + w} ${y + t} V ${y + h - t} A ${t} ${t} 0 0 1 ${x + w - t} ${y + h} H ${x + t} A ${t} ${t} 0 0 1 ${x} ${y + h - t} V ${y + t} A ${t} ${t} 0 0 1 ${x + t} ${y} Z`
}

/**
 * Minimal robot-head mark for the chat header — rounded head frame, side ear bumps,
 * antenna + bulb, visor cutout, vertical pill eyes (layout aligned to reference artwork).
 */
export function ChatRobotIcon({ className }: { className?: string }) {
  const outer = rrPath(4.35, 8.85, 15.3, 11.3, 3.35)
  const inner = rrPath(7.15, 11.35, 9.7, 6.45, 1.65)
  const head = `${outer} ${inner}`

  return (
    <svg
      className={className ? `text-qi-accent ${className}` : 'text-qi-accent'}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <g fill="currentColor">
        {/* Side bumps (drawn under head frame) */}
        <circle cx="4.35" cy="14.6" r="2.35" />
        <circle cx="19.65" cy="14.6" r="2.35" />
        {/* Head shell + visor hole */}
        <path fillRule="evenodd" clipRule="evenodd" d={head} />
        {/* Antenna */}
        <rect x="10.9" y="5.15" width="2.2" height="3.15" rx="0.55" />
        <circle cx="12" cy="3.35" r="1.95" />
        {/* Eyes — vertical pills inside visor */}
        <rect x="8.65" y="12.75" width="1.35" height="3.35" rx="0.68" />
        <rect x="14" y="12.75" width="1.35" height="3.35" rx="0.68" />
      </g>
    </svg>
  )
}

