import clsx from "clsx";
import { PropsWithChildren } from "react";

export type WithLabelProps = {
  label: string;
  text?: string;
  labelSide?: "left" | "right";
};

export const WithLabel = ({
  label,
  text,
  labelSide = "right",
  children,
}: PropsWithChildren<WithLabelProps>) => {
  return (
    <div className={clsx("c__with-label", { [labelSide]: true })}>
      <div className={"c__with-label__label-container"}>
        <span className="c__with-label__label-container__label">{label}</span>
        {text && (
          <span className="c__with-label__label-container__description">
            {text}
          </span>
        )}
      </div>

      {children}
    </div>
  );
};
