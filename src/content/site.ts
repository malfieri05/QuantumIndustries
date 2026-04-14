export const site = {
  name: 'Ark Solutions',
  /** Sticky header: large wordmark + muted subline with flank lines */
  brand: {
    wordmark: 'ARK',
    subline: 'Solutions',
  },
  tagline: 'Take the Leap',

  booking: {
    path: '/book' as const,
    title: 'Book Your Consultation',
    subtitle: 'Free.',
  },

  /** Canonical site URL for absolute links in transactional emails (logo, booking). */
  publicUrl: 'https://quantumindustries.ai' as const,

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
    { label: 'Contact', href: '/#contact', iconOnly: true as const },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'Intelligent\nBusiness\nSystems.',
    subhead: 'Tailored to your needs.',
  },

  services: {
    id: 'services',
    title: 'Services',
    /** Shown in a hover/focus box on “'superintelligence'” in Core offering highlights */
    superintelligenceTooltip: {
      heading: "'Superintelligence' integration:",
      bullets: [
        "Safely granting an independent AI agent 'read-only' access to as much company data as desired.",
        'The agent can be calibrated to provide whatever desired analysis, insights, advice, etc. on a constant or scheduled basis.',
      ],
    },
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
        title: 'Build-to-Own Software',
        subtitle: 'Replace subscriptions with software you own.',
        body:
          'Tell us about the tools you pay for monthly, annually, or per seat. When the numbers and workflows justify it, we design and build original software around your requirements — a one-time build you own, with support from the team that shipped it.',
        highlights: [
          'Review of recurring software spend',
          'Feasibility and ROI assessment',
          'You own the deliverable — we stand behind our work',
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

  contact: {
    id: 'contact',
    title: 'Send us a message',
    blurb: 'Please fill in the form below:',
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Ark Solutions. All rights reserved.',
  },
} as const
