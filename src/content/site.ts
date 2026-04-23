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

  consultation: {
    path: '/consultation' as const,
    title: 'Discovery form',
    subtitle: 'Help us understand your business so we can build the right solution.',
  },

  /** Canonical site URL for absolute links in transactional emails (logo, booking). */
  publicUrl: 'https://arksolutions.ai' as const,

  /** E.164-style digits for tel:; display string for UI */
  phone: {
    tel: '+15037645097',
    display: '503 764 5097',
  },

  nav: [
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Support', href: '/#support' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact', iconOnly: true as const },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'Intelligent\nBusiness\nSystems.',
    subhead: 'Tailored builds to fit any needs.',
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
        tagline: 'Tailored builds to fit any needs.',
        intro:
          'From daily routines to cross-team workflows - we identify where automation or bespoke software removes inefficiencies, reduces errors, and enhances your operations.',
        doesHeading: 'What we cover:',
        highlights: [
          'Operational workflows and process mapping',
          'Integrations with tools you already use',
          "Safely implemented system 'superintelligence'.",
        ],
      },
      {
        label: 'Role automation',
        title: 'AI Role Coverage Systems',
        subtitle:
          'Map responsibilities, automate repeatable work, and expand team capacity.',
        body:
          'Share a role’s responsibility list and workflow context. We map what an AI agent can own, then design and build a system that runs those tasks with human oversight—from partial support to near-full coverage, tuned to risk and complexity. Where appropriate, that can trim or replace parts of salaried roles.',
        highlights: [
          'Responsibility-by-responsibility coverage assessment',
          'Agent build for qualified tasks and handoffs',
          'Capacity and cost-impact model for staffing decisions',
        ],
      },
      {
        label: 'Ownership model',
        title: 'Build-to-Own Software',
        subtitle: 'Replace subscriptions with software you own.',
        body:
          'Tell us which tools you pay for monthly, annually, or per seat. When ROI and workflows justify it, we deliver custom software you own—one-time build, with ongoing support from the original team that shipped it.',
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
          'A focused session (up to 30 minutes) to understand your stack, pain points, and goals. No pressure. No commitment.',
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
    blurb: 'Please fill in the form below.',
  },

  faq: {
    id: 'faq',
    title: 'Frequently Asked Questions:',
    items: [
      {
        q: 'What happens in the free consultation?',
        a:
          'A focused session (up to 30 minutes) on your current tools, workflows, and goals. We clarify fit and direction. There is no cost and no obligation. If there is mutual fit, we follow with a written proposal; if not, you still leave with useful perspective.',
      },
      {
        q: 'How do pricing and timelines work?',
        a:
          'After the consultation you receive a fixed-scope proposal: deliverables, timeline, and a single price — so you are not guessing. Timelines depend on complexity; we only commit to dates we can stand behind and we surface dependencies early.',
      },
      {
        q: 'Who is a good fit for Ark Solutions?',
        a:
          'Teams that want automation, bespoke internal software, competitive intelligence systems, or a build-to-own alternative to costly subscriptions — especially when accuracy, privacy, and long-term ownership matter. If the problem is outside our wheelhouse, we will say so plainly.',
      },
      {
        q: 'What does “build-to-own” mean for us?',
        a:
          'When it makes sense, we design and build original software around your requirements so you invest once and own the deliverable, with support from the team that shipped it. We do not clone third-party products; we replace recurring rent with something tailored and defensible.',
      },
      {
        q: 'How do we get help after we go live?',
        a:
          'You work directly with the architect who built your project — cell and email — not a queue or call center. That same relationship continues for questions, refinements, and urgent issues.',
      },
    ],
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Ark Solutions. All rights reserved.',
  },
} as const
