import { useState } from "preact/hooks";

type Settings<T> = {
  data: T[];
  itemsPerPage: number;
};

export function usePaginate<T>({ data, itemsPerPage }: Settings<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = [...data].splice(
    (currentPage - 1) * itemsPerPage,
    itemsPerPage
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
  };
}
