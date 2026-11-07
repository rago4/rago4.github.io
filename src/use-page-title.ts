import { useLayoutEffect } from "preact/hooks";

export function usePageTitle(page?: string) {
  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = page ? `${page} · rgolawski` : "rgolawski";

    return () => {
      document.title = previousTitle;
    };
  }, [page]);
}
