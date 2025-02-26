import clsx from "clsx";

type Props = {
  withPadding?: boolean;
};

export const HorizontalSeparator = ({ withPadding = true }: Props) => {
  return (
    <div
      className={clsx("c__horizontal-separator", {
        "with-padding": withPadding,
      })}
    />
  );
};
