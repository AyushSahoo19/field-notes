import { studyAtlas, studyAtlasPage } from "../../study-atlases";

export async function GET(_request: Request, { params }: { params: Promise<{ atlas: string }> }) {
  const atlas = studyAtlas((await params).atlas);
  if (!atlas) return new Response("Atlas not found", { status: 404 });

  return new Response(null, { status: 308, headers: { Location: studyAtlasPage(atlas.id) } });
}
