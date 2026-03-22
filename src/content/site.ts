export const site = {
  name: 'Quantum Industries',
  tagline: 'Take the Leap',

  booking: {
    path: '/book' as const,
    title: 'Book Your Consultation',
    subtitle: 'Free. No obligation.',
  },

  nav: [
    { label: 'Home', href: '/#home' },
    { label: 'Service', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Support', href: '/#support' },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'Intelligent\nSystems\nTailored\nto You.',
  },

  services: {
    id: 'services',
    title: 'What we build',
    intro:
      'Intelligent automation where it earns its place. Purpose-built software when off-the-shelf is holding you back.',
    cards: [
      {
        label: 'Core offering',
        title: 'AI Automation & Custom Software',
        body:
          'From daily routines to cross-team workflows — we identify where automation or bespoke software removes manual work, reduces errors, and keeps your operation moving.',
        highlights: [
          'Workflow and process mapping',
          'AI that improves speed and quality',
          'Integrations with tools you already use',
        ],
      },
      {
        label: 'Ownership model',
        title: 'Replica Builds',
        subtitle: 'Own instead of rent.',
        body:
          'Walk us through the software you pay for monthly, annually, or per seat. If it makes sense, we build a tailored replica you own outright — one-time investment, lifetime support.',
        highlights: [
          'Audit of recurring software spend',
          'Feasibility assessment before we build',
          'You own the solution — we stand behind it',
        ],
      },
    ],
  },

  process: {
    id: 'process',
    title: 'Process',
    steps: [
      {
        title: 'Consultation',
        body:
          'A focused 30-minute session to understand your current stack, pain points, and goals. No obligation.',
      },
      {
        title: 'Scoped Proposal',
        body:
          'A clear, fixed-scope proposal: deliverables, timeline, and price. No ambiguity, no surprises.',
      },
      {
        title: 'Build & Support',
        body:
          'We build, test, and hand off — then stay available. Lifetime support is included, not optional.',
      },
    ],
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Quantum Industries. All rights reserved.',
  },
} as const
