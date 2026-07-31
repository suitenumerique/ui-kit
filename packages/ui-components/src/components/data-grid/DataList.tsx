import React from "react";
import { BaseProps, DataGrid, Row } from ":/components/data-grid/index";

export const DataList = <T extends Row>({ rows, ...props }: BaseProps<T>) => {
  return (
    <DataGrid
      {...props}
      displayHeader={false}
      rows={rows}
      columns={props.columns.map((column) => ({
        ...column,
      }))}
      enableSorting={false}
    />
  );
};
