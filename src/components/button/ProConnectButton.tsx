import { Button } from "@openfun/cunningham-react";
import logo from ":/assets/proconnect-content.svg";
import logoDisabled from ":/assets/proconnect-content-disabled.svg";

export type ProConnectButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};
export const ProConnectButton = ({
  disabled,
  onClick,
}: ProConnectButtonProps) => {
  return (
    <Button
      disabled={disabled}
      className="pro-connect-button"
      onClick={onClick}
      style={{
        backgroundImage: `url("${disabled ? logoDisabled : logo}")`,
      }}
    ></Button>
  );
};
