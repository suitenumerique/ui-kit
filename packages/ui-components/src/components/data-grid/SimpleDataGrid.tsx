import React, { useEffect, useMemo, useState } from "react";
import { usePagination } from ":/components/pagination";
import {
  BaseProps,
  DataGrid,
  Row,
  SortModel,
} from ":/components/data-grid/index";

/**
 * Handles sorting, pagination.
 */
export const SimpleDataGrid = <T extends Row>({
  rows,
  defaultPaginationParams,
  defaultSortModel = [],
  ...props
}: BaseProps<T> & {
  /** Pagination default props, should never change. */
  defaultPaginationParams?: Parameters<typeof usePagination>[0] | boolean;
  /** Pagination default props, should never change. */
  defaultSortModel?: SortModel;
}) => {
  const [realRows, setRealRows] = useState<T[]>([]);
  const [sortModel, setSortModel] = useState<SortModel>(defaultSortModel);
  const realPaginationParams = useMemo(() => {
    if (typeof defaultPaginationParams === "boolean") {
      return {};
    }
    return defaultPaginationParams;
  }, [defaultPaginationParams]);

  const paginationState = usePagination(realPaginationParams ?? {});
  const pagination = realPaginationParams ? paginationState : undefined;

  useEffect(() => {
    pagination?.setPagesCount(Math.ceil(rows.length / pagination.pageSize));
  }, [rows]);

  useEffect(() => {
    const sortKey = sortModel.length > 0 ? sortModel[0].field : "id";
    const sortPolarity =
      sortModel.length > 0 && sortModel[0].sort === "asc" ? 1 : -1;
    const sortedRows = [...rows].sort((a, b) => {
      const left = a[sortKey] as number;
      const right = b[sortKey] as number;
      if (left < right) return -sortPolarity;
      if (left > right) return sortPolarity;
      return 0;
    });

    if (pagination) {
      setRealRows(
        sortedRows.slice(
          (pagination.page - 1) * pagination.pageSize,
          pagination.page * pagination.pageSize,
        ),
      );
    } else {
      setRealRows(sortedRows);
    }
  }, [pagination?.page, sortModel, rows]);

  return (
    <DataGrid
      {...props}
      pagination={pagination}
      rows={realRows}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
    />
  );
};
