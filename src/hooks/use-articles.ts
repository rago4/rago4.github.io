import { useEffect, useState } from "preact/hooks";

export type Article = {
  id: string;
  title: string;
  url: string;
  published_at: string;
  reading_time_minutes: number;
};

export function useArticles() {
  const [data, setData] = useState<Article[]>([]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      fetch("https://dev.to/api/articles?username=rgolawski")
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch(console.error);
    }

    return () => {
      ignore = true;
    };
  }, []);

  return data;
}
