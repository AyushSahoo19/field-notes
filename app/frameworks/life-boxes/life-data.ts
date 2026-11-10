export const boxes = [
  { id: "math", title: "Mathematics & Exams", short: "Study", cadence: "Daily focus block", tone: "blue", actions: [
    "Study one topic from linear algebra, calculus, probability, or statistics.",
    "Solve a timed IIT JAM MA/MS or GATE DA set and record the mistakes to revisit.",
    "Reserve calendar time for the next BCA submission or deadline.",
  ] },
  { id: "engineering", title: "Software & AI Mastery", short: "Build", cadence: "Three sessions per week", tone: "violet", actions: [
    "Practice C++, DSA, Linux, or systems fundamentals using one small exercise.",
    "Build and test a feature or ML experiment. Save the result and what failed.",
    "Finish a demo, benchmark, README, or focused open-source patch.",
  ] },
  { id: "career", title: "Career & Field Impact", short: "Work", cadence: "Each shift + weekly review", tone: "teal", actions: [
    "Choose the shift task that matters most and record the next action.",
    "Advance one KIM improvement, such as haul-road gradient analysis or telemetry.",
    "Capture verified results and prepare a short summary for the team.",
  ] },
  { id: "avenra", title: "Avenra AI & Business", short: "Avenra", cadence: "Two sessions per week", tone: "violet", actions: [
    "Pick one engineering problem and name who faces it.",
    "Speak with a potential user about their current workflow and what slows it down.",
    "Build a small demo with sample data and define what would justify a pilot.",
  ] },
  { id: "money", title: "Money & Capital", short: "Money", cadence: "Quick log + Sunday review", tone: "amber", actions: [
    "Record spending and check upcoming bills, cash flow, and planned savings.",
    "Review personal spending, business costs, and trading research separately.",
    "Test one quant idea in simulation and record costs, assumptions, and results.",
  ] },
  { id: "health", title: "Health & Energy", short: "Health", cadence: "Daily anchor", tone: "teal", actions: [
    "Set a sleep and wake window around your shifts.",
    "Block time for a walk, training, or badminton.",
    "After a demanding shift, keep the evening light and protect recovery.",
  ] },
  { id: "people", title: "Relationships & Service", short: "People", cadence: "Daily contact + monthly service", tone: "blue", actions: [
    "Spend a few screen-free minutes with someone you care about.",
    "Plan one longer call, meal, or visit with family or friends each week.",
    "Teach a skill, mentor a learner, or volunteer once a month.",
  ] },
  { id: "creative", title: "Creativity & Adventure", short: "Create", cadence: "Saturday build + monthly outing", tone: "amber", actions: [
    "Explore a question in AI, physics, or quantum computing from first principles.",
    "Make a diagram, experiment, or story for Randomness but Relevant.",
    "Choose one new place, event, or experience to try each month.",
  ] },
] as const;

export type BoxId = (typeof boxes)[number]["id"];
export type Activity = { id: string; box: BoxId; title: string };
export type DayMode = "normal" | "short" | "reset";
export type Outcome = "study" | "build" | "life";
export type WeekPlan = {
  checked: string[];
  custom: Activity[];
  schedule: Record<string, number>;
  modes: Partial<Record<number, DayMode>>;
  outcomes: Record<Outcome, string>;
  reviewed: BoxId[];
  nextActions: Partial<Record<BoxId, string>>;
};
export type PlannerData = Record<string, WeekPlan>;

export const emptyWeek: WeekPlan = {
  checked: [], custom: [], schedule: {}, modes: {}, outcomes: { study: "", build: "", life: "" }, reviewed: [], nextActions: {},
};

export const suggestedActivities: Activity[] = boxes.flatMap((box) => box.actions.map((title, index) => ({
  id: `${box.id}-${index + 1}`, box: box.id, title,
})));
export const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const rotation = [
  { label: "Software & AI", detail: "Finish one test, benchmark, or feature." },
  { label: "Software & AI", detail: "Finish one test, benchmark, or feature." },
  { label: "Avenra AI", detail: "Interview a user or test one part of the demo." },
  { label: "Software & AI", detail: "Finish one test, benchmark, or feature." },
  { label: "Avenra AI", detail: "Interview a user or test one part of the demo." },
  { label: "Creative work", detail: "Make one visual or script. Use the math block for a timed set and error review." },
  { label: "Money & reset", detail: "Spend 30 minutes on money and 30 minutes on review. Leave room for people and adventure." },
];

export function timeBlocks(mode: DayMode, day: number) {
  if (mode === "short") return [
    { minutes: 30, title: "Math or error review", tone: "blue" },
    { minutes: 15, title: "Plan tomorrow or check in", tone: "amber" },
  ];
  if (mode === "reset") return [
    { minutes: 30, title: "Money review", tone: "amber" },
    { minutes: 30, title: "Review all eight boxes", tone: "violet" },
  ];
  return [
    { minutes: 75, title: "Math & exam practice", tone: "blue" },
    { minutes: 60, title: day === 6 ? "Choose a project block" : rotation[day].label, tone: "violet" },
    { minutes: 30, title: "Movement or badminton", tone: "teal" },
    { minutes: 15, title: "People and daily close", tone: "amber" },
  ];
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dayOffset(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export function weekOf(date: Date) {
  return dayOffset(dateKey(date), -((date.getDay() + 6) % 7));
}
export function dayLabel(key: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(`${key}T12:00:00`));
}
