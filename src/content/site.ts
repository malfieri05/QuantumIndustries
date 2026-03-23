export const site = {
  name: 'Quantum Industries',
  tagline: 'Take the Leap',

  booking: {
    path: '/book' as const,
    title: 'Book Your Consultation',
    subtitle: 'Free. No obligation.',
  },

  /** E.164-style digits for tel:; display string for UI */
  phone: {
    tel: '+15037645097',
    display: '503 764 5097',
  },

  nav: [
    { label: 'Home', href: '/#home' },
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Support', href: '/#support' },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'Intelligent\nSystems.\nTailored\nto You.',
  },

  services: {
    id: 'services',
    title: 'Services',
    cards: [
      {
        label: 'Core offering',
        title: 'AI Automation & Custom Software',
        body:
          'From daily routines to cross-team workflows - we identify where automation or bespoke software removes inefficiencies, reduces errors, and enhances your operations.',
        highlights: [
          'Operational workflows and process mapping',
          'Integrations with tools you already use',
          "Safely implemented system 'superintelligence'.",
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
          'Feasibility assessment',
          'You own the solution — we stand behind it',
        ],
      },
    ],
    intelligenceCard: {
      label: 'Market intelligence',
      title: 'Competitive Intelligence Systems',
      tagline: 'Stay ahead of your market — automatically.',
      intro:
        'We build custom systems that continuously monitor your competitors, analyze their moves, and surface meaningful insights — so you always know what’s changing and where opportunities exist.',
      doesHeading: 'What it does:',
      highlights: [
        'Continuous monitoring of competitor activity, strategy, and momentum.',
        'Identifies meaningful changes, signals opportunities',
        'Delivers clear insights and structured alerts',
      ],
    },
  },

  process: {
    id: 'process',
    title: 'Process',
    steps: [
      {
        title: 'Consultation',
        body:
          'A focused 30-minute session to understand your current stack, pain points, and goals. No pressure. No commitment.',
      },
      {
        title: 'Scoped Proposal',
        body:
          'A clear, fixed-scope proposal: deliverables, timeline, and price. No ambiguity, no surprises.',
      },
      {
        title: 'Build & Support',
        body:
          'We build, test, and seamlessly implement each build into your operations. Lifetime client support is included.',
      },
    ],
  },

  support: {
    id: 'support',
    title: 'Support',
    body:
      'Our clients gain direct access to the head architect that built their specific project.',
    bodySecond:
      "Anytime our clients need help or have questions on their product, they are free to reach out to their project architect's direct cell or email.",
    closing: 'No hold time. No call center.',
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Quantum Industries. All rights reserved.',
  },
} as const
