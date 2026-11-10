const pagesBase = process.env.NEXT_PUBLIC_PAGES_BASE;

export function sitePath(path: string) {
  if (pagesBase === undefined || !path.startsWith("/") || path.startsWith("//")) return path;

  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : path.slice(suffixIndex);
  return pagesBase + pathname + (pathname.endsWith("/") ? "" : "/") + suffix;
}
