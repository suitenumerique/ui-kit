import { useMemo } from "react";
import { DropdownMenu } from "../../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../../dropdown-menu/useDropdownMenu";
import {
  DropdownMenuItem,
  DropdownMenuOption,
} from "../../dropdown-menu/types";

type SupportFormCategoryProps = {
  label: string;
  categories: DropdownMenuItem[];
  selectedCategory?: string;
  onSelect: (value: string) => void;
};

/** The category picker, shown when the app gives categories. */
export const SupportFormCategory = ({
  label,
  categories,
  selectedCategory,
  onSelect,
}: SupportFormCategoryProps) => {
  const menu = useDropdownMenu();

  const selectedItem = useMemo(() => {
    if (!selectedCategory) return undefined;
    return categories.find(
      (item) => "value" in item && item.value === selectedCategory,
    ) as DropdownMenuOption | undefined;
  }, [categories, selectedCategory]);

  const selectedValues = useMemo(
    () => [selectedCategory].filter((value): value is string => !!value),
    [selectedCategory],
  );

  return (
    <div className="c__generic-support-form__category">
      <span className="c__generic-support-form__category__label">{label}</span>
      <DropdownMenu
        options={categories}
        isOpen={menu.isOpen}
        onOpenChange={menu.setIsOpen}
        selectedValues={selectedValues}
        onSelectValue={onSelect}
      >
        <button
          type="button"
          className="c__generic-support-form__category__trigger"
          onClick={() => menu.setIsOpen(!menu.isOpen)}
        >
          {selectedItem?.icon && (
            <span className="c__generic-support-form__category__trigger__icon">
              {selectedItem.icon}
            </span>
          )}
          <span className="c__generic-support-form__category__trigger__label">
            {selectedItem?.label || label}
          </span>
          <span
            className="material-icons c__generic-support-form__category__trigger__chevron"
            aria-hidden="true"
          >
            arrow_drop_down
          </span>
        </button>
      </DropdownMenu>
    </div>
  );
};
