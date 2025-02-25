import clsx from "clsx";

export enum SeparatorVariant {
  LIGHT = "light",
  DARK = "dark",
}

type Props = {
  variant?: SeparatorVariant;
  $withPadding?: boolean;
};

export const HorizontalSeparator = ({
  variant = SeparatorVariant.LIGHT,
  $withPadding = true,
}: Props) => {
  return (
    <div
      className={clsx("c__horizontal-separator", {
        "with-padding": $withPadding,
        [variant]: true,
      })}
    />
  );
};
