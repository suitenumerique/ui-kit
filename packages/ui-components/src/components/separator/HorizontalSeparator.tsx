import { _AbstractSeparator, AbstractSeparatorProps } from "./AbstractSeparator";

type Props = Omit<AbstractSeparatorProps, "direction">;

export const HorizontalSeparator = (props: Props) => {
  return (
    <_AbstractSeparator direction="horizontal" {...props} />
  );
};
