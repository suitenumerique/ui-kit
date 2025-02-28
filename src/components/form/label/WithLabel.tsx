import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Label } from "./label";

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
      <Label children={label} text={text} />
      {children}
    </div>
  );
};
