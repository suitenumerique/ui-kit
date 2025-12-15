import { Fragment, useContext } from "react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectProps,
  SelectStateContext,
  Separator,
} from "react-aria-components";

import { Option } from "@gouvfr-lasuite/cunningham-react";
import clsx from "clsx";

export type FilterOption = Option & {
  showSeparator?: boolean;
  isChecked?: boolean;
};

export type FilterProps = {
  label: string;
  options: FilterOption[];
} & SelectProps;

export const Filter = (props: FilterProps) => {
  return (
    <Select {...props} className="c__filter">
      <FilterInner {...props} />
    </Select>
  );
};

const FilterInner = (props: FilterProps) => {
  const state = useContext(SelectStateContext);

  const selectedOption = state?.selectedItem
    ? props.options.find((option) => option.value === state.selectedItem?.key)
    : null;

  return (
    <>
      <Button
        className={clsx("c__filter__button", {
          "c__filter__button--active": !!selectedOption,
        })}
      >
        <Label className="c__filter__label">
          {selectedOption ? (
            <>
              {props.label}
              {" : "}
              {selectedOption.label}
            </>
          ) : (
            <>{props.label}</>
          )}
        </Label>
        <span
          aria-hidden="true"
          className={clsx("material-icons c__filter__button__icon", {
            opened: state?.isOpen,
          })}
        >
          keyboard_arrow_down
        </span>
      </Button>
      <Popover className="c__dropdown-menu">
        <ListBox>
          {props.options.map((option) => (
            <Fragment key={option.value}>
              <ListBoxItem
                key={option.value}
                id={option.value}
                className="c__dropdown-menu-item"
              >
                <div className="c__filter__item">
                  {option.render ? option.render() : option.label}
                  {(props.selectedKey === option.value || option.isChecked) && (
                    <span className="material-icons checked">check</span>
                  )}
                </div>
              </ListBoxItem>
              {option.showSeparator && <Separator />}
            </Fragment>
          ))}
        </ListBox>
      </Popover>
    </>
  );
};
