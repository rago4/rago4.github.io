import { Article as TArticle } from "../hooks/use-articles";
import { formatDate } from "../utils/format-date";

type Props = {
  data: TArticle;
};

export function Article({ data }: Props) {
  return (
    <a
      className="block rounded-md p-2 shadow ring-1 ring-slate-700/10 hover:bg-slate-50"
      href={data.url}
    >
      <p className="text-sm font-semibold text-slate-800">{data.title}</p>
      <p className="text-xs text-slate-500">
        {formatDate(data.published_at)} &bull; {data.reading_time_minutes} min
        read
      </p>
    </a>
  );
}
