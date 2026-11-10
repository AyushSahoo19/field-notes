export const layers = [
  { title: "Foundations", tone: "blue", domains: [
    ["programming", "Programming & C++"],
    ["algorithms", "Algorithms & DSA"],
    ["math", "Math & Statistics"],
    ["architecture", "Computer Architecture"],
  ] },
  { title: "Core systems", tone: "teal", domains: [
    ["operating-systems", "Operating Systems"],
    ["networking", "Networking"],
    ["databases", "Databases"],
    ["performance", "Performance"],
    ["quantum", "Quantum Computing"],
  ] },
  { title: "Specializations", tone: "violet", domains: [
    ["backend", "Backend & APIs"],
    ["distributed-systems", "Distributed Systems"],
    ["ai", "AI, ML & Deep Learning"],
    ["silicon", "Silicon Design"],
    ["robotics", "Robotics & Vision"],
    ["quantum-hardware", "Quantum Hardware"],
  ] },
  { title: "Delivery & research", tone: "amber", domains: [
    ["cloud-devops", "Cloud, DevOps & SRE"],
    ["ai-agents", "LLMs & Agentic AI"],
    ["finance", "Quant Finance & HFT"],
    ["knowledge-systems", "Knowledge Systems"],
    ["startups", "Startups & FinOps"],
    ["career-portfolio", "Open Source & Portfolio"],
  ] },
] as const;

export type DomainId = (typeof layers)[number]["domains"][number][0];
export type LinkKind = "learning" | "application";
export type DomainLink = { from: DomainId; to: DomainId; kind: LinkKind; detail: string };

const links: [DomainId, DomainId, LinkKind, string][] = [
  ["programming", "algorithms", "learning", "Implement data structures, then test their invariants and runtime."],
  ["programming", "operating-systems", "learning", "Memory ownership and C make kernel and system-call code easier to read."],
  ["programming", "networking", "learning", "Use sockets and byte buffers to implement and test a protocol."],
  ["programming", "ai", "learning", "Use Python to prepare data, train models, and reproduce experiments."],
  ["algorithms", "databases", "learning", "Apply trees, hashing, and search to indexing and query execution."],
  ["algorithms", "performance", "learning", "Compare the scaling of candidate algorithms before profiling their implementations."],
  ["algorithms", "distributed-systems", "learning", "Reason about data partitioning and coordination with explicit invariants."],
  ["math", "ai", "learning", "Linear algebra, probability, and optimization explain training and model evaluation."],
  ["math", "quantum", "learning", "Complex vectors and probability describe quantum states and measurements."],
  ["math", "robotics", "learning", "Geometry and estimation connect sensor readings to position, motion, and control."],
  ["math", "finance", "learning", "Probability, statistics, and optimization support signal validation and portfolio construction."],
  ["architecture", "operating-systems", "learning", "Processor privilege, address translation, and interrupts underpin kernel behavior."],
  ["architecture", "performance", "learning", "Caches and memory layout help explain why two implementations run at different speeds."],
  ["architecture", "silicon", "learning", "Digital logic and datapaths give context for RTL design and timing."],
  ["operating-systems", "backend", "learning", "Processes, scheduling, and file I/O explain how a service behaves under load."],
  ["operating-systems", "performance", "learning", "Use scheduling and memory behavior to interpret latency and contention."],
  ["networking", "backend", "learning", "HTTP, transport failures, and timeouts shape service interfaces."],
  ["networking", "distributed-systems", "learning", "Partial failures and message delays motivate retries, replication, and coordination."],
  ["databases", "backend", "learning", "Queries, transactions, and indexes support reliable service state."],
  ["databases", "distributed-systems", "learning", "Storage and transaction concepts give context for replication and partitioning."],
  ["databases", "knowledge-systems", "learning", "Schemas and query engines help store and retrieve linked entities."],
  ["performance", "finance", "application", "Measure and reduce tail latency in a simulated market-data or execution pipeline."],
  ["performance", "ai", "application", "Profile inference to find the cost of compute, memory, and batching."],
  ["quantum", "quantum-hardware", "learning", "Circuits and noise models provide context for device control and error correction."],
  ["backend", "cloud-devops", "application", "Package, deploy, observe, and roll back a running service."],
  ["backend", "ai-agents", "learning", "Use API contracts, authentication, and retries to make tool calls predictable."],
  ["backend", "startups", "application", "Turn a narrow workflow into a prototype users can evaluate."],
  ["distributed-systems", "cloud-devops", "learning", "Replication, queues, and partial failures inform resilient deployments."],
  ["distributed-systems", "knowledge-systems", "application", "Keep ingestion and indexing recoverable as a collection grows."],
  ["ai", "ai-agents", "learning", "Bring model behavior, embeddings, and evaluation into retrieval and tool use."],
  ["ai", "robotics", "application", "Use vision models for perception and measure errors in the robot’s operating conditions."],
  ["ai", "finance", "application", "Compare predictive models with simpler baselines using time-ordered validation."],
  ["ai", "knowledge-systems", "application", "Use embeddings to retrieve related records and evaluate what the search misses."],
  ["silicon", "robotics", "application", "Processor constraints shape what perception and control can run on-device."],
  ["silicon", "career-portfolio", "application", "Document RTL, test coverage, and timing as evidence of a verified design."],
  ["robotics", "startups", "application", "Test a narrow automation problem in simulation before planning a field pilot."],
  ["robotics", "career-portfolio", "application", "Show a repeatable simulation, evaluation cases, and a recorded demo."],
  ["quantum-hardware", "career-portfolio", "application", "Publish a reproducible noise or error-correction experiment with its assumptions."],
  ["cloud-devops", "career-portfolio", "application", "Capture deployment automation, a service dashboard, and failure recovery."],
  ["ai-agents", "knowledge-systems", "application", "Let a tool-using assistant query a graph and cite the records it consulted."],
  ["ai-agents", "startups", "application", "Try a reviewable assistant on one recurring customer task."],
  ["finance", "career-portfolio", "application", "Document a backtest with a benchmark, costs, and out-of-sample checks."],
  ["knowledge-systems", "startups", "application", "Use a source-aware map to connect customer interviews, problems, and experiments."],
  ["knowledge-systems", "career-portfolio", "application", "Show how a new source changes an entity, relationship, or conclusion."],
  ["startups", "career-portfolio", "application", "Turn a pilot and its decision criteria into an evidence-backed case study."],
];

export const domainLinks: DomainLink[] = links.map(([from, to, kind, detail]) => ({ from, to, kind, detail }));

export function findRoute(edges: DomainLink[], from: DomainId, to: DomainId) {
  if (from === to) return [];
  const queue = [from];
  const previous = new Map<DomainId, DomainLink>();

  for (const current of queue) {
    for (const edge of edges) {
      if (edge.from !== current || edge.to === from || previous.has(edge.to)) continue;
      previous.set(edge.to, edge);
      queue.push(edge.to);
      if (edge.to === to) {
        const route: DomainLink[] = [];
        let step: DomainLink | undefined = edge;
        while (step) {
          route.unshift(step);
          step = previous.get(step.from);
        }
        return route;
      }
    }
  }
  return null;
}
