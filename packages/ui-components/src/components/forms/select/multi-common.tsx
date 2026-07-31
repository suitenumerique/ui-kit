import React, { HTMLAttributes, useRef } from "react";
import { useMultipleSelection } from "downshift";
import classNames from "classnames";
import { Field } from ":/components/forms/field";
import { LabelledBox } from ":/components/forms/labelled-box";
import { Button } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { Option, SelectProps } from ":/components/forms/select";
import {
  getOptionsFilter,
  optionToValue,
} from ":/components/forms/select/mono-common";
import { ClassicLabel } from ":/components/forms/classic-label";
import { SelectedItems } from ":/components/forms/select/multi-selected-items";
import { SelectMultiMenu } from ":/components/forms/select/multi-menu";

/**
 * This method returns a comparator that can be used to filter out options for multi select.
 * For an option to be visible it must:
 * - Match the input value in terms of search
 * - Not be selected already
 *
 * @param selectedOptions
 * @param inputValue
 */
export function getMultiOptionsFilter(
  selectedOptions: Option[],
  inputValue?: string,
) {
  const optionsFilter = getOptionsFilter(inputValue);
  return (option: Option) => {
    return (
      !selectedOptions.find(
        (selectedOption) =>
          optionToValue(selectedOption) === optionToValue(option),
      ) && optionsFilter(option)
    );
  };
}

export type SubProps = Omit<SelectProps, "onChange"> & {
  onChange?: (event: { target: { value: string[] } }) => void;
  onSelectedItemsChange: (selectedItems: Option[]) => void;
  selectedItems: Option[];
};

export interface SelectMultiAuxProps extends SubProps {
  options: Option[];
  labelAsPlaceholder: boolean;
  selectedItems: Option[];
  clearable?: boolean;
  downshiftReturn: {
    isOpen: boolean;
    // The prop getters come from either useSelect or useCombobox depending on
    // the select variant, and their downshift signatures are incompatible.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    getLabelProps: any;
    toggleButtonProps: any;
    getMenuProps: any;
    getItemProps: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    highlightedIndex: number;
    wrapperProps?: HTMLAttributes<HTMLDivElement>;
  };
  useMultipleSelectionReturn: ReturnType<typeof useMultipleSelection<Option>>;
}

export const SelectMultiAux = ({ children, ...props }: SelectMultiAuxProps) => {
  const { t } = useCunningham();
  const labelProps = props.downshiftReturn.getLabelProps();
  const ref = useRef<HTMLDivElement>(null);
  const variant = props.variant ?? "floating";
  const isClassic = variant === "classic";
  const showPlaceholder =
    isClassic && props.selectedItems.length === 0 && props.placeholder;

  // We need to remove onBlur from toggleButtonProps because it triggers a menu closing each time
  // we tick a checkbox using the monoline style.
  const { onBlur, ...toggleProps } = props.downshiftReturn.toggleButtonProps;

  const selectInner = (
    <div className="c__select__inner">
      <div className="c__select__inner__actions">
        {props.clearable &&
          !props.disabled &&
          props.selectedItems.length > 0 && (
            <>
              <Button
                variant="tertiary"
                color="neutral"
                size="nano"
                aria-label={t(
                  "components.forms.select.clear_all_button_aria_label",
                )}
                className="c__select__inner__actions__clear"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onSelectedItemsChange([]);
                }}
                icon={
                  <span className="material-icons" aria-hidden="true">
                    close
                  </span>
                }
                type="button"
              />
              <div className="c__select__inner__actions__separator" />
            </>
          )}
        <Button
          variant="tertiary"
          color="neutral"
          size="nano"
          className="c__select__inner__actions__open"
          icon={
            <span
              className={classNames("material-icons", {
                opened: props.downshiftReturn.isOpen,
              })}
              aria-hidden="true"
            >
              arrow_drop_down
            </span>
          }
          disabled={props.disabled}
          type="button"
          aria-hidden={true}
          tabIndex={-1}
        />
      </div>
      <div className="c__select__inner__value">
        {showPlaceholder ? (
          <span className="c__select__placeholder">{props.placeholder}</span>
        ) : (
          <>
            <SelectedItems {...props} />
            {children}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Field {...props}>
        <div
          ref={ref}
          className={classNames(
            "c__select",
            "c__select--multi",
            "c__select--" + props.state,
            "c__select--" + props.selectedItemsStyle,
            {
              "c__select--disabled": props.disabled,
              "c__select--populated": props.selectedItems.length > 0,
              "c__select--monoline": props.monoline,
              "c__select--multiline": !props.monoline,
              "c__select--classic": isClassic,
            },
          )}
        >
          {isClassic && (
            <ClassicLabel
              label={props.label}
              hideLabel={props.hideLabel}
              disabled={props.disabled}
              className="c__select__label"
              disabledClassName="c__select__label--disabled"
              htmlFor={labelProps.htmlFor}
              id={labelProps.id}
            />
          )}
          <div
            className={classNames("c__select__wrapper", {
              "c__select__wrapper--focus":
                props.downshiftReturn.isOpen && !props.disabled,
            })}
            {...props.downshiftReturn.wrapperProps}
            {...toggleProps}
          >
            {props.selectedItems.map((selectedItem, index) => (
              <input
                key={`${optionToValue(selectedItem)}${index.toString()}`}
                type="hidden"
                name={props.name}
                value={optionToValue(selectedItem)}
              />
            ))}
            {isClassic ? (
              selectInner
            ) : (
              <LabelledBox
                label={props.label}
                variant={variant}
                labelAsPlaceholder={props.labelAsPlaceholder}
                htmlFor={labelProps.htmlFor}
                labelId={labelProps.id}
                hideLabel={props.hideLabel}
                disabled={props.disabled}
              >
                {selectInner}
              </LabelledBox>
            )}
          </div>
        </div>
      </Field>
      <SelectMultiMenu {...props} selectRef={ref} />
    </>
  );
};
