import { _AbstractSeparator, AbstractSeparatorProps } from "./AbstractSeparator";

type Props = Omit<AbstractSeparatorProps, "direction">;

export const VerticalSeparator = (props: Props) => {
  return (
    <_AbstractSeparator direction="vertical" {...props} />
  );
};
