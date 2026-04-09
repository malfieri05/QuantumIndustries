# Dark luxury visual refactor — Ark Solutions

Brief record of the March 2026 pass to move the UI from “cool tech startup” toward **elite consulting + subtle advanced capability**: restrained, expensive, calm.

## Color direction

- **Backgrounds:** `#0A0D12` (primary), `#0F131A` (surface), `#121821` (elevated) — near-black with a cool undertone, no purple wash.
- **Text:** `#F3F5F7` primary, `#9AA3B2` secondary — soft white and muted cool gray, not harsh pure white everywhere.
- **Accent:** `#3B5FFF` (muted royal blue), used **sparingly** — primary CTA, focus rings, nav underline, list dots. No cyan, no neon dominance.
- **Borders:** `rgba(255,255,255,0.06–0.12)` hairlines instead of glowing rims.

Tokens live in `src/index.css` (`@theme`).

## Glass card direction

- Replaced busy gradients, “liquid” shine, and refraction overlays with **quiet glass**: translucent dark fills, **moderate** blur/saturation, single hairline border, **soft lift shadow** (no glossy streaks).
- **`.glass`** for primary content panels; **`.glass-subtle`** for nested / process steps.
- **`.glass-header`** for sticky chrome (header, booking top bar) — readable blur without `glass-strong` jewelry.

Removed: `.glass-refraction`, `.glass-strong` (as primary pattern), ambient blob glows behind cards, violet secondary treatment on the ownership card (now neutral / typographic hierarchy).

## Glow reduction strategy

- Dropped utility classes **`.glow-blue`**, **`.glow-blue-subtle`**, and unused **hero orb** CSS (not in layout).
- **Hero canvas (`HeroGyroscope`):** many line-free particles, faux-3D gimbal rings at center; single-pass timeline (still → spin ramp → ring organize → hold with pulsation).
- **Cards / steps / dots:** no box-shadow bloom; accent dots are small flat disks with opacity, not lit orbs.
- **Primary button:** hover may use a **controlled** blue halo (`box-shadow`) — the one place extra energy is intentional.

## Hero simplification strategy

- **Removed** top “glow line” under the header — less decorative noise.
- **Headline:** larger, tighter tracking, `font-semibold` — typography carries authority; second line uses subtle opacity, **no** multi-stop gradient into violet.
- **Eyebrow:** muted gray, refined letter-spacing (not bright blue label).
- **Canvas:** smaller footprint, softer mask, shorter fade-in; motion slightly calmer.

## Spacing / layout strategy

- **Sections:** increased vertical padding (`py-28` → `lg:py-44` scale) and clearer separation between label → title → body.
- **Services:** more space before the grid; cards use generous inner padding; asymmetric offset preserved with **`lg:mt-14`** on the secondary column.
- **Process:** three **floating glass cards** in a row (stacked on small screens); large muted step index (`01`–`03`), hover **lift** (`-translate-y-2` + deeper shadow). Copy is engagement steps: Consultation → Scoped Proposal → Build & Support.
- **Footer:** quieter typographic block, more air, legal line de-emphasized.

## Booking / Cal.com

- `@calcom/embed-react` inline embed + delayed `Cal('ui', …)` with `cssVarsPerTheme` (transparent booker border / 0 width) and transparent embed body so the extra outer “frame” around the 3-column booker blends away; optional `VITE_CAL_BOOKING_URL` override (default: `quantumindustries/30min`).
- Booking header uses **`glass-header`**; back link is muted → solid on hover (not bright blue).

## Mobile

- **`.qi-grid`** opacity reduced further under `768px` so backgrounds stay calm on small screens.
- Spacing and glass treatments unchanged in spirit; hero graphic remains `hidden` below `md` as before.

---

**Principle used throughout:** if a choice was between *more impressive* and *more refined*, implementation favored **refinement**.
