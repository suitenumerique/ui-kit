import type { Meta } from "@storybook/react";
import databaseCars from "./resources/databaseCars.json";

import { Button, DataGrid, SimpleDataGrid } from "@gouvfr-lasuite/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Datagrid",
  component: DataGrid,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof DataGrid>;

export default meta;

export const Empty = () => {
  return (
    <DataGrid
      columns={[
        {
          field: "firstName",
          headerName: "First name",
          highlight: true,
        },
      ]}
      rows={[]}
    />
  );
};

export const EmptyCustomWithButton = () => {
  return (
    <DataGrid
      columns={[
        {
          field: "firstName",
          headerName: "First name",
          highlight: true,
        },
      ]}
      rows={[]}
      emptyPlaceholderLabel="This table is empty, create the first object"
      emptyCta={
        <Button icon={<span className="material-icons">add</span>}>
          Create object
        </Button>
      }
    />
  );
};

export const ClientSideWithPagination = () => {
  return (
    <>
      <SimpleDataGrid
        columns={[
          {
            field: "carName",
            headerName: "Nom",
            enableSorting: false,
          },
          {
            field: "year",
            headerName: "Année",
          },
          {
            field: "price",
            headerName: "Prix",
            highlight: true,
          },
        ]}
        rows={databaseCars}
        defaultPaginationParams={{
          pageSize: 5,
        }}
        defaultSortModel={[
          {
            field: "price",
            sort: "desc",
          },
        ]}
      />
    </>
  );
};
