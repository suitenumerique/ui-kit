import { useCunningham } from ":/components/Provider";

import { MenuItemBody } from "../menu/MenuItemBody";
import { IconSize } from "../icon";
import { Undo } from ":/icons";
import { HorizontalSeparator } from "../separator";

export type FilterResetRowProps = {
  onReset: () => void;
};

/**
 * Reset row shared by Filter and SearchFilter. Rendered as a native button so
 * it is keyboard focusable and activatable (Enter/Space) — the row lives
 * outside the ListBox, so it gets none of react-aria's listbox keyboard
 * handling.
 */
export const FilterResetRow = ({ onReset }: FilterResetRowProps) => {
  const { t } = useCunningham();

  return (
    <>
      <button
        type="button"
        className="c__dropdown-menu-item"
        onClick={onReset}
      >
        <MenuItemBody
          icon={<Undo size={IconSize.SMALL} />}
          label={t("components.searchFilter.reset")}
        />
      </button>
      <HorizontalSeparator withPadding={false} />
    </>
  );
};
