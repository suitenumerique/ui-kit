import React from "react";
import classNames from "classnames";

export interface ClassicLabelProps {
  label?: string;
  /** Secondary text rendered under the label. */
  description?: string;
  /** Id given to the description, so the control can reference it via aria-describedby. */
  descriptionId?: string;
  /**
   * Wraps the label (and its description) in a `.c__field__label-block` container so the
   * pair behaves as a single item. Required by the "inline" variant, whose grid places
   * the whole block in the label column.
   */
  withContainer?: boolean;
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
  disabledClassName?: string;
  htmlFor?: string;
  id?: string;
  onClick?: () => void;
}

/**
 * Renders a label for the "classic" and "inline" field variants.
 * - When hideLabel is false: renders a visible label with the given className.
 * - When hideLabel is true: renders an offscreen label for accessibility.
 * - When label is falsy: renders nothing.
 *
 * The label block is only introduced when a description or a container is asked for, so
 * variants that need neither keep their historical markup.
 */
export const ClassicLabel = ({
  label,
  description,
  descriptionId,
  withContainer,
  hideLabel,
  disabled,
  className,
  disabledClassName,
  htmlFor,
  id,
  onClick,
}: ClassicLabelProps) => {
  if (!label) {
    return null;
  }

  if (hideLabel) {
    return (
      <>
        <label className="c__offscreen" htmlFor={htmlFor} onClick={onClick}>
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="c__offscreen">
            {description}
          </span>
        )}
      </>
    );
  }

  const labelElement = (
    <label
      className={classNames(className, {
        [disabledClassName ?? ""]: disabled && disabledClassName,
      })}
      htmlFor={htmlFor}
      id={id}
      onClick={onClick}
    >
      {label}
    </label>
  );

  if (!withContainer && !description) {
    return labelElement;
  }

  return (
    <div
      className={classNames("c__field__label-block", {
        "c__field__label-block--disabled": disabled,
      })}
    >
      {labelElement}
      {description && (
        <span
          id={descriptionId}
          className={classNames("c__field__label-description", {
            "c__field__label-description--disabled": disabled,
          })}
        >
          {description}
        </span>
      )}
    </div>
  );
};
