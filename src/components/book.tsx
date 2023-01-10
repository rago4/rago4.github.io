import { formatDate } from "../utils/format-date";

type Props = {
  data: {
    goodreads: string;
    title: string;
    author: string;
    year: number;
    rating: number;
    finished: string;
    sentence: string;
  };
};

export function Book({ data }: Props) {
  return (
    <a
      className="flex justify-between rounded p-2 shadow ring-1 ring-slate-700/10 hover:bg-slate-50"
      href={data.goodreads}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">{`${data.title} (${data.year})`}</p>
        <p className="mb-0.5 text-xs text-slate-800">{`by ${data.author}`}</p>
        <p className="text-xs text-slate-500">{`Read at ${formatDate(
          data.finished
        )}`}</p>
      </div>
      <ul className="flex space-x-0.5 text-sm">
        {Array.from({ length: 5 }, (_, index) => (
          <li
            key={index}
            className={data.rating - 1 < index ? "grayscale" : "grayscale-0"}
          >
            ⭐️
          </li>
        ))}
      </ul>
    </a>
  );
}
