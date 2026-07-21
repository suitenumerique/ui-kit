import { useResponsive } from ":/hooks/useResponsive";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export type LeftPanelProps = {
  isOpen?: boolean;
  hasHeader?: boolean;
  footer?: React.ReactNode;
};
export const LeftPanel = ({
  children,
  isOpen = false,
  hasHeader = true,
  footer,
}: PropsWithChildren<LeftPanelProps>) => {
  const { isDesktop } = useResponsive();

  if (!isDesktop) {
    return (
      <div
        className={clsx("c__left-panel__mobile", {
          open: isOpen,
        })}
      >
        <div className="c__left-panel__content">{children}</div>
        {footer && <div className="c__left-panel__footer">{footer}</div>}
      </div>
    );
  }

  return (
    <div className={clsx("c__left-panel", { "has-header": hasHeader })}>
      <div className="c__left-panel__content">{children}</div>
      {footer && <div className="c__left-panel__footer">{footer}</div>}
    </div>
  );
};
