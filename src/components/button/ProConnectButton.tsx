import { Button } from "@openfun/cunningham-react";

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
    />
  );
};
