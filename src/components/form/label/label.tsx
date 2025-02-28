import { LabelHTMLAttributes } from "react";

export const Label = ({
  children,
  text,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { text?: string }) => {
  return (
    <div className="suite__label__container">
      <label {...props}>{children}</label>
      {text && (
        <span className="suite__label__container__description">{text}</span>
      )}
    </div>
  );
};
