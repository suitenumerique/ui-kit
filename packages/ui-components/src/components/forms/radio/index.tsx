import React, {
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
} from "react";
import classNames from "classnames";
import { Field, FieldGroupProps, FieldProps } from ":/components/forms/field";
import { useFieldDescription } from ":/components/forms/field/useFieldDescription";
import { useCheckableIds } from ":/components/forms/checkbox/useCheckableIds";

export type RadioOnlyProps = {
  label?: ReactNode;
};

export type RadioProps = InputHTMLAttributes<HTMLInputElement> &
  RefAttributes<HTMLInputElement> &
  FieldProps &
  RadioOnlyProps;

export const Radio = ({ className, label, ref, ...props }: RadioProps) => {
  const {
    compact,
    fullWidth,
    labelWidth,
    rightText,
    state,
    text,
    textItems,
    ...inputProps
  } = props;
  const { id, textId, describedBy, labelId, labelledBy } = useCheckableIds({
    label,
    text,
    inputProps,
  });

  return (
    <label
      className={classNames("c__checkbox", "c__radio", className, {
        "c__checkbox--disabled": props.disabled,
        "c__checkbox--full-width": props.fullWidth,
      })}
    >
      <Field compact={true} {...props} textId={textId}>
        <div className="c__checkbox__container">
          <input
            type="radio"
            {...inputProps}
            id={id}
            aria-describedby={describedBy}
            aria-labelledby={labelledBy}
            ref={ref}
          />
          {label && (
            <div className="c__checkbox__label" id={labelId}>
              {label}
            </div>
          )}
        </div>
      </Field>
    </label>
  );
};

export type RadioGroupProps = PropsWithChildren &
  FieldProps &
  FieldGroupProps & { style?: React.CSSProperties };

export const RadioGroup = ({
  className,
  children,
  style,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RadioGroupProps) => {
  // The message under the group (e.g. "Pick an answer") describes it.
  const { textId, describedBy } = useFieldDescription({
    id,
    text: props.text,
    ariaDescribedBy,
  });
  return (
    <Field
      className={classNames("c__radio__group c__checkbox__group", className)}
      compact={true}
      {...props}
      textId={textId}
    >
      <div
        className="c__checkbox__group__list"
        style={style}
        role="radiogroup"
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
      >
        {children}
      </div>
    </Field>
  );
};
