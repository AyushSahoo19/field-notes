import type { StudyResource } from "./study-plan-types";

// The source workbook labels most links generically. These notes describe the
// specific material to use and the environment for applying it.
type Notes = [concepts: string, tools: string, activity: string];

const notes: Record<string, Notes> = {
  "RES-001": ["Value semantics · RAII · templates · standard containers", "C++ · CMake · GCC or Clang", "Implement a move-aware buffer and test copying, moving, and destruction."],
  "RES-002": ["Divide and conquer · graph search · greedy algorithms · dynamic programming", "Python or C++ · test runner", "Solve one exercise per technique and record the invariant and complexity."],
  "RES-003": ["Hashing · trees · heaps · shortest paths · dynamic programming", "Python · MIT OCW notes and problem sets", "Work a problem set by hand before checking the implementation against edge cases."],
  "RES-004": ["Boolean gates · arithmetic logic · sequential memory · Hack CPU", "Hack HDL · Hardware Simulator · CPU Emulator", "Build the ALU and CPU from tested parts and run the supplied test scripts."],
  "RES-005": ["System calls · page tables · traps · locking · filesystems", "xv6 · RISC-V · QEMU · GDB", "Read the matching lab and trace an operation from user code into the kernel."],
  "RES-006": ["Storage pages · buffer pools · indexes · query execution · recovery", "C++ · BusTub · SQL", "Connect one lecture topic to its matching BusTub operator or storage component."],
  "RES-007": ["RPC · replication · Raft · sharding · distributed storage", "Go · lab harness · race detector", "Run the assigned lab tests and write down the failure each test models."],
  "RES-008": ["Backpropagation · optimization · regularization · CNNs · sequence models", "Python · NumPy · TensorFlow · Jupyter", "Use the matching course assignment to compare a baseline with one controlled change."],
  "RES-009": ["Pointers · arrays · structures · allocation · files", "C · GCC or Clang · sanitizers", "Draw ownership for a growing array and test zero capacity and allocation errors."],
  "RES-010": ["Socket lifecycle · address resolution · TCP streams · partial I/O", "C · POSIX sockets · loopback", "Write a local client and server that handle a deliberately fragmented message."],
  "RES-011": ["CPU scheduling · virtual memory · concurrency · persistence", "C · OSTEP simulators", "Predict a scheduler or memory simulator trace before running it."],
  "RES-012": ["Shell composition · editors · Git · debugging · profiling", "Unix shell · Git · command-line utilities", "Turn one manual build-and-test sequence into a reproducible script."],
  "RES-013": ["System calls · signals · file descriptors · POSIX interfaces", "Linux · man · C library", "Read the errors and return values for two calls used in your program."],
  "RES-014": ["Object lifetime · references · classes · templates · move semantics", "C++ · GCC or Clang", "Write short examples that show when copying, moving, and destruction occur."],
  "RES-015": ["Language rules · STL contracts · iterator invalidation · complexity guarantees", "C++ standard library · compiler", "Look up the guarantees for two containers and test a legal edge case for each."],
  "RES-016": ["Python idioms · functions · classes · iterators · testing", "Python · unittest or pytest", "Refactor a small script using one item from the relevant chapter and preserve behavior with tests."],
  "RES-017": ["Machine code · data representation · caches · memory · linking", "C · GCC · GDB · objdump", "Inspect the assembly for a small C loop and explain how data layout affects the accesses."],
  "RES-018": ["Storage engines · replication · partitioning · transactions", "Architecture diagrams · workload traces", "Compare two designs under an explicit workload and failure model."],
  "RES-019": ["Offline archive browsing · ZIM access · browser integration", "JavaScript · browser devtools · Git", "Reproduce a documented behavior using a small local archive and write a regression case."],
  "RES-020": ["Fixtures · parametrization · test collection · plugins", "Python · pytest · Git", "Convert a repeated test into a fixture and parametrized cases."],
  "RES-021": ["Format strings · formatters · type-safe formatting", "C++ · fmt · CMake", "Add a formatter for one local type and test invalid or boundary inputs."],
  "RES-022": ["URL transfers · HTTP behavior · connection handling", "curl CLI · libcurl · local HTTP server", "Use verbose output to explain one request and inspect the corresponding client behavior."],
  "RES-023": ["In-memory data structures · expiration · persistence options", "Redis · redis-cli · local test instance", "Compare keys with and without expiry and record the chosen persistence settings."],
  "RES-024": ["Tensor operators · autograd · modules · training utilities", "Python · PyTorch · CPU or CUDA", "Trace one operator from a minimal training loop to its public API and tests."],
  "RES-025": ["Event-driven strategies · portfolio state · fills · backtesting", "LEAN · Python or C# · historical test data", "Run a historical simulation with explicit fees and a baseline. Record the assumptions."],
  "RES-026": ["Circuit construction · measurement · transpilation", "Python · Qiskit · simulator", "Compare a simple circuit before and after transpilation and inspect its depth."],
  "RES-027": ["ROS nodes · topics · actions · middleware integration", "ROS 2 · colcon · ros2 CLI", "Build or run two nodes and inspect their graph and topic traffic."],
  "RES-028": ["LLVM IR · optimization passes · target code generation", "Clang · LLVM · opt", "Compile a simple function to IR, run a pass, and explain what changed."],
  "RES-029": ["Estimators · preprocessing pipelines · cross-validation · metrics", "Python · scikit-learn · NumPy", "Fit preprocessing inside cross-validation and compare it with a simple baseline."],
  "RES-030": ["Event-driven replay · strategy lifecycle · order and fill models", "NautilusTrader · Python · historical data", "Replay an example and reconcile fills and positions with the event log."],
  "RES-031": ["Analytical SQL · vectorized execution · columnar input", "DuckDB · SQL · Parquet", "Compare the query plan for a filtered aggregation over CSV and Parquet."],
  "RES-032": ["Protocol Buffers · unary and streaming RPC · deadlines", "gRPC · protoc · Go or Python", "Generate a local service stub and verify deadline behavior with a slow handler."],
  "RES-033": ["Replicated key-value state · watches · leases · transactions", "etcd · etcdctl · Go", "Use a local cluster to observe lease expiration and a watch event."],
  "RES-034": ["Addressing · switching · routing · subnetting", "Packet diagrams · Wireshark · local network lab", "Draw the path between two subnets and identify the address at each layer."],
  "RES-035": ["Computation graphs · chain rule · reverse-mode gradients", "Python · micrograd · notebooks", "Compute the gradient of a tiny expression by hand and compare it with autodiff."],
  "RES-036": ["Index layout · internal and leaf pages · key lookup and splits", "CMU slides · BusTub · diagrams", "Trace insertions until a leaf splits and explain the updated separator."],
  "RES-037": ["Distributed computation · partial failures · system design constraints", "MIT lecture notes · Go for follow-on labs", "List the failure modes that a single-process implementation can ignore."],
  "RES-038": ["Tensors · datasets · training loops · model evaluation", "Python · PyTorch · Jupyter", "Reproduce a training loop with fixed splits and inspect failures by class."],
  "RES-039": ["Market data · strategy rules · backtesting · performance metrics", "Python · pandas · notebooks", "Evaluate a historical baseline with explicit fees and held-out dates."],
  "RES-040": ["Nodes · publishers and subscribers · services · launch", "ROS 2 · Python or C++ · ros2 CLI", "Launch a publisher and subscriber together and verify the message schema."],
  "RES-041": ["Qubits · gates · measurement · quantum algorithms", "Circuit simulator · Python where exercises use it", "Write expected measurement probabilities for a small circuit before simulating it."],
  "RES-042": ["Data types · modules · file I/O · standard library", "Python · REPL · venv", "Use the library reference to handle file errors in a tested command-line script."],
  "RES-043": ["Assertions · fixtures · parametrization · temporary paths", "Python · pytest", "Write a parametrized test that includes an empty case and a boundary case."],
  "RES-044": ["Workflows · triggers · jobs · artifacts · permissions", "GitHub Actions · YAML · Git", "Create a test workflow with read-only permissions and inspect its job output."],
  "RES-045": ["Images · Dockerfiles · containers · networks · Compose", "Docker CLI · Docker Compose", "Containerize a small app and rebuild it from a clean checkout."],
  "RES-046": ["Character tokenization · language modeling · bigram baselines", "Python · PyTorch · Jupyter", "Train a character baseline and report train and validation loss separately."],
  "EXT-001": ["C · memory · data structures · Python and SQL fundamentals", "CS50 tools · C · Python", "Complete the problem set closest to your current gap and explain its trade-offs."],
  "EXT-002": ["Logic · computer organization · assembler · VM translation", "Hack HDL · Nand2Tetris simulators", "Run the provided tests at every abstraction boundary before starting the next project."],
  "EXT-003": ["Number representation · RISC-V · datapaths · caches", "C · RISC-V · course simulators", "Trace a short instruction sequence and explain register and memory changes."],
  "EXT-004": ["Sorting and searching · graph algorithms · dynamic programming", "C++ or Python · CSES judge", "Solve two problems from the same section with different edge cases."],
  "EXT-005": ["Arrays · hashing · trees · graphs · problem patterns", "Chosen language · online judge", "Solve one problem without hints and record its time and space complexity."],
  "EXT-006": ["Relational storage · indexes · execution · transactions", "CMU lecture notes · BusTub · SQL", "Find the lecture and project that match your module and trace their shared invariant."],
  "EXT-007": ["xv6 labs · process isolation · memory · concurrency", "C · QEMU · xv6", "Use the schedule to locate a lecture and its corresponding lab tests."],
  "EXT-010": ["Tensor shapes · modules · optimization · data loading", "Python · PyTorch", "Look up one API contract and reproduce it on a batch with known dimensions."],
  "EXT-011": ["Array shapes · broadcasting · vectorization · linear algebra", "Python · NumPy", "Replace a nested loop with array operations and assert numerical equivalence."],
  "EXT-012": ["SQL · indexing · EXPLAIN · transaction isolation", "PostgreSQL · psql", "Compare two execution plans and verify an isolation behavior with two sessions."],
  "EXT-014": ["Metric types · labels · scraping · PromQL", "Prometheus · PromQL", "Expose a counter and query its rate over a known workload."],
  "EXT-015": ["Data subscriptions · backtests · fill models · fees", "LEAN · Python or C#", "Configure realistic costs and compare two runs with a fixed dataset."],
  "EXT-016": ["Nodes · interfaces · transforms · launch and recording", "ROS 2 · colcon · rosbag2", "Record and replay topic data and confirm the expected node consumes it."],
  "EXT-017": ["Circuit APIs · transpilation · execution primitives", "Python · Qiskit", "Simulate a small circuit and note how the transpiler changes the gate set."],
  "READ-001": ["Map and reduce · partitioning · shuffle · task retries", "Paper diagrams · Go or Python lab", "Trace the shuffle and explain how a failed worker can safely repeat a task."],
  "READ-002": ["Chunk storage · metadata · replication · large-file workloads", "Architecture diagrams · local storage prototype", "Draw one write path and list the work the master coordinates."],
  "READ-003": ["Leader election · log replication · commit safety", "State diagrams · Go lab", "Walk through a split vote and explain what permits a new leader to commit."],
  "READ-004": ["Global replication · TrueTime · externally consistent transactions", "Timeline diagrams · paper figures", "Draw overlapping transactions and explain the role of commit wait."],
  "READ-005": ["Coarse-grained locks · sessions · leases · sequencers", "Failure timelines · local lock prototype", "Explain how a paused client can hold stale information after its session ends."],
  "READ-006": ["Scaled dot-product attention · multi-head attention · position encodings", "Python · PyTorch · tensor diagrams", "Annotate query, key, and value shapes in one attention calculation."],
  "READ-007": ["First and second moments · bias correction · learning rate", "Python · NumPy or PyTorch", "Reproduce the first few updates on a scalar objective and compare with SGD."],
  "READ-012": ["Files · processes · threads · IPC · sockets", "Linux · C · man pages", "Implement a small process pipeline and check each system call for errors."],
  "READ-013": ["Modern C++ types · resource management · containers · templates", "C++ · compiler · standard library", "Implement the chapter example with an added test for a lifetime edge case."],
  "READ-015": ["RPC request handling · threads · timeouts · duplicate calls", "Go · MIT lab harness", "Trace how one delayed or repeated request reaches the server handler."],
};

const aliases: Record<string, string> = {
  "EXT-008": "RES-034", "EXT-009": "RES-035", "EXT-013": "RES-045",
  "READ-008": "RES-011", "READ-009": "RES-018", "READ-010": "RES-017",
  "READ-011": "RES-016", "READ-014": "RES-036", "READ-016": "RES-035",
};

const bookLinks: Record<string, string> = {
  "RES-016": "https://effectivepython.com/",
  "RES-017": "https://csapp.cs.cmu.edu/",
  "RES-018": "https://dataintensive.net/",
  "READ-012": "https://man7.org/tlpi/",
  "READ-013": "https://www.stroustrup.com/tour3.html",
};

export function workbookReference(resource: {
  id: string; kind: string; title: string; url: string; domain: string;
}): StudyResource {
  const noteId = aliases[resource.id] ?? resource.id;
  const [concepts, tools, activity] = notes[noteId];
  return {
    kind: resource.kind,
    title: resource.title,
    url: resource.url || bookLinks[noteId],
    coverage: concepts.replaceAll(" · ", ", ") + ".",
    why: `Use this ${resource.kind.toLowerCase()} to connect ${concepts.split(" · ")[0].toLowerCase()} with a concrete ${resource.domain} exercise.`,
    concepts: concepts.split(" · "),
    tools: tools.split(" · "),
    activity,
  };
}

// Ordered reading and implementation references for each original workbook week.
export const workbookWeekReferences = [
  ["RES-009", "RES-014"], ["RES-014", "RES-003"], ["RES-001", "RES-002"],
  ["RES-015", "RES-003"], ["RES-003", "EXT-004"], ["RES-003", "EXT-004"],
  ["EXT-002", "RES-003"], ["EXT-002", "RES-002"], ["EXT-002", "RES-003"],
  ["EXT-002", "EXT-003"], ["RES-005", "RES-013"], ["RES-005", "RES-011"],
  ["RES-005", "RES-011"], ["RES-010", "RES-022"], ["EXT-006", "RES-006"],
  ["EXT-006", "RES-036"], ["EXT-006", "EXT-012"], ["EXT-006", "EXT-012"],
  ["RES-007", "READ-001", "READ-015"], ["RES-007", "READ-003"],
  ["RES-007", "READ-005"], ["RES-007", "EXT-014"], ["RES-008", "RES-035"],
  ["RES-008", "READ-007"], ["RES-008", "READ-006"], ["RES-044", "RES-045", "EXT-014"],
];
