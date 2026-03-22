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
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Support', href: '/#support' },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'Intelligent\nSystems\nTailored\nto You.',
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
      'Our clients get access to our direct support line where anytime you need help or have questions on your product you are connected directly with the architect that built your specific project.',
    closing: 'No hold time. No call center.',
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Quantum Industries. All rights reserved.',
  },
} as const
