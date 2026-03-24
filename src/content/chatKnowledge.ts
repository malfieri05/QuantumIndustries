/**
 * Curated FAQ and extra passages for the on-site help widget.
 * Edit this file to add questions, keywords, and scripted answers.
 * The matcher scores user messages against `keywords` and `questions`.
 *
 * Optional `chatKnowledgeSnippets` are searched when no FAQ wins strongly enough.
 */
export type ChatFaqEntry = {
  id: string
  /** Lowercase phrases that should trigger this answer (be generous). */
  keywords: string[]
  /** Example questions users might type (substring match helps scoring). */
  questions?: string[]
  /** Reply shown in the widget (plain text). */
  answer: string
}

export const chatFaqEntries: ChatFaqEntry[] = [
  {
    id: 'who',
    keywords: [
      'who',
      'quantum industries',
      'company',
      'about you',
      'what is',
      'what do you do',
    ],
    questions: ['who are you', 'what is quantum industries'],
    answer:
      'Quantum Industries builds custom-fit AI automation and software for growing businesses. Our tagline is “Take the Leap.” We focus on intelligent systems tailored to your operations—not one-size-fits-all SaaS.',
  },
  {
    id: 'services-core',
    keywords: [
      'services',
      'offer',
      'automation',
      'custom software',
      'ai automation',
      'workflows',
      'integration',
    ],
    questions: ['what do you offer', 'what services'],
    answer:
      'We offer AI automation and custom software: we map operational workflows, integrate with tools you already use, and implement automation and bespoke software where it removes inefficiencies and errors. We also build competitive intelligence systems that monitor competitors and surface insights.',
  },
  {
    id: 'replica',
    keywords: [
      'replica',
      'own',
      'rent',
      'subscription',
      'monthly',
      'replace',
      'build instead',
    ],
    questions: ['what is a replica build', 'replica builds'],
    answer:
      'Replica Builds are for software you pay for monthly or per seat. We assess whether it makes sense to build a tailored replica you own outright—one-time investment with lifetime support—instead of renting the product forever.',
  },
  {
    id: 'intel',
    keywords: [
      'competitive',
      'competitor',
      'intelligence',
      'market',
      'monitoring',
      'insights',
    ],
    questions: ['competitive intelligence', 'what is competitive intelligence'],
    answer:
      'Competitive Intelligence Systems continuously monitor competitor activity and strategy, highlight meaningful changes, and deliver structured alerts and insights so you can spot opportunities.',
  },
  {
    id: 'process',
    keywords: ['process', 'how it works', 'steps', 'timeline', 'proposal'],
    questions: ['how does the process work', 'what are the steps'],
    answer:
      'Typical flow: (1) Consultation—a focused ~30 minute session to understand your stack and goals, no commitment. (2) Scoped Proposal—clear deliverables, timeline, and price. (3) Build & Support—we implement and include lifetime client support.',
  },
  {
    id: 'consultation',
    keywords: ['consultation', 'first meeting', 'intro call', 'discovery', '30 minute'],
    questions: ['what is the consultation'],
    answer:
      'The consultation is a focused session (about 30 minutes) to understand your current tools, pain points, and goals. No pressure and no commitment.',
  },
  {
    id: 'support',
    keywords: ['support', 'help after', 'call center', 'architect', 'contact'],
    questions: ['how do i get support'],
    answer:
      'Clients get direct access to the architect who built their project—direct cell or email when they need help. No call center and no hold time.',
  },
  {
    id: 'book',
    keywords: ['book', 'schedule', 'calendar', 'meeting', 'consultation call', 'appointment'],
    questions: ['how do i book', 'book a call'],
    answer:
      'You can book a free consultation from the site—use “Book” in the header or visit the Book Consultation page. There’s no obligation.',
  },
  {
    id: 'phone',
    keywords: ['phone', 'call', 'number', 'reach', 'contact'],
    questions: ['phone number', 'how to call'],
    answer:
      'You can reach us at 503 764 5097. Booking a consultation through the site is also a great next step.',
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'how much', 'quote', 'fee'],
    questions: ['how much does it cost'],
    answer:
      'Pricing depends on scope. After the consultation we provide a fixed-scope proposal with deliverables, timeline, and price—no surprises. For a number tailored to you, book a consultation or call 503 764 5097.',
  },
]

/**
 * Extra paragraphs for fuzzy search when FAQ scores are low.
 * Add long-form notes, policies, or copy that is not worth duplicating in site.ts.
 */
export const chatKnowledgeSnippets: { id: string; text: string; keywords?: string[] }[] = [
  {
    id: 'nav',
    keywords: ['navigate', 'sections', 'home', 'services', 'process', 'support'],
    text:
      'The main page sections are Home, Services, Process, and Support. Use the header links or footer to move around. Hash links like /#services scroll to the right section.',
  },
]
