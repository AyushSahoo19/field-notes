import source from "./source-data.json";
import { pathReference } from "./path-references";
import { quantPhaseReferences } from "./quant-phase-references";
import { advancedStudyPlans } from "./study-advanced";
import type { StudyPlan, StudyResource } from "./study-plan-types";
import { systemsStudyPlans } from "./study-systems";
import { workbookReference, workbookWeekReferences } from "./workbook-references";

export type Subject = [title: string, topics: string, proof: string];
export type Reading = [kind: string, title: string, url: string, use?: string];
export type Family = "Software & systems" | "AI & mathematics" | "Finance & startups" | "Hardware & robotics" | "Career & knowledge";

type PathInput = {
  id: string;
  title: string;
  family: Family;
  roles: string[];
  intro: string;
  needs: string[];
  subjects: Subject[];
  capstone: [title: string, evidence: string];
  domains?: string[];
  weeks?: number[];
  readings: Reading[];
};

const systems = "Software & systems";
const intelligence = "AI & mathematics";
const ventures = "Finance & startups";
const hardware = "Hardware & robotics";
const craft = "Career & knowledge";
const ddia: Reading = ["Book", "Designing Data-Intensive Applications", "https://dataintensive.net/", "Compare storage, replication, and fault models."];
const sre: Reading = ["Book", "Site Reliability Engineering", "https://sre.google/books/", "Read about monitoring, SLOs, and incident response."];
const nand: Reading = ["Book", "The Elements of Computing Systems", "https://www.nand2tetris.org/book", "Build the machine from gates through assembler and VM."];
const quantumBook: Reading = ["Book", "Quantum Computation and Quantum Information", "https://doi.org/10.1017/CBO9780511976667", "Work through states, channels, circuits, and error correction."];
const d2l: Reading = ["Book", "Dive into Deep Learning", "https://www.d2l.ai/", "Run and modify the executable notebooks."];
const ostep: Reading = ["Book", "Operating Systems: Three Easy Pieces", "https://pages.cs.wisc.edu/~remzi/OSTEP/"];
const unix: Reading = ["Paper", "The UNIX Time-Sharing System", "https://doi.org/10.1145/361011.361061"];
const pyTorch: Reading = ["Repository", "PyTorch", "https://github.com/pytorch/pytorch"];
const qiskit: Reading = ["Repository", "Qiskit", "https://github.com/Qiskit/qiskit"];
const varsity: Reading = ["Course", "Zerodha Varsity", "https://zerodha.com/varsity/", "Start with market mechanics, business analysis, and risk."];

export const paths = [
  {
    id: "programming", title: "Programming & Modern C++", family: systems, domains: ["Programming"], weeks: [1,2,3,4,5,6],
    roles: ["Software engineer", "C++ developer", "Systems programmer"], needs: ["Basic Python or Java", "Git"],
    intro: "Learn to reason about ownership, design interfaces, and verify C, C++, and Python code with tests and measurement.",
    subjects: [
      ["C memory and tooling", "Object lifetime, pointers, aliasing, allocation failure, GCC, GDB and sanitizers", "Implement a resizable array and test out-of-memory handling."],
      ["Modern C++", "Value semantics, RAII, copy and move, templates, STL, exceptions and ranges", "Build an owning container and benchmark it against the STL."],
      ["Advanced Python and Java", "Iterators, generators, typing, packaging, pytest, JVM object model and concurrency basics", "Package a typed library and test an identical input contract in two languages."],
    ],
    capstone: ["Portable C++ library", "Publish API documentation, sanitizer runs, CI tests, and a reproducible benchmark."],
    readings: [["Book", "A Tour of C++", "https://www.stroustrup.com/tour3.html"], ["Paper", "Memory Tagging and how it improves C/C++ memory safety", "https://arxiv.org/abs/1802.09517"], ["Repository", "fmt", "https://github.com/fmtlib/fmt"]],
  },
  {
    id: "algorithms", title: "Algorithms & Data Structures", family: systems, domains: ["Algorithms"], weeks: [4,5,6,7,8,9,10],
    roles: ["Software engineer", "Algorithm engineer", "Interview preparation"], needs: ["Programming fundamentals", "Discrete mathematics"],
    intro: "Choose representations, prove correctness, and measure the cost of an algorithm on inputs that expose its trade-offs.",
    subjects: [
      ["Foundations", "Asymptotics, invariants, recursion, amortization, sorting and binary search", "Prove binary search terminates and test boundary cases."],
      ["Structures and graphs", "Hashing, heaps, union-find, BFS, DFS, shortest paths and spanning trees", "Implement two priority queues and profile Dijkstra on sparse and dense graphs."],
      ["Design strategies", "Greedy proofs, dynamic programming, graph optimization, reductions and randomized algorithms", "Derive the state and transition for a DP problem, then verify against brute force."],
    ],
    capstone: ["Graph algorithm toolkit", "Publish tested algorithms, correctness notes, and timing curves for multiple graph families."],
    readings: [["Book", "Introduction to Algorithms", "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/"], ["Paper", "Fibonacci heaps and their uses in improved network optimization algorithms", "https://doi.org/10.1145/28869.28874"], ["Repository", "The Algorithms · C++", "https://github.com/TheAlgorithms/C-Plus-Plus"]],
  },
  {
    id: "architecture", title: "Computer Architecture", family: hardware, domains: ["Architecture"], weeks: [7,8,9,10],
    roles: ["Computer architect", "Embedded systems engineer", "Firmware engineer"], needs: ["Binary arithmetic", "C or C++"],
    intro: "Trace a program from instructions to datapaths, caches, and the memory hierarchy.",
    subjects: [
      ["Digital logic and datapaths", "Boolean algebra, ALUs, state machines, registers and RAM", "Design and test a simple CPU datapath in simulation."],
      ["Instruction sets", "Machine encoding, RISC-V assembly, addressing, stack frames and calling conventions", "Write an assembler and compare output with a reference tool."],
      ["Microarchitecture", "Pipelines, hazards, branch prediction, caches, memory locality and interrupts", "Run a cache sweep and explain the difference between measured and ideal behavior."],
    ],
    capstone: ["ISA simulator with memory profiling", "Provide instruction traces, differential tests, and a documented cache experiment."],
    readings: [nand, ["Paper", "A Case for Redundant Arrays of Inexpensive Disks", "https://doi.org/10.1145/50202.50214", "Study hardware-level trade-offs around parallelism and reliability."], ["Repository", "RISC-V ISA manuals", "https://github.com/riscv/riscv-isa-manual"]],
  },
  {
    id: "operating-systems", title: "Operating Systems", family: systems, domains: ["Operating Systems"], weeks: [11,12,13,14],
    roles: ["Kernel engineer", "Systems programmer", "Platform engineer"], needs: ["C memory", "Computer architecture"],
    intro: "Follow a system call through the kernel and understand how it schedules, isolates, and stores work.",
    subjects: [
      ["Processes and syscalls", "Fork, exec, wait, pipes, traps, privilege and scheduling", "Write a Unix shell with pipelines and test process cleanup."],
      ["Memory and concurrency", "Page tables, virtual memory, TLBs, threads, locks, races and deadlock", "Add a scheduler or page-table feature in xv6 and document the invariants."],
      ["File systems", "Inodes, file descriptors, caching, journaling and crash consistency", "Compare read and write traces across a clean stop and an interrupted write."],
    ],
    capstone: ["xv6 kernel change", "Deliver a readable patch with tests, traces, and an explanation of the failure cases."],
    readings: [ostep, unix, ["Repository", "MIT xv6 RISC-V", "https://github.com/mit-pdos/xv6-riscv"]],
  },
  {
    id: "networking", title: "Networking & Protocols", family: systems, domains: ["Networking"], weeks: [14],
    roles: ["Network software engineer", "Infrastructure engineer"], needs: ["Linux shell", "Processes and sockets"],
    intro: "Observe how applications communicate, then design reliable behavior around latency, loss, and partial reads.",
    subjects: [
      ["Packets and routing", "Ethernet, IP, subnets, routing, NAT and DNS", "Annotate a packet capture from DNS lookup to the first request."],
      ["Transport", "TCP handshake, retransmission, congestion, UDP and socket APIs", "Write a framed TCP client and handle truncated messages and disconnects."],
      ["Application protocols", "HTTP caching, TLS handshakes, HTTP/2 streams, QUIC and observability", "Compare connection reuse and tail latency for a small server."],
    ],
    capstone: ["Instrumented HTTP server", "Add protocol tests, structured timing, and a load report with assumptions."],
    readings: [["Book", "Computer Networking: A Top-Down Approach", "https://gaia.cs.umass.edu/kurose_ross/"], ["Paper", "End-to-End Arguments in System Design", "https://doi.org/10.1145/357401.357402"], ["Repository", "curl", "https://github.com/curl/curl"]],
  },
  {
    id: "databases", title: "Databases & Query Engines", family: systems, domains: ["Databases"], weeks: [15,16,17,18],
    roles: ["Database engineer", "Data infrastructure engineer"], needs: ["Data structures", "SQL basics"],
    intro: "Follow SQL from query planning to disk pages and understand what protects data during a crash.",
    subjects: [
      ["Storage and indexing", "Pages, buffer pools, B+ trees, hash indexes and LSM trees", "Implement a page cache and benchmark two access patterns."],
      ["Query execution", "Operators, joins, cardinality estimates, statistics and plan selection", "Use EXPLAIN to compare index scans and joins across distributions."],
      ["Transactions and recovery", "Isolation levels, MVCC, write-ahead logging, checkpoints and recovery", "Reproduce a transaction anomaly and test replay after a simulated crash."],
    ],
    capstone: ["Small storage or query engine", "Provide a recovery test, documented query plan, and reproducible performance comparisons."],
    readings: [ddia, ["Paper", "Architecture of a Database System", "https://people.eecs.berkeley.edu/~kubitron/courses/cs262a-F19/handouts/papers/fntdb07-architecture.pdf"], ["Repository", "CMU BusTub", "https://github.com/cmu-db/bustub"]],
  },
  {
    id: "backend", title: "Backend & API Engineering", family: systems, domains: ["Backend"], weeks: [14,21,22,26],
    roles: ["Backend engineer", "Full-stack engineer", "API engineer"], needs: ["Programming", "SQL and HTTP"],
    intro: "Design APIs and background jobs around clear contracts, safe retries, and observable failures.",
    subjects: [
      ["Service interfaces", "HTTP and JSON, schemas, request validation, auth boundaries and migrations", "Implement a versioned API with contract and authorization tests."],
      ["Reliable workflows", "Queues, idempotency keys, transactions, leases, retries and dead letters", "Inject duplicate requests and show that the business operation happens once."],
      ["Operations and integration", "Load tests, tracing, alerting, client state and rollback", "Trace a UI request across API, worker, and database under load."],
    ],
    capstone: ["Reliable task service", "Ship the API, worker, a minimal client, and a runbook covering timeout and retry behavior."],
    readings: [ddia, ["Course", "FastAPI tutorial", "https://fastapi.tiangolo.com/tutorial/"], ["Paper", "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure", "https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/"], ["Repository", "FastAPI", "https://github.com/fastapi/fastapi"]],
  },
  {
    id: "distributed-systems", title: "Distributed Systems", family: systems, domains: ["Distributed Systems"], weeks: [19,20,21,22],
    roles: ["Distributed systems engineer", "Infrastructure engineer"], needs: ["Operating systems", "Networking and databases"],
    intro: "Build services that keep their guarantees when machines, networks, and clients fail independently.",
    subjects: [
      ["Distributed execution", "RPC, timeouts, worker failures, MapReduce and task leases", "Run a job twice after a worker crash and verify a single committed result."],
      ["Coordination and consistency", "Replication, quorum reads, Raft elections, logs, linearizability and partitions", "Test a replicated key-value store under dropped and reordered messages."],
      ["Scaling and operations", "Partitioning, hot keys, backpressure, retries and observability", "Load-test shards, then measure the effect of a slow partition."],
    ],
    capstone: ["Replicated key-value store", "Report the consistency contract, fault matrix, trace evidence, and recovery behavior."],
    readings: [ddia, ["Paper", "In Search of an Understandable Consensus Algorithm", "https://raft.github.io/raft.pdf"], ["Repository", "etcd", "https://github.com/etcd-io/etcd"]],
  },
  {
    id: "cloud-devops", title: "Cloud, DevOps & SRE", family: systems, domains: ["Cloud / DevOps"], weeks: [22,26],
    roles: ["Site reliability engineer", "Platform engineer", "DevOps engineer"], needs: ["Linux", "Networking", "Basic CI"],
    intro: "Deploy a small service, measure reliability, and practice recovery with known failure scenarios.",
    subjects: [
      ["Build and delivery", "Containers, CI pipelines, artifact provenance, deployment strategies and rollback", "Build a pipeline with tests, an immutable image, and a reversible deployment."],
      ["Cloud systems", "Networking, infrastructure as code, IAM, orchestration and service discovery", "Describe and provision a minimal environment using least-privilege access."],
      ["Observability and reliability", "Metrics, traces, logs, SLOs, error budgets and incident response", "Define an SLO and run a game day that exercises one alert and runbook."],
    ],
    capstone: ["Observable deployment", "Publish a deployment workflow, service dashboard, error-budget calculation, and incident review."],
    readings: [sre, ["Paper", "Large-scale cluster management at Google with Borg", "https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/"], ["Repository", "OpenTelemetry Collector", "https://github.com/open-telemetry/opentelemetry-collector"]],
  },
  {
    id: "performance", title: "Performance & Low-Latency Systems", family: systems, domains: ["Performance"], weeks: [6,9,13,22],
    roles: ["Performance engineer", "Low-latency C++ engineer", "HFT developer"], needs: ["C++", "Architecture and OS"],
    intro: "Measure where time goes, then change one bottleneck at a time with evidence.",
    subjects: [
      ["Measurement", "Sampling, flame graphs, throughput, latency distributions, warm-up and benchmark bias", "Reproduce p50 and p99 measurements and report the environment."],
      ["Memory and parallelism", "Cache lines, layout, false sharing, NUMA, SIMD and allocator behavior", "Compare array-of-structures with structure-of-arrays on the same workload."],
      ["Latency under load", "Queues, backpressure, batching, lock contention and scheduling", "Measure queue latency at several arrival rates and explain the knee."],
    ],
    capstone: ["Low-latency event pipeline", "Publish before/after profiles, throughput and tail-latency results, and correctness regressions."],
    readings: [["Book", "Systems Performance", "https://www.brendangregg.com/systems-performance-2nd-edition-book.html"], ["Paper", "Roofline: an insightful visual performance model", "https://doi.org/10.1145/1498765.1498785"], ["Repository", "Google Benchmark", "https://github.com/google/benchmark"]],
  },
  {
    id: "ai", title: "AI, ML & Deep Learning", family: intelligence, domains: ["AI / ML"], weeks: [23,24,25,26],
    roles: ["ML engineer", "Applied scientist", "Data scientist"], needs: ["Python", "Linear algebra and probability"],
    intro: "Go from statistical baselines and backpropagation to deep learning, evaluation, and deployment.",
    subjects: [
      ["Statistical learning", "Losses, regression, classification, calibration, cross-validation and leakage", "Compare linear and tree baselines on a held-out dataset."],
      ["Neural networks", "Autograd, optimization, regularization, CNNs, sequence models and attention", "Implement a small network and compare gradients with finite differences."],
      ["Model engineering", "Data pipelines, experiment tracking, ablations, inference, drift and evaluation", "Ship a reproducible training and evaluation run with an error analysis."],
    ],
    capstone: ["Reproducible ML system", "Publish a baseline comparison, model card, inference endpoint, and failure-case analysis."],
    readings: [d2l, ["Paper", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762"], ["Course", "Hugging Face LLM Course", "https://huggingface.co/learn/llm-course/chapter1/1"], pyTorch],
  },
  {
    id: "finance", title: "Finance, Quant Research & HFT", family: ventures, domains: ["Quant / HFT"],
    roles: ["Quant researcher", "Quant trader", "Quant developer", "Execution quant", "Portfolio manager", "Research engineer"], needs: ["Probability and statistics", "Python", "C++ for low-latency work"],
    intro: "Study markets, systematic research, risk, and execution using the 19-phase quant curriculum. The research and development branches share foundations and diverge in their project evidence.",
    subjects: [
      ["Business and market foundations", "Financial statements, cash flow, instruments, market participants, spreads and order types", "Reconcile profit with cash flow and replay a small order book by hand."],
      ["Research and validation", "Time series, factor exposures, walk-forward validation, leakage, fees and slippage", "Compare a signal to a baseline in a later period and report sensitivity to costs."],
      ["Portfolio and execution", "Sizing, drawdown, attribution, execution models, market making and feed latency", "Simulate execution with explicit assumptions and inspect the difference from gross returns."],
    ],
    capstone: ["Auditable strategy research report", "Publish a timestamp-safe backtest, benchmark, cost model, holdout results, and limitations."],
    readings: [varsity, ["Book", "Algorithmic and High-Frequency Trading", "https://sebastian.statistics.utoronto.ca/books/algo-and-hf-trading/"], ["Paper", "The Probability of Backtest Overfitting", "https://escholarship.org/uc/item/4w1110bb"], ["Paper", "Common risk factors in the returns on stocks and bonds", "https://doi.org/10.1016/0304-405X(93)90023-5", "Trace how the factors are defined and evaluated."], ["Paper", "Algorithmic Trading, Stochastic Control, and Mutually Exciting Processes", "https://oxford-man.ox.ac.uk/wp-content/uploads/2020/05/Algorithmic-Trading-Stochastic-Control-and-Mutually-Exciting-Processes.pdf", "Read how the order-flow model enters the execution problem."], ["Repository", "QuantConnect LEAN", "https://github.com/QuantConnect/Lean"]],
  },
  {
    id: "robotics", title: "Robotics & Computer Vision", family: hardware, domains: ["Robotics / CV"],
    roles: ["Robotics engineer", "Perception engineer", "Computer vision engineer"], needs: ["Linear algebra", "Python or C++", "Basic probability"],
    intro: "Connect perception, estimation, planning, and control through a measurable robotics or vision task.",
    subjects: [
      ["Geometry and motion", "Frames, rigid transforms, forward and inverse kinematics, calibration and trajectories", "Verify frame transforms and arm motion in simulation."],
      ["Perception and estimation", "Image formation, detection metrics, sensor fusion, Kalman filters and SLAM", "Evaluate a detector or state estimator against labeled ground truth."],
      ["Planning and control", "Feedback, PID, motion planning, ROS 2 nodes and simulation-to-real gaps", "Run a simulated route with disturbances and report recovery behavior."],
    ],
    capstone: ["Robotic perception and control demo", "Provide a recorded simulation, error analysis, and a repeatable test scenario."],
    readings: [["Book", "Modern Robotics", "https://modernrobotics.northwestern.edu/"], ["Paper", "ORB-SLAM2", "https://arxiv.org/abs/1610.06475"], ["Repository", "ROS 2", "https://github.com/ros2/ros2"], ["Repository", "OpenCV", "https://github.com/opencv/opencv"]],
  },
  {
    id: "quantum", title: "Quantum Computing & Quantum ML", family: hardware, domains: ["Quantum"],
    roles: ["Quantum software engineer", "Quantum algorithm researcher", "Quantum ML researcher"], needs: ["Complex linear algebra", "Probability", "Python"],
    intro: "Build and verify circuits, compare them with classical baselines, and separate simulated results from device measurements.",
    subjects: [
      ["Quantum information", "States, tensors, gates, measurement, entanglement and density matrices", "Compute and simulate a Bell state, then compare measurement frequencies."],
      ["Algorithms and implementation", "Phase estimation, Grover search, Fourier transform, compilation and noise models", "Compare ideal and noisy execution with a known answer."],
      ["Hybrid methods", "Parameterized circuits, gradients, feature encoding, variational objectives and classical baselines", "Test a variational model with a matched classical comparator and multiple seeds."],
    ],
    capstone: ["Quantum algorithm reproduction", "Show the circuit, noise assumptions, reproducible results, and classical comparison."],
    readings: [quantumBook, ["Course", "IBM Basics of Quantum Information", "https://learning.quantum.ibm.com/course/basics-of-quantum-information"], ["Paper", "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer", "https://arxiv.org/abs/quant-ph/9508027"], qiskit, ["Repository", "PennyLane", "https://github.com/PennyLaneAI/pennylane"]],
  },
  {
    id: "career-portfolio", title: "Career, Open Source & Portfolio", family: craft, domains: ["Career & Portfolio"],
    roles: ["Open-source contributor", "Software engineering candidate"], needs: ["Git", "One language you can test"],
    intro: "Create evidence through small, reviewable contributions and a portfolio that shows your reasoning.",
    subjects: [
      ["Project selection", "Contribution guidelines, issue reproduction, maintainer context and scope", "Write a reproducible issue report with environment and expected behavior."],
      ["Engineering evidence", "Regression tests, code review, CI, benchmark methods and technical writing", "Submit a focused patch or produce a ready-to-review diff and test log."],
      ["Interview preparation", "Problem solving, design trade-offs, behavioral examples and portfolio storytelling", "Explain a project’s architecture and a decision you changed after testing."],
    ],
    capstone: ["Evidence-backed portfolio release", "Show a reproducible build, tests, architecture notes, contribution record, and a short demo."],
    readings: [["Book", "Pro Git", "https://git-scm.com/book/en/v2"], ["Paper", "Expectations, outcomes, and challenges of modern code review", "https://zenodo.org/records/1401198"], ["Repository", "Kiwix JS", "https://github.com/kiwix/kiwix-js"]],
  },
  {
    id: "knowledge-systems", title: "Knowledge Systems & Graphs", family: craft, domains: ["Knowledge Systems"],
    roles: ["Knowledge graph engineer", "Knowledge systems builder", "Data architect"], needs: ["Structured data", "Graph basics"],
    intro: "Turn notes and sources into searchable entities, traceable relationships, and useful learning maps.",
    subjects: [
      ["Taxonomy and provenance", "Entity types, identifiers, source evidence, tags, ownership and confidence", "Define a schema for sources, topics, projects and claims."],
      ["Graphs and search", "Typed edges, RDF triples, SPARQL, indexing and entity linking", "Answer prerequisite and related-topic queries from a small graph."],
      ["Interfaces and curation", "Navigation, graph layout, filters, conflict resolution and update workflows", "Create a visual explorer and test how a new paper changes the map."],
    ],
    capstone: ["Source-aware knowledge atlas", "Publish a schema, sample graph, reproducible queries, and a source-update workflow."],
    readings: [["Book", "Semantic Web for the Working Ontologist", "https://www.elsevier.com/books/semantic-web-for-the-working-ontologist/allemang/978-0-12-385965-5"], ["Paper", "Knowledge Graphs", "https://arxiv.org/abs/2003.02320"], ["Repository", "RDFLib", "https://github.com/RDFLib/rdflib"]],
  },
  {
    id: "math", title: "Mathematics, Statistics & Optimization", family: intelligence,
    roles: ["Applied mathematician", "Statistician", "Quant or ML research foundation"], needs: ["Algebra and functions", "Comfort with proofs"],
    intro: "Connect the mathematics behind AI, quant research, and simulation. Use derivations and numerical experiments to check each idea.",
    subjects: [
      ["Proofs and linear algebra", "Logic, induction, vector spaces, projections, eigensystems, SVD and PCA", "Derive least squares, then check conditioning numerically."],
      ["Calculus and optimization", "Partial derivatives, Jacobians, Hessians, convexity, constraints and duality", "Solve a constrained optimization problem and verify residuals."],
      ["Probability and inference", "Conditional probability, expectation, limit theorems, estimation, tests and Bayesian inference", "Simulate confidence-interval coverage and compare it with theory."],
      ["Stochastic and numerical methods", "Markov chains, time series, Monte Carlo, floating point and stability", "Compare two estimators over repeated samples and report uncertainty."],
    ],
    capstone: ["Mathematical methods lab", "Show derivations, implementations, reproducible plots, and numerical failure cases."],
    readings: [["Course", "MIT 18.06 Linear Algebra", "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"], ["Book", "Convex Optimization", "https://web.stanford.edu/~boyd/cvxbook/"], ["Paper", "The Monte Carlo Method", "https://doi.org/10.1080/01621459.1949.10483310"], ["Repository", "SciPy", "https://github.com/scipy/scipy"]],
  },
  {
    id: "ai-agents", title: "LLMs, Retrieval & Agentic AI", family: intelligence, weeks: [25,26],
    roles: ["LLM engineer", "Applied AI engineer", "Agent systems engineer"], needs: ["Machine learning", "Python and APIs"],
    intro: "Build systems that retrieve evidence, call tools, and expose what happens when a model makes a poor decision.",
    subjects: [
      ["Language models", "Tokenization, embeddings, attention, context, sampling and inference cost", "Inspect an attention row and compare output under controlled sampling."],
      ["Retrieval and grounding", "Chunking, lexical and vector search, reranking, citations, retrieval recall and abstention", "Run a fixed evaluation set and separate retrieval failures from answer failures."],
      ["Agent workflows", "Tool schemas, state, structured output, permissions, retries, human review and traces", "Run a tool agent against mocked failures and verify approval gates and recovery."],
    ],
    capstone: ["Evidence-grounded tool agent", "Publish retrieval and tool-use evaluations, trace examples, and cases where the system abstains."],
    readings: [d2l, ["Course", "Hugging Face LLM Course", "https://huggingface.co/learn/llm-course/chapter1/1"], ["Guide", "Building Effective Agents", "https://www.anthropic.com/research/building-effective-agents"], ["Paper", "ReAct: Synergizing Reasoning and Acting in Language Models", "https://arxiv.org/abs/2210.03629"], ["Paper", "Retrieval-Augmented Generation", "https://arxiv.org/abs/2005.11401"], ["Repository", "smolagents", "https://github.com/huggingface/smolagents"]],
  },
  {
    id: "silicon", title: "Silicon Design & Verification", family: hardware, weeks: [7,8,9,10],
    roles: ["RTL design engineer", "Design verification engineer", "Physical design engineer"], needs: ["Digital logic", "Computer architecture", "Linux"],
    intro: "Take a small digital block from a specification through RTL, simulation, synthesis, and a physical design report.",
    subjects: [
      ["RTL and logic", "Combinational and sequential circuits, FSMs, Verilog/SystemVerilog, clocks, reset and CDC", "Build a FIFO and test reset, overflow, and underflow behavior."],
      ["Verification", "Testbenches, assertions, coverage, formal properties and debugging waveforms", "Write assertions that detect an intentional boundary bug."],
      ["Synthesis and physical design", "Technology mapping, timing constraints, floorplanning, place and route, STA and PPA", "Run synthesis and report the critical path and timing slack under explicit constraints."],
    ],
    capstone: ["Verified RTL block through layout", "Publish RTL, tests, timing reports, tool settings, and a reproducible build."],
    readings: [["Book", "Digital Design and Computer Architecture · RISC-V", "https://pages.hmc.edu/harris/ddca/ddcarv.html"], ["Paper", "OpenROAD: Toward a Self-Driving, Open-Source Digital Layout Implementation Tool Chain", "https://vlsicad.ucsd.edu/Publications/Conferences/370/c370.pdf"], ["Repository", "Yosys", "https://github.com/YosysHQ/yosys"], ["Repository", "OpenROAD Flow Scripts", "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts"]],
  },
  {
    id: "quantum-hardware", title: "Quantum Hardware & Error Correction", family: hardware,
    roles: ["Quantum hardware engineer", "Quantum control engineer", "QEC research engineer"], needs: ["Quantum mechanics", "Linear algebra", "Signals and probability"],
    intro: "Study how physical qubits are controlled, measured, and assembled into error-correcting experiments.",
    subjects: [
      ["Device platforms", "Superconducting circuits, trapped ions, photonic qubits, coherence and measurement", "Compare two platforms by their control and measurement constraints."],
      ["Control and characterization", "Pulse sequences, readout discrimination, calibration, relaxation and gate metrics", "Simulate a noisy pulse or readout model and fit its parameters."],
      ["Quantum error correction", "Stabilizers, syndrome extraction, decoding, surface codes and logical error rates", "Run a decoding experiment and plot logical error versus physical noise."],
    ],
    capstone: ["Reproducible QEC experiment", "Report the code distance, noise model, decoder, uncertainty, and result limits."],
    readings: [quantumBook, ["Course", "IBM Quantum Learning", "https://learning.quantum.ibm.com/"], ["Paper", "Surface codes: Towards practical large-scale quantum computation", "https://arxiv.org/abs/1208.0928"], ["Repository", "Stim", "https://github.com/quantumlib/Stim"], ["Repository", "PyMatching", "https://github.com/oscarhiggott/PyMatching"]],
  },
  {
    id: "startups", title: "Startups, Product & FinOps", family: ventures,
    roles: ["Founder", "Product engineer", "FinOps product builder"], needs: ["A domain you can observe", "Basic business and financial literacy"],
    intro: "Go from a recurring customer problem to a focused pilot, with clear evidence about the buyer, workflow, and economics.",
    subjects: [
      ["Customer and industry discovery", "Segments, recent behavior, workflow interviews, buyers and approval paths", "Interview users about a recent incident and map their current workaround."],
      ["Product and experiments", "Assumptions, scope, instrumentation, hypotheses, decision thresholds and pilot design", "Write a pilot proposal and specify what result would change your decision."],
      ["Business model and distribution", "Pricing, contribution margin, onboarding, retention, positioning and FinOps allocation", "Model one pricing unit and test the offer with a budget owner."],
    ],
    capstone: ["Pilot dossier", "Collect interview evidence, a workflow map, a testable offer, and a short decision memo."],
    readings: [["Course", "YC Startup School · How To Talk To Users", "https://www.youtube.com/watch?v=z1iF1c8w5Lg"], ["Book", "The Lean Startup", "https://theleanstartup.com/book"], ["Paper", "A Scientific Approach to Entrepreneurial Decision Making", "https://doi.org/10.1287/mnsc.2018.3249"], ["Repository", "FOCUS specification", "https://github.com/FinOps-Open-Cost-and-Usage-Spec/FOCUS_Spec", "Inspect a shared billing schema for the FinOps pilot."]],
  },
] satisfies PathInput[];

export type CareerPath = PathInput;
export const families: Family[] = [systems, intelligence, ventures, hardware, craft];

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  return [...new Map(items.map((item) => [key(item), item])).values()];
}

const studyPlans: Record<string, StudyPlan> = { ...systemsStudyPlans, ...advancedStudyPlans };
const workbookById = new Map(source.resources.map((resource) => [resource.id, workbookReference(resource)]));
const workbookByUrl = new Map([...workbookById.values()].map((resource) => [resource.url, resource]));

const quantRepositoryTools: Record<string, [string[], string[]]> = {
  vectorbt: [["Vectorized signals", "parameter sweeps", "portfolio statistics"], ["Python", "NumPy", "pandas"]],
  "Microsoft Qlib": [["Data handlers", "model baselines", "experiment tracking"], ["Python", "Qlib", "YAML"]],
  "FinRL / AI4Finance": [["Trading environments", "reward design", "benchmarking"], ["Python", "Gymnasium", "historical data"]],
  ABIDES: [["Discrete events", "market agents", "simulated order books"], ["Python", "ABIDES", "simulation logs"]],
};

function quantRepositoryReferences(): StudyResource[] {
  return source.quant.repos.flatMap(([repo, purpose, contribution]) => {
    if (!repo.url || !quantRepositoryTools[repo.text]) return [];
    const [concepts, tools] = quantRepositoryTools[repo.text];
    return [{
      kind: "Repository", title: repo.text, url: repo.url,
      coverage: purpose.text.trim(), concepts, tools,
      why: "Compare its research or simulation workflow with the assumptions in your own backtest.",
      activity: contribution.text.trim(),
    }];
  });
}

function quantPhases() {
  const fromWorkbook = (id: string) => workbookById.get(id)!;
  const extra = quantPhaseReferences;
  const references = [
    [fromWorkbook("EXT-015"), pathReference(varsity)],
    [extra.precalculus],
    [pathReference(["Course", "MIT 18.06 Linear Algebra", "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"]),
      pathReference(["Book", "Convex Optimization", "https://web.stanford.edu/~boyd/cvxbook/"])],
    [extra.probability],
    [extra.inference],
    [fromWorkbook("RES-042"), fromWorkbook("EXT-011")],
    [fromWorkbook("RES-014"), fromWorkbook("RES-003")],
    [fromWorkbook("EXT-012"), fromWorkbook("RES-031")],
    [extra.regression, extra.inference],
    [extra.timeSeries],
    [pathReference(varsity)],
    [pathReference(["Paper", "Common risk factors in the returns on stocks and bonds", "https://doi.org/10.1016/0304-405X(93)90023-5"]), fromWorkbook("EXT-015")],
    [pathReference(["Paper", "The Probability of Backtest Overfitting", "https://escholarship.org/uc/item/4w1110bb"]), fromWorkbook("EXT-015")],
    [fromWorkbook("RES-029"), extra.timeSeries],
    [pathReference(["Book", "Convex Optimization", "https://web.stanford.edu/~boyd/cvxbook/"]), extra.regression],
    [pathReference(["Book", "Algorithmic and High-Frequency Trading", "https://sebastian.statistics.utoronto.ca/books/algo-and-hf-trading/"]), fromWorkbook("RES-030")],
    [extra.stochastic],
    [extra.reproducibility, fromWorkbook("RES-043")],
    [extra.probability, fromWorkbook("EXT-004")],
  ];
  return source.quant.phases.map((phase, index) => ({ ...phase, references: references[index] }));
}

export function pathContent(path: CareerPath) {
  const domain = (value: string) => path.domains?.includes(value) ?? false;
  const week = (value: number) => path.weeks?.includes(value) ?? false;
  const plan = studyPlans[path.id];
  const assigned = plan.flatMap((module) => module.resources);
  const resourceKey = (resource: StudyResource) => resource.url.replace(/\/$/, "");
  const assignedUrls = new Set(assigned.map(resourceKey));
  const assignedTitles = new Set(assigned.map((resource) => resource.title.toLowerCase()));
  const imported = source.resources.filter((r) => domain(r.domain)).map((r) => workbookById.get(r.id)!);
  const existing = path.readings.map((reading) => workbookByUrl.get(reading[2]) ?? pathReference(reading));
  const quant = path.id === "finance" ? { ...source.quant, phases: quantPhases() } : null;
  const phaseResources = quant?.phases.flatMap((phase) => phase.references) ?? [];
  const supplemental = uniqueBy([...phaseResources, ...imported, ...existing, ...(quant ? quantRepositoryReferences() : [])], resourceKey)
    .filter((resource) => !assignedUrls.has(resourceKey(resource)) && !assignedTitles.has(resource.title.toLowerCase()));
  return {
    weeks: source.weeks.filter((r) => week(r.week)),
    lessons: source.lessons.filter((r) => week(r.week)),
    subjects: source.subjects.filter((r) => domain(r.domain)),
    projects: source.projects.filter((r) => domain(r.domain) || (path.id === "ai-agents" && r.week === 26)),
    plan,
    supplemental,
    resourceCount: new Set([...assigned, ...supplemental].map(resourceKey)).size,
    quant,
  };
}

export const curriculum = source;

export function workbookStudyResources() {
  const byWeek = workbookWeekReferences.map((ids) => ids.map((id) => workbookById.get(id)!));
  const assigned = uniqueBy(byWeek.flat(), (resource) => resource.url);
  const assignedUrls = new Set(assigned.map((resource) => resource.url));
  const supplemental = uniqueBy([...workbookById.values()], (resource) => resource.url)
    .filter((resource) => !assignedUrls.has(resource.url));
  return { byWeek, assigned, supplemental };
}
