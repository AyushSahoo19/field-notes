export const studyAtlases = [
  {
    id: "ai-stack-atlas",
    title: "AI Stack Atlas",
    subtitle: "24 layers from silicon to agents and governance",
    description: "Explore the stack from physical materials and chip architecture through training, inference, applications, and safety. Search the entries, filter by type, or follow a request through the layers.",
    sections: [
      ["L00", "Physics & materials"], ["L02", "Chips"], ["L08", "Architectures"],
      ["L13", "Inference"], ["L17", "Agents"], ["L21", "Robotics"], ["request-trace", "Request walkthrough"],
    ],
  },
  {
    id: "avenra-ai",
    title: "Avenra AI",
    subtitle: "Crucible’s technology and builder atlas",
    description: "Explore the Crucible atlas through technology chokepoints, builder tracks, projects, and the toolchain.",
    sections: [
      ["atlas", "Chokepoint atlas"], ["stack", "Technology stack"], ["teardown", "Teardowns"],
      ["tracks", "Builder tracks"], ["projects", "Projects"], ["mirror", "Mirror"], ["tools", "Toolchain"],
    ],
  },
  {
    id: "the-forge",
    title: "The Forge",
    subtitle: "19 phases of systems, AI, and automation",
    description: "Follow the learning method, phase map, and hands-on curriculum. Open the study tabs inside a phase or jump to its parallel tracks, capstones, and timeline.",
    sections: [
      ["method", "Learning method"], ["map", "Phase map"], ["phases", "Curriculum"], ["P13", "Math for ML"],
      ["P16", "AI systems"], ["tracks", "Parallel tracks"], ["capstones", "Capstones"], ["timeline", "Timeline"],
    ],
  },
] as const;

export type StudyAtlasId = (typeof studyAtlases)[number]["id"];

export function studyAtlas(id: string) {
  return studyAtlases.find((atlas) => atlas.id === id);
}

export function studyAtlasPage(id: StudyAtlasId) {
  return `/learning/domain-map/${id}`;
}

export const domainMapSections = [
  { id: "career-domains", title: "Career domains", subtitle: "Connections across 21 learning paths", href: "/learning/domain-map" },
  ...studyAtlases.map(({ id, title, subtitle }) => ({ id, title, subtitle, href: studyAtlasPage(id) })),
];
