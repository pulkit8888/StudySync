// Centralized mock data for StudySync. Shape mirrors what a real API would return,
// so pages can swap to live queries with minimal changes.

export type TopicSlug = "dbms" | "os" | "dsa" | "cn" | "oops";

export type Topic = {
  slug: TopicSlug;
  name: string;
  shortName: string;
  description: string;
  tagVar: string; // CSS var name for color
  highlightsCount: number;
  summariesCount: number;
  notesCount: number;
  sourcesCount: number;
  updatedAt: string;
};

export type Source = {
  id: string;
  title: string;
  domain: string;
  url: string;
  favicon?: string;
};

export type Highlight = {
  id: string;
  topicSlug: TopicSlug;
  text: string;
  context?: string;
  source: Source;
  createdAt: string; // ISO
};

export type Summary = {
  id: string;
  topicSlug: TopicSlug;
  title: string;
  bullets: string[];
  source: Source;
  createdAt: string;
};

export type Note = {
  id: string;
  topicSlug: TopicSlug;
  title: string;
  body: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  kind: "highlight" | "summary" | "note" | "topic";
  topicSlug: TopicSlug;
  label: string;
  detail: string;
  createdAt: string;
};

export const TOPICS: Topic[] = [
  {
    slug: "dbms",
    name: "Database Management Systems",
    shortName: "DBMS",
    description: "Relational design, transactions, indexing, and query optimization.",
    tagVar: "--topic-dbms",
    highlightsCount: 24,
    summariesCount: 12,
    notesCount: 7,
    sourcesCount: 9,
    updatedAt: "2026-06-07T14:21:00Z",
  },
  {
    slug: "os",
    name: "Operating Systems",
    shortName: "OS",
    description: "Processes, scheduling, memory management, file systems, and concurrency.",
    tagVar: "--topic-os",
    highlightsCount: 18,
    summariesCount: 9,
    notesCount: 5,
    sourcesCount: 7,
    updatedAt: "2026-06-06T09:45:00Z",
  },
  {
    slug: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    description: "Arrays, trees, graphs, dynamic programming, and complexity analysis.",
    tagVar: "--topic-dsa",
    highlightsCount: 31,
    summariesCount: 16,
    notesCount: 11,
    sourcesCount: 12,
    updatedAt: "2026-06-08T08:02:00Z",
  },
  {
    slug: "cn",
    name: "Computer Networks",
    shortName: "CN",
    description: "TCP/IP, routing, DNS, HTTP, and reliability across the wire.",
    tagVar: "--topic-cn",
    highlightsCount: 15,
    summariesCount: 8,
    notesCount: 4,
    sourcesCount: 6,
    updatedAt: "2026-06-05T17:33:00Z",
  },
  {
    slug: "oops",
    name: "Object Oriented Programming",
    shortName: "OOPS",
    description: "Encapsulation, inheritance, polymorphism, and abstraction in practice.",
    tagVar: "--topic-oops",
    highlightsCount: 19,
    summariesCount: 10,
    notesCount: 6,
    sourcesCount: 8,
    updatedAt: "2026-06-04T11:10:00Z",
  },
];

export const TOPICS_BY_SLUG: Record<TopicSlug, Topic> = TOPICS.reduce(
  (acc, t) => ({ ...acc, [t.slug]: t }),
  {} as Record<TopicSlug, Topic>,
);

const src = (id: string, title: string, domain: string): Source => ({
  id,
  title,
  domain,
  url: `https://${domain}/article/${id}`,
});

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "h1",
    topicSlug: "dbms",
    text:
      "A DBMS reduces redundancy, enforces consistency, and supports concurrent transactions while ensuring data integrity across operations.",
    context: "Introduction to Database Management Systems",
    source: src("dbms-1", "Introduction to Database Management Systems", "geeksforgeeks.org"),
    createdAt: "2026-06-08T10:14:00Z",
  },
  {
    id: "h2",
    topicSlug: "dbms",
    text:
      "ACID properties — atomicity, consistency, isolation, and durability — guarantee reliable transaction processing in modern databases.",
    source: src("dbms-2", "Understanding ACID Properties", "dev.to"),
    createdAt: "2026-06-07T18:02:00Z",
  },
  {
    id: "h3",
    topicSlug: "os",
    text:
      "The CPU scheduler selects from among the processes in memory that are ready to execute and allocates the CPU to one of them.",
    source: src("os-1", "Process Scheduling in Operating Systems", "tutorialspoint.com"),
    createdAt: "2026-06-06T09:45:00Z",
  },
  {
    id: "h4",
    topicSlug: "dsa",
    text:
      "A balanced binary search tree guarantees O(log n) lookups, insertions, and deletions by maintaining a height-balanced structure after every operation.",
    source: src("dsa-1", "Understanding Binary Search Trees", "leetcode.com"),
    createdAt: "2026-06-08T07:55:00Z",
  },
  {
    id: "h5",
    topicSlug: "cn",
    text:
      "TCP uses sequence numbers, acknowledgements, and retransmissions to recover from packet loss across unreliable networks.",
    source: src("cn-1", "How TCP Ensures Reliable Delivery", "cloudflare.com"),
    createdAt: "2026-06-05T17:33:00Z",
  },
  {
    id: "h6",
    topicSlug: "oops",
    text:
      "Encapsulation hides internal state, inheritance enables reuse, polymorphism allows interchangeable behavior, and abstraction exposes only what is needed.",
    source: src("oops-1", "The Four Pillars of OOP", "developer.mozilla.org"),
    createdAt: "2026-06-04T11:10:00Z",
  },
  {
    id: "h7",
    topicSlug: "dsa",
    text:
      "Dynamic programming solves problems by combining solutions to overlapping subproblems, trading memory for speed via memoization.",
    source: src("dsa-2", "Dynamic Programming Patterns", "leetcode.com"),
    createdAt: "2026-06-03T15:21:00Z",
  },
  {
    id: "h8",
    topicSlug: "dbms",
    text:
      "Indexes speed up reads at the cost of writes. A B+ tree index keeps data sorted and enables logarithmic search on disk-resident data.",
    source: src("dbms-3", "How Database Indexing Works", "use-the-index-luke.com"),
    createdAt: "2026-06-02T12:00:00Z",
  },
];

export const SUMMARIES: Summary[] = [
  {
    id: "s1",
    topicSlug: "dbms",
    title: "Introduction to DBMS",
    bullets: [
      "DBMS manages data efficiently at scale",
      "Reduces redundancy across tables",
      "Improves consistency and integrity",
      "Supports concurrent transactions safely",
    ],
    source: src("dbms-1", "Introduction to Database Management Systems", "geeksforgeeks.org"),
    createdAt: "2026-06-08T10:16:00Z",
  },
  {
    id: "s2",
    topicSlug: "os",
    title: "Process Scheduling",
    bullets: [
      "Scheduler picks ready processes",
      "Allocates CPU based on priority",
      "Preemptive vs non-preemptive modes",
      "Optimizes throughput and response",
    ],
    source: src("os-1", "Process Scheduling in Operating Systems", "tutorialspoint.com"),
    createdAt: "2026-06-06T09:48:00Z",
  },
  {
    id: "s3",
    topicSlug: "dsa",
    title: "Binary Search Trees",
    bullets: [
      "BST keeps an ordering invariant",
      "Left < parent < right node keys",
      "O(log n) search on balanced trees",
      "Inorder traversal yields sorted keys",
    ],
    source: src("dsa-1", "Understanding Binary Search Trees", "leetcode.com"),
    createdAt: "2026-06-08T08:00:00Z",
  },
  {
    id: "s4",
    topicSlug: "cn",
    title: "TCP Reliability",
    bullets: [
      "TCP delivers ordered byte streams",
      "Sequence numbers track packets",
      "ACKs confirm successful delivery",
      "Retransmits on loss or timeout",
    ],
    source: src("cn-1", "How TCP Ensures Reliable Delivery", "cloudflare.com"),
    createdAt: "2026-06-05T17:36:00Z",
  },
  {
    id: "s5",
    topicSlug: "oops",
    title: "The Four Pillars of OOP",
    bullets: [
      "Encapsulation protects internal state",
      "Inheritance enables code reuse",
      "Polymorphism for flexible APIs",
      "Abstraction hides complexity",
    ],
    source: src("oops-1", "The Four Pillars of OOP", "developer.mozilla.org"),
    createdAt: "2026-06-04T11:13:00Z",
  },
];

export const NOTES: Note[] = [
  {
    id: "n1",
    topicSlug: "dbms",
    title: "Why normalize?",
    body: "Normalization removes redundancy and keeps updates consistent. Trade-off: joins become more expensive at read time.",
    createdAt: "2026-06-07T20:12:00Z",
  },
  {
    id: "n2",
    topicSlug: "dsa",
    title: "When to use DP",
    body: "Look for optimal substructure + overlapping subproblems. If both hold, memoization or tabulation wins over brute force.",
    createdAt: "2026-06-08T08:30:00Z",
  },
  {
    id: "n3",
    topicSlug: "os",
    title: "Context switches are expensive",
    body: "Each switch flushes caches and reloads registers. Minimize them in hot paths; batch work when possible.",
    createdAt: "2026-06-06T10:00:00Z",
  },
  {
    id: "n4",
    topicSlug: "cn",
    title: "TCP vs UDP heuristic",
    body: "Reach for TCP when correctness matters; pick UDP when latency dominates and the app handles loss (gaming, voice).",
    createdAt: "2026-06-05T18:00:00Z",
  },
];

export const ACTIVITY: Activity[] = [
  { id: "a1", kind: "highlight", topicSlug: "dsa", label: "Saved highlight", detail: "Dynamic programming patterns", createdAt: "2026-06-08T08:01:00Z" },
  { id: "a2", kind: "summary", topicSlug: "dbms", label: "Generated summary", detail: "Introduction to DBMS", createdAt: "2026-06-08T10:16:00Z" },
  { id: "a3", kind: "note", topicSlug: "dbms", label: "Added note", detail: "Why normalize?", createdAt: "2026-06-07T20:12:00Z" },
  { id: "a4", kind: "highlight", topicSlug: "os", label: "Saved highlight", detail: "Process scheduling", createdAt: "2026-06-06T09:45:00Z" },
  { id: "a5", kind: "summary", topicSlug: "cn", label: "Generated summary", detail: "TCP reliability", createdAt: "2026-06-05T17:36:00Z" },
  { id: "a6", kind: "topic", topicSlug: "oops", label: "Updated topic", detail: "OOPS — 4 new highlights", createdAt: "2026-06-04T11:00:00Z" },
];

// Knowledge growth — last 14 days, mock cumulative items
export const KNOWLEDGE_GROWTH: { day: string; count: number }[] = [
  { day: "May 26", count: 38 },
  { day: "May 27", count: 41 },
  { day: "May 28", count: 47 },
  { day: "May 29", count: 53 },
  { day: "May 30", count: 58 },
  { day: "May 31", count: 64 },
  { day: "Jun 1", count: 71 },
  { day: "Jun 2", count: 78 },
  { day: "Jun 3", count: 84 },
  { day: "Jun 4", count: 91 },
  { day: "Jun 5", count: 98 },
  { day: "Jun 6", count: 104 },
  { day: "Jun 7", count: 111 },
  { day: "Jun 8", count: 119 },
];

export function relativeTime(iso: string, now = new Date("2026-06-08T15:00:00Z")): string {
  const d = new Date(iso);
  const s = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
