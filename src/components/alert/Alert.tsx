import {
  Alert as AlertCunningham,
  AlertProps,
  VariantType,
} from "@gouvfr-lasuite/cunningham-react";
import { IconSize } from "../icon";
import { CircleCheck, Error as ErrorIcon, Warning } from ":/icons";

export const Alert = (props: AlertProps) => {
  const Icon = typeToIcon(props.type);
  return (
    <AlertCunningham
      {...props}
      icon={Icon ? <Icon size={IconSize.SMALL} /> : undefined}
    />
  );
};

const typeToIcon = (type?: VariantType) => {
  switch (type) {
    case VariantType.ERROR:
      return ErrorIcon;
    case VariantType.WARNING:
      return Warning;
    case VariantType.SUCCESS:
      return CircleCheck;
    case VariantType.INFO:
      return ErrorIcon;
    case VariantType.NEUTRAL:
      return undefined;
    default:
      return ErrorIcon;
  }
};
