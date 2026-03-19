export const site = {
  name: 'Quantum Industries',
  tagline: 'Take the Leap.',

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Replica Builds', href: '#replica-builds' },
    { label: 'Consultation', href: '#consultation' },
  ],

  hero: {
    eyebrow: 'SMB-focused · AI & custom software',
    headline: 'Take the Leap.',
    subhead:
      'Custom-fit AI automation and software solutions for small and medium-sized businesses — designed around how you actually work.',
    supporting:
      'We map your operations, spot friction, and ship tailored systems that help you run leaner, faster, and with more control.',
  },

  services: {
    id: 'services',
    title: 'What we do',
    intro:
      'Two ways we help: intelligent automation where it earns its place, and purpose-built software when off-the-shelf tools are holding you back.',
    cards: [
      {
        title: 'AI automation & custom software',
        body:
          'From daily routines to cross-team workflows, we identify where automation or bespoke software removes manual work, reduces errors, and keeps your operation moving.',
        highlights: [
          'Workflow and process mapping',
          'AI where it improves speed and quality',
          'Integrations with tools you already use',
        ],
      },
      {
        title: 'Replica Builds — own instead of rent',
        body:
          'During consultation, walk us through the software you pay for monthly, annually, or per seat. If it makes sense, we can build a tailored replica you own outright — one-time investment, lifetime customer support.',
        highlights: [
          'Audit of recurring software spend',
          'Feasibility and fit before we build',
          'You own the solution; we stand behind it',
        ],
      },
    ],
  },

  replica: {
    id: 'replica-builds',
    title: 'Replica Builds in depth',
    lead:
      'Many businesses stack subscriptions for things that could be a single system shaped to their rules. Replica Builds are for teams ready to trade recurring fees for an asset they control.',
    bullets: [
      'Bring any tools you pay recurring fees for — monthly, annual, per-user, or usage-based.',
      'We assess what a faithful, tailored replacement would take and whether it is the right move.',
      'You get software aligned to your workflows, branding, and permissions — not a generic portal.',
      'Pricing is project-based; support is ongoing so you are never stuck after launch.',
    ],
  },

  consultation: {
    id: 'consultation',
    title: 'The free consultation',
    subtitle: 'How we uncover opportunities',
    intro:
      'The call is a structured walkthrough of your business so we can see the whole picture — then zoom into the workflows that matter day to day.',
    steps: [
      {
        title: 'Business overview',
        body: 'Context on what you sell, who you serve, and how the company is organized.',
      },
      {
        title: 'Operations & systems',
        body: 'How work moves between people, tools, and customers — and where the bottlenecks are.',
      },
      {
        title: 'Daily routines',
        body: 'Concrete tasks performed every day: inputs, handoffs, approvals, reporting, and follow-ups.',
      },
      {
        title: 'Opportunity map',
        body: 'We highlight where AI automation or custom software could elevate operations — or turn recurring software renters into owners.',
      },
    ],
    closing:
      'No pressure — you leave with clarity on what is possible, what it might take, and logical next steps if you want to engage.',
  },

  footer: {
    blurb: 'Custom-fit AI automation and software for growing businesses.',
    legal: '© ' + new Date().getFullYear().toString() + ' Quantum Industries. All rights reserved.',
  },
} as const
