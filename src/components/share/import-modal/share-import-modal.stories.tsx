import { useState } from "react";
import type { Meta } from "@storybook/react";
import {
  Description,
  Title,
  Subtitle,
  Primary,
  ArgTypes,
} from "@storybook/blocks";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { ShareImportModal } from "./ShareImportModal";

/**
 * The `ShareImportModal` component displays a modal to import contacts from a CSV or XLSX file.
 * The file is parsed by the component itself: `onImport` receives the parsed rows, not the file.
 *
 * ## Installation
 *
 * ```tsx
 * import { ShareImportModal } from "@gouvfr-lasuite/ui-kit";
 * ```
 *
 * ## Basic Usage
 *
 * ```tsx
 * <ShareImportModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onImport={(rows) => inviteContacts(rows)}
 * />
 * ```
 *
 * ## Expected File Format
 *
 * The file must be a `.csv` or `.xlsx` file of **two columns without a header row**:
 * the first column is the email, the second one is the role.
 *
 * ```csv
 * amandine.salambo@lasuite.fr;reader
 * desirae.dokidis@lasuite.fr;editor
 * ```
 *
 * - CSV delimiters `;` and `,` are both supported (auto-detected).
 * - The maximum file size is 200 KB.
 * - At most 100 rows can be imported by default (configurable with `maxRows`).
 * - A template file is provided: the "Download template" button downloads it
 *   (override this behavior with `onDownloadTemplate`).
 *
 * ## Data Types
 *
 * ### ShareImportRow
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `email` | `string` | First column of the file |
 * | `role` | `string` | Second column of the file |
 *
 * ## Error Handling
 *
 * Parsing errors are displayed in an `Alert` below the file uploader and keep
 * the Import button disabled:
 *
 * | Error | Cause |
 * |-------|-------|
 * | File too large | The file exceeds 200 KB |
 * | Unreadable | The file could not be read or is not a valid CSV/XLSX |
 * | Empty | The file contains no rows |
 * | Invalid row | A row doesn't have exactly two non-empty columns (the row number is reported) |
 * | Too many rows | The file has more rows than `maxRows` (100 by default) |
 *
 * On success, the uploader description tells how many rows are ready to be
 * imported.
 */
const meta: Meta<typeof ShareImportModal> = {
  title: "Components/Share/ImportModal",
  component: ShareImportModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgTypes />
        </>
      ),
    },
  },
  argTypes: {
    isOpen: {
      description: "Controls the modal open state",
      control: "boolean",
    },
    onClose: {
      description: "Callback called on close",
      control: false,
    },
    title: {
      description: "Overrides the default modal title",
      control: "text",
    },
    description: {
      description: "Overrides the default modal description",
      control: "text",
    },
    maxRows: {
      description: "Maximum number of rows that can be imported",
      control: "number",
      table: {
        defaultValue: { summary: "100" },
      },
    },
    onDownloadTemplate: {
      description:
        "Overrides the default behavior of the download template button (downloading the bundled CSV template)",
      control: false,
    },
    onImport: {
      description:
        "Callback called with the parsed rows when the import button is pressed",
      control: false,
    },
  },
};

export default meta;

const ShareImportModalExample = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <ShareImportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onImport={(rows) => {
          window.alert(
            `Imported ${rows.length} rows:\n\n${rows
              .map((row) => `${row.email};${row.role}`)
              .join("\n")}`,
          );
        }}
      />
    </>
  );
};

export const Default = {
  render: () => <ShareImportModalExample />,
};
