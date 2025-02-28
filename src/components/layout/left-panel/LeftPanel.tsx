import { useResponsive } from ":/hooks/useResponsive";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export type LeftPanelProps = {
  isOpen?: boolean;
};
export const LeftPanel = ({
  children,
  isOpen = false,
}: PropsWithChildren<LeftPanelProps>) => {
  const { isDesktop } = useResponsive();

  if (!isDesktop) {
    return (
      <div
        className={clsx("c__left-panel__mobile", {
          open: isOpen,
        })}
      >
        {children}
      </div>
    );
  }

  return <div className="c__left-panel">{children}</div>;
};
