import { useResponsive } from ":/hooks/useResponsive";
import clsx from "clsx";
import { ReactNode } from "react";

export type QuickSearchItemTemplateProps = {
  alwaysShowRight?: boolean;
  left: ReactNode;
  right?: ReactNode;
  testId?: string;
};

export const QuickSearchItemTemplate = ({
  alwaysShowRight = false,
  left,
  right,
  testId,
}: QuickSearchItemTemplateProps) => {
  const { isDesktop } = useResponsive();
  return (
    <div className="c__quick-search-item-template" data-testid={testId}>
      <div className="c__quick-search-item-template__left">{left}</div>

      {isDesktop && right && (
        <div
          className={clsx("c__quick-search-item-template__right", {
            "always-show-right": alwaysShowRight,
            "show-right-on-focus": !alwaysShowRight,
          })}
        >
          {right}
        </div>
      )}
    </div>
  );
};
