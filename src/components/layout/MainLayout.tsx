import { PropsWithChildren, useEffect, useState } from "react";
import { Header } from "./header/Header";
import { LeftPanel } from "./left-panel/LeftPanel";

import { useResponsive } from ":/hooks/useResponsive";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DropdownMenuOption } from "../dropdown-menu/types";

export type MainLayoutProps = {
  icon?: React.ReactNode;
  leftPanelContent?: React.ReactNode;
  rightHeaderContent?: React.ReactNode;
  languages?: DropdownMenuOption[];
  onTogglePanel?: () => void;

  enableResize?: boolean;
};

export const MainLayout = ({
  icon,
  children,
  leftPanelContent,
  rightHeaderContent,
  languages,
  enableResize = false,
}: PropsWithChildren<MainLayoutProps>) => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const [minPanelSize, setMinPanelSize] = useState(
    calculateDefaultSize(300, isDesktop)
  );
  const [maxPanelSize, setMaxPanelSize] = useState(
    calculateDefaultSize(450, isDesktop)
  );

  const onTogglePanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  useEffect(() => {
    const updatePanelSize = () => {
      const min = calculateDefaultSize(300, isDesktop);
      const max = Math.min(calculateDefaultSize(450, isDesktop), 40);
      setMinPanelSize(isDesktop ? min : 0);
      if (enableResize) {
        setMaxPanelSize(max);
      } else {
        setMaxPanelSize(min);
      }
    };

    updatePanelSize();
    window.addEventListener("resize", () => {
      updatePanelSize();
    });

    return () => {
      window.removeEventListener("resize", updatePanelSize);
    };
  }, [isDesktop, enableResize]);

  return (
    <div className="c__main-layout">
      <div className="c__main-layout__header">
        <Header
          onTogglePanel={onTogglePanel}
          isPanelOpen={isLeftPanelOpen}
          rightIcon={rightHeaderContent}
          leftIcon={icon}
          languages={languages}
        />
      </div>
      <div className="c__main-layout__content">
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={minPanelSize}
            minSize={minPanelSize}
            maxSize={maxPanelSize}
          >
            <LeftPanel isOpen={isLeftPanelOpen}>{leftPanelContent}</LeftPanel>
          </Panel>
          {isDesktop && (
            <PanelResizeHandle
              className="bg-greyscale-200"
              style={{
                width: "1px",
              }}
            />
          )}
          <Panel>
            <div className="c__main-layout__content__children">{children}</div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

const calculateDefaultSize = (targetWidth: number, isDesktop: boolean) => {
  if (!isDesktop) {
    return 0;
  }
  const windowWidth = window.innerWidth;
  return (targetWidth / windowWidth) * 100;
};
