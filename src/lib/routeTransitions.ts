/**
 * Pass on `<Link state={…}>` between `/` and `/book` so the page slide matches
 * navigation intent (Framer exit uses the last `custom` while idle otherwise).
 */
export const routeSlide = {
  forward: { slide: 1 as const },
  back: { slide: -1 as const },
}
