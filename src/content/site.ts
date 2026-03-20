export const site = {
  name: 'Quantum Industries',
  tagline: 'Take the Leap.',

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Replica Builds', href: '#replica-builds' },
    { label: 'Process', href: '#consultation' },
  ],

  hero: {
    eyebrow: 'AI Automation & Custom Software',
    headline: 'We build the systems\nthat run your business.',
    subhead:
      'Custom AI automation and software solutions engineered for how your business actually operates — not how a template thinks it should.',
    supporting:
      'We map your operations, find the friction, and ship systems that make you faster, leaner, and fully in control.',
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

  replica: {
    id: 'replica-builds',
    title: 'Replica Builds',
    lead:
      'Many businesses stack subscriptions for tools that could be a single system shaped to their rules.',
    statement:
      'Trade recurring fees for an asset you control.',
    bullets: [
      'Bring any tool you pay recurring fees for — monthly, annual, per-user, or usage-based.',
      'We assess what a faithful, tailored replacement takes and whether it is the right move.',
      'You get software aligned to your workflows, branding, and permissions — not a generic portal.',
      'Pricing is project-based. Support is ongoing so you are never stuck after launch.',
    ],
  },

  consultation: {
    id: 'consultation',
    title: 'How we work',
    subtitle: 'The free consultation',
    intro:
      'A structured walkthrough of your business so we see the whole picture — then zoom into the workflows that matter.',
    steps: [
      {
        title: 'Business overview',
        body: 'Context on what you sell, who you serve, and how the company is organized.',
      },
      {
        title: 'Operations & systems',
        body: 'How work moves between people, tools, and customers — and where the bottlenecks live.',
      },
      {
        title: 'Daily routines',
        body: 'Concrete tasks: inputs, handoffs, approvals, reporting, and follow-ups.',
      },
      {
        title: 'Opportunity map',
        body: 'Where AI automation or custom software could elevate operations — or turn renters into owners.',
      },
    ],
    closing:
      'No pressure. You leave with clarity on what is possible, what it takes, and logical next steps.',
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '\u00A9 ' + new Date().getFullYear().toString() + ' Quantum Industries. All rights reserved.',
  },
} as const
