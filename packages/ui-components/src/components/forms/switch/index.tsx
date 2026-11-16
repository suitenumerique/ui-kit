import React, { InputHTMLAttributes, RefAttributes } from "react";
import classNames from "classnames";
import { Field, FieldProps } from ":/components/forms/field";
import { useCheckableIds } from ":/components/forms/checkbox/useCheckableIds";

export type SwitchOnlyProps = {
  label?: string;
  labelSide?: "left" | "right";
};

export type SwitchProps = InputHTMLAttributes<HTMLInputElement> &
  RefAttributes<HTMLInputElement> &
  FieldProps &
  SwitchOnlyProps;

export const Switch = ({
  label,
  labelSide = "left",
  ref,
  ...props
}: SwitchProps) => {
  const {
    compact,
    className,
    fullWidth,
    labelWidth,
    rightText,
    state,
    text,
    textItems,
    ...inputProps
  } = props;

  const { className: excludeClassName, ...fieldProps } = props;
  const { id, textId, describedBy, labelId, labelledBy } = useCheckableIds({
    label,
    text,
    inputProps,
  });

  return (
    <label
      className={classNames(
        "c__checkbox",
        "c__switch",
        "c__switch--" + labelSide,
        className,
        {
          "c__checkbox--disabled": props.disabled,
          "c__switch--full-width": props.fullWidth,
        },
      )}
    >
      <Field compact={true} {...fieldProps} textId={textId}>
        <div className="c__checkbox__container">
          {label && (
            <div className="c__checkbox__label" id={labelId}>
              {label}
            </div>
          )}
          <div className="c__switch__rail__wrapper">
            <input
              type="checkbox"
              {...inputProps}
              id={id}
              aria-describedby={describedBy}
              aria-labelledby={labelledBy}
              ref={ref}
            />
            <div className="c__switch__rail" />
          </div>
        </div>
      </Field>
    </label>
  );
};
