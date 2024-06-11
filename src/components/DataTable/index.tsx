import { useMemo, useState } from 'react';
import {
  ColumnDef,
  SortingState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
// import { useActiveChainId } from 'hooks/chain/useActiveChainId';
// import useBreakpoints from 'hooks/utils/useBreakpoints';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from 'utils/classname';
// import { ChainId, SCAN_URLS } from 'config/chain';
// import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui';
import { useChainId } from 'lib/chains';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import Button from 'components/Button/Button';
import useBreakpoints from './useBreakpoints';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  paginations: (string | number)[];
}

export const DOTS = '...';

const getPageRange = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx: number) => idx + start);
};

export const usePaginations = ({
  totalPageCount,
  siblingCount = 1,
  currentPage,
}: {
  totalPageCount: number;
  siblingCount?: number;
  currentPage: number;
}): (string | number)[] => {
  return useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return getPageRange(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = getPageRange(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = getPageRange(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = getPageRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    return [];
  }, [totalPageCount, siblingCount, currentPage]);
};

export function DataTablePagination<TData>({ table, paginations }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  return (
    <div className="relative mt-6 flex items-center justify-between">
      <div className="flex-1 text-sm">
        Page {pageIndex + 1} of
        <span className="mx-2">{table.getPageCount()}</span>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <div
            // type="button"
            // variant="primary"
            className="h-8 w-8 rounded-lg border-[#5C5C5C] p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            // disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4 text-white" />
          </div>
          <div
            // type="button"
            // variant="primary"
            className="h-8 w-8 border-[#5C5C5C] p-0 flex"
            onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </div>
          {paginations.map((pageNum, i) => {
            if (pageNum === DOTS) {
              return <span key={i}>...</span>;
            }
            return (
              <Button
                variant="primary"
                type="button"
                className={cn("h-8 w-8 rounded-lg p-0 lg:flex", {
                  "bg-black text-white dark:bg-[#424242] dark:text-white dark:border-none":
                    Number(pageNum) - 1 === pageIndex,
                  "bg-transparent  hover:bg-transparent dark:text-[#ADADAD] dark:bg-transparent border-none":
                    Number(pageNum) - 1 !== pageIndex,
                })}
                key={i}
                onClick={() => table.setPageIndex(Number(pageNum) - 1)}
              >
                {pageNum}
              </Button>
            );
          })}
          <div
            // type="button"
            // variant="primary"
            className="h-8 w-8 border-[#5C5C5C] p-0 flex"
            onClick={() => table.nextPage()}
            // disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4 text-white" />
          </div>
          <div
            // type="button"
            // variant="primary"
            className="h-8 w-8 rounded-lg border-[#5C5C5C] p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            // disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const { chainId } = useChainId();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { isMobile } = useBreakpoints();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    autoResetAll: false,
    autoResetPageIndex: false,
  });
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const paginations = usePaginations({
    totalPageCount: pageCount,
    currentPage: pageIndex,
  });
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent dark:border-[#5C5C5C] dark:hover:bg-transparent border-none border-0"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-0 pt-6  font-normal leading-[22px] text-gray1 dark:border-[#5C5C5C] dark:text-[#ADADAD] border-none border-0"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  className="border-none border-0"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // onClick={() => {
                  //   if (isMobile) {
                  //     const { id: transID }: any = row.original;
                  //     window.open(`${SCAN_URLS[chainId as ChainId]}/tx/${transID.split('-')[0]}`);
                  //   }
                  // }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-0 border-none py-4 pl-0  font-normal leading-[22px] dark:border-[#5C5C5C] mobile:border-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <>
              <TableRow className="mobile:hidden">
                <TableCell colSpan={columns.length}>
                  <div className="flex-col items-center justify-center pt-4">
                    {/* <Image
                      className='mx-auto my-6 hidden dark:flex'
                      src='/./svgs/illustrations/no-transaction-dark.svg'
                      width='200'
                      height='50'
                      alt='no-transaction'
                    />
                    <Image
                      className='mx-auto my-6 flex dark:hidden'
                      src='/./svgs/illustrations/no-transaction.svg'
                      width='200'
                      height='50'
                      alt='no-transaction'
                    /> */}
                    <div className="flex flex-col items-center justify-start gap-2 pb-10">
                      <div className="text-center text-[20px] font-bold leading-relaxed ">No transactions found!</div>
                      <div className="text-center text-[16px] font-normal leading-normal text-zinc-600 dark:text-[#838383]">
                        Connect your wallet & deposit your assets to start
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <div className="hidden flex-col items-center justify-center pt-4 mobile:flex">
                <img
                  className="mx-auto my-6 hidden dark:flex"
                  src="/./svgs/illustrations/no-transaction-dark.svg"
                  width="200"
                  height="50"
                  alt="no-transaction"
                />
                <img
                  className="mx-auto my-6 flex dark:hidden"
                  src="/./svgs/illustrations/no-transaction.svg"
                  width="200"
                  height="50"
                  alt="no-transaction"
                />
                <div className="flex flex-col items-center justify-start gap-2 pb-10">
                  <div className="text-center text-[20px] font-bold leading-relaxed ">No transactions found!</div>
                  <div className="text-center text-[16px] font-normal leading-normal text-zinc-600 dark:text-[#838383]">
                    Connect your wallet & deposit your assets to start
                  </div>
                </div>
              </div>
            </>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} paginations={paginations} />
    </div>
  );
}
