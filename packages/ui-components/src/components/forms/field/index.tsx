import React, { CSSProperties, PropsWithChildren } from "react";
import classNames from "classnames";

export type FieldState = "success" | "error" | "default";

export type FieldProps = {
  state?: FieldState | undefined;
  text?: string | undefined;
  textItems?: string[] | undefined;
  rightText?: string | undefined;
  fullWidth?: boolean | undefined;
  compact?: boolean | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  /**
   * Width of the label column of the "inline" variant. Accepts any CSS length or sizing
   * keyword ("12rem", "30%", "max-content"). Defaults to the forms-field
   * `inline-label-width` token. Set the same value on several fields of a form to align
   * their controls.
   */
  labelWidth?: string | undefined;
};

type Props = FieldProps & PropsWithChildren;

export const Field = ({
  children,
  state = "default",
  text,
  textItems,
  rightText,
  fullWidth,
  compact,
  className,
  disabled,
  labelWidth,
}: Props) => {
  return (
    <div
      className={classNames("c__field", "c__field--" + state, className, {
        "c__field--full-width": fullWidth,
        "c__field--compact": compact && !fullWidth,
        "c__field--disabled": disabled,
      })}
      style={
        labelWidth
          ? ({
              "--c--components--forms-field--inline-label-width": labelWidth,
            } as CSSProperties)
          : undefined
      }
    >
      {children}
      {(text || rightText || textItems) && (
        <div className="c__field__footer">
          {(text || rightText) && (
            <div className="c__field__footer__top">
              <span className="c__field__text">{text}</span>
              <span className="c__field__text__right">{rightText}</span>
            </div>
          )}
          {textItems && (
            <ul className="c__field__footer__items">
              {textItems.map((textItem) => (
                <li key={textItem}>{textItem}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
