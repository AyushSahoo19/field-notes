export type StudyResource = {
  kind: string;
  title: string;
  url: string;
  coverage: string;
  why: string;
  concepts: string[];
  tools: string[];
  activity: string;
};

export type StudyWeek = {
  title: string;
  topics: { title: string; concepts: string[] }[];
  tools: string[];
  practice: string;
  evidence: string;
  resources: StudyResource[];
};

export type StudyPlan = StudyWeek[];
