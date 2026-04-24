import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;               
  activePage: number;            
  onPageChange: (page: number) => void;
  nextLabel?: React.ReactNode;
  previousLabel?: React.ReactNode;
  breakLabel?: React.ReactNode;
}

export default function Pagination({
  totalPages,
  activePage,
  onPageChange,
  nextLabel = "→",
  previousLabel = "←",
  breakLabel = "…",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={Math.max(0, Math.min(totalPages - 1, activePage - 1))}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      breakLabel={breakLabel}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.prevItem}
      previousLinkClassName={css.prevLink}
      nextClassName={css.nextItem}
      nextLinkClassName={css.nextLink}
      breakClassName={css.breakItem}
      breakLinkClassName={css.breakLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      renderOnZeroPageCount={null}
    />
  );
}