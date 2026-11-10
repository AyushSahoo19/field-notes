import { pathContent, paths, type Family } from "./catalog";

export type PathCard = { id: string; title: string; family: Family; roles: string[]; intro: string; subjects: string[]; keywords: string[]; needs: string[]; resources: number; sourced: boolean };

export const pathCards: PathCard[] = paths.map((path) => {
  const content = pathContent(path);
  return {
    id: path.id, title: path.title, family: path.family, roles: path.roles, intro: path.intro, needs: path.needs,
    subjects: path.subjects.map(([title]) => title),
    keywords: [...path.subjects.map((s) => s[1]), ...content.subjects.flatMap((s) => s.concepts), ...content.lessons.map((l) => l.title)],
    resources: content.readings.length, sourced: Boolean(path.domains?.length),
  };
});
