import classNames from "classnames";
import React from "react";
import { SelectMultiAuxProps } from ":/components/forms/select/multi-common";
import {
  optionToValue,
  renderOption,
} from ":/components/forms/select/mono-common";
import { useCunningham } from ":/components/provider";
import { Checkbox } from ":/components/forms/checkbox";
import { Option } from ":/components/forms/select/index";
import { SelectMenu } from ":/components/forms/select/select-menu";

export const SelectMultiMenu = (
  props: SelectMultiAuxProps & {
    selectRef: React.RefObject<HTMLDivElement | null>;
  },
) => {
  const { t } = useCunningham();
  return (
    <SelectMenu
      isOpen={props.downshiftReturn.isOpen}
      selectRef={props.selectRef}
      downshiftReturn={props.downshiftReturn}
      menuOptionsStyle={props.menuOptionsStyle}
    >
      <ul>
        {props.downshiftReturn.isOpen && (
          <>
            {props.options.map((option, index) => (
              <MenuItem
                {...props}
                option={option}
                index={index}
                key={optionToValue(option)}
              />
            ))}
            {props.options.length === 0 && (
              <li className="c__select__menu__item c__select__menu__empty-placeholder">
                {t("components.forms.select.menu_empty_placeholder")}
              </li>
            )}
          </>
        )}
      </ul>
    </SelectMenu>
  );
};

type MenuItemProps = SelectMultiAuxProps & { option: Option; index: number };

const MenuItem = (props: MenuItemProps) => {
  if (props.menuOptionsStyle === "plain") {
    return <MenuItemPlain {...props} />;
  }
  if (props.menuOptionsStyle === "checkbox") {
    return <MenuItemCheckbox {...props} />;
  }
  throw new Error("Unknown menuOptionsStyle");
};

const MenuItemPlain = ({ option, index, ...props }: MenuItemProps) => {
  const isHighlighted =
    index === props.downshiftReturn.highlightedIndex || option.highlighted;

  return (
    <li
      className={classNames("c__select__menu__item", {
        "c__select__menu__item--highlight": isHighlighted,
        "c__select__menu__item--disabled": option.disabled,
      })}
      {...props.downshiftReturn.getItemProps({
        item: option,
        index,
      })}
    >
      <span>{renderOption(option)}</span>
    </li>
  );
};

const MenuItemCheckbox = ({ option, index, ...props }: MenuItemProps) => {
  return (
    <li
      className={classNames("c__select__menu__item", {
        "c__select__menu__item--highlight":
          index === props.downshiftReturn.highlightedIndex,
        "c__select__menu__item--disabled": option.disabled,
      })}
      {...props.downshiftReturn.getItemProps({
        item: option,
        index,
      })}
    >
      <Checkbox
        label={renderOption(option)}
        checked={option.highlighted}
        fullWidth={true}
      />
    </li>
  );
};
