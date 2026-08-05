import React, { HTMLAttributes, useRef } from "react";
import { UseSelectReturnValue } from "downshift";
import classNames from "classnames";
import { useCunningham } from ":/components/provider";
import { Field } from ":/components/forms/field";
import { LabelledBox } from ":/components/forms/labelled-box";
import { Button } from ":/components/button";
import { Option, SelectProps } from ":/components/forms/select";
import { ClassicLabel } from ":/components/forms/classic-label";
import { isOptionWithRender } from ":/components/forms/select/utils";
import { SelectMenu } from ":/components/forms/select/select-menu";

export function getOptionsFilter(inputValue?: string) {
  return (option: Option) => {
    return (
      !inputValue ||
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
}

export const optionToString = (option: Option | null) => {
  return option ? option.label : "";
};

/**
 * Returns underlying value of option.
 */
export const optionToValue = (option: Option) => {
  return option.value ?? option.label;
};

export const optionsEqual = (a: Option, b: Option) => {
  return optionToValue(a) === optionToValue(b);
};

export const renderOption = (option: Option) => {
  if (isOptionWithRender(option)) {
    return option.render();
  }
  return option.label;
};

export interface SubProps extends SelectProps {
  defaultSelectedItem?: Option;
  downshiftProps: {
    initialSelectedItem?: Option;
    // Shared by useSelect and useCombobox, whose change objects only have
    // the selectedItem property in common.
    onSelectedItemChange?: (changes: { selectedItem?: Option | null }) => void;
    isItemDisabled?: (item: Option) => boolean;
  };
}

export interface SelectAuxProps extends SubProps {
  options: Option[];
  labelAsPlaceholder: boolean;
  downshiftReturn: {
    isOpen: boolean;
    wrapperProps?: HTMLAttributes<HTMLDivElement>;
    selectedItem?: Option | null;
    // The prop getters come from either useSelect or useCombobox depending on
    // the select variant, and their downshift signatures are incompatible.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    getLabelProps: any;
    toggleButtonProps: any;
    getMenuProps: any;
    getItemProps: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    highlightedIndex: number;
    selectItem: UseSelectReturnValue<Option>["selectItem"];
  };
}

/**
 * This component is used by searchable and non-searchable select components.
 * It contains the common logic between the two.
 */
export const SelectMonoAux = ({
  children,
  state = "default",
  options,
  name,
  label,
  labelDescription,
  hideLabel,
  variant = "floating",
  placeholder,
  labelAsPlaceholder,
  downshiftProps,
  downshiftReturn,
  value,
  disabled,
  clearable = true,
  onBlur,
  ...props
}: SelectAuxProps) => {
  const { t } = useCunningham();
  const labelProps = downshiftReturn.getLabelProps();
  const ref = useRef<HTMLDivElement>(null);
  const isClassic = variant === "classic";
  const isInline = variant === "inline";
  // Both variants render the label outside the box and rely on the placeholder.
  const isStatic = isClassic || isInline;
  const descriptionId = labelDescription
    ? `${labelProps.htmlFor}-description`
    : undefined;
  const showPlaceholder =
    isStatic && !downshiftReturn.selectedItem && placeholder;

  const selectInner = (
    <div className="c__select__inner">
      <div className="c__select__inner__value">
        {showPlaceholder ? (
          <span className="c__select__placeholder">{placeholder}</span>
        ) : (
          children
        )}
      </div>
      <div className="c__select__inner__actions">
        {clearable && !disabled && downshiftReturn.selectedItem && (
          <>
            <Button
              variant="tertiary"
              color="neutral"
              size="nano"
              aria-label={t("components.forms.select.clear_button_aria_label")}
              className="c__select__inner__actions__clear"
              onClick={(e) => {
                downshiftReturn.selectItem(null);
                e.stopPropagation();
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
                opened: downshiftReturn.isOpen,
              })}
              aria-hidden="true"
            >
              arrow_drop_down
            </span>
          }
          disabled={disabled}
          type="button"
          {...downshiftReturn.toggleButtonProps}
          aria-hidden={true}
          tabIndex={-1}
        />
      </div>
    </div>
  );

  return (
    <>
      <Field
        state={state}
        {...props}
        className={classNames(
          { "c__field--inline": isInline },
          props.className,
        )}
      >
        {/* The label is a sibling of `.c__select`, like in Input and TextArea, so */}
        {/* that every field component exposes the same `.c__field` children. */}
        {isStatic && (
          <ClassicLabel
            label={label}
            description={labelDescription}
            descriptionId={descriptionId}
            withContainer={isInline}
            hideLabel={hideLabel}
            disabled={disabled}
            className="c__select__label"
            disabledClassName="c__select__label--disabled"
            htmlFor={labelProps.htmlFor}
            id={labelProps.id}
          />
        )}
        <div
          ref={ref}
          className={classNames(
            "c__select",
            "c__select--mono",
            "c__select--" + state,
            {
              "c__select--disabled": disabled,
              "c__select--classic": isClassic,
              "c__select--inline": isInline,
            },
          )}
          onBlur={() =>
            onBlur?.({ target: { value: downshiftReturn.selectedItem?.value } })
          }
        >
          {/* We disabled linting for this specific line because we consider that the onClick props is only used for */}
          {/* mouse users, so this do not engender any issue for accessibility. */}
          <div
            className={classNames("c__select__wrapper", {
              "c__select__wrapper--focus": downshiftReturn.isOpen && !disabled,
            })}
            {...downshiftReturn.wrapperProps}
            aria-describedby={
              [
                downshiftReturn.wrapperProps?.["aria-describedby"],
                descriptionId,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
          >
            {downshiftReturn.selectedItem && (
              <input
                type="hidden"
                name={name}
                value={optionToValue(downshiftReturn.selectedItem)}
              />
            )}

            {isStatic ? (
              selectInner
            ) : (
              <LabelledBox
                label={label}
                hideLabel={hideLabel}
                variant="floating"
                labelAsPlaceholder={labelAsPlaceholder}
                htmlFor={labelProps.htmlFor}
                labelId={labelProps.id}
                disabled={disabled}
              >
                {selectInner}
              </LabelledBox>
            )}
          </div>
        </div>
      </Field>
      <SelectMenu
        isOpen={downshiftReturn.isOpen}
        selectRef={ref}
        downshiftReturn={downshiftReturn}
      >
        <ul>
          {options.map((item, index) => {
            const isActive = index === downshiftReturn.highlightedIndex;
            return (
              <li
                className={classNames("c__select__menu__item", {
                  "c__select__menu__item--highlight": isActive,
                  "c__select__menu__item--selected":
                    downshiftReturn.selectedItem &&
                    optionsEqual(downshiftReturn.selectedItem, item),
                  "c__select__menu__item--disabled": item.disabled,
                })}
                key={`${optionToValue(item)}${index.toString()}`}
                {...downshiftReturn.getItemProps({
                  item,
                  index,
                })}
              >
                <span>{renderOption(item)}</span>
              </li>
            );
          })}
          {options.length === 0 && (
            <li className="c__select__menu__item c__select__menu__empty-placeholder">
              {t("components.forms.select.menu_empty_placeholder")}
            </li>
          )}
        </ul>
      </SelectMenu>
    </>
  );
};
