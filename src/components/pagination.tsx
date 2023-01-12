import { cn } from "../utils/cn";

type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
};

export function Pagination({ totalPages, currentPage, onChange }: Props) {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={index}
            className={cn([
              "h-6 w-6 rounded text-sm font-semibold shadow ring-1",
              page === currentPage
                ? "bg-slate-50 text-slate-700 ring-slate-700/20"
                : "text-slate-600 ring-slate-700/10 hover:ring-slate-700/20",
            ])}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
