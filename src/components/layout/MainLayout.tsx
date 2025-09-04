import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Header } from "./header/Header";
import { LeftPanel } from "./left-panel/LeftPanel";
import clsx from "clsx";

import { useResponsive } from ":/hooks/useResponsive";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { DropdownMenuOption } from "../dropdown-menu/types";
import { RightPanel } from "./right-panel/RightPanel";
import { useControllableState } from ":/hooks/useControllableState";

export type MainLayoutProps = {
  icon?: React.ReactNode;
  leftPanelContent?: React.ReactNode;
  rightPanelContent?: React.ReactNode;
  rightHeaderContent?: React.ReactNode;
  languages?: DropdownMenuOption[];
  onToggleRightPanel?: () => void;
  enableResize?: boolean;
  rightPanelIsOpen?: boolean;
  hideLeftPanelOnDesktop?: boolean;
  isLeftPanelOpen?: boolean;
  setIsLeftPanelOpen?: (isLeftPanelOpen: boolean) => void;
};

export const MainLayout = ({
  icon,
  children,
  hideLeftPanelOnDesktop = false,
  leftPanelContent,
  rightPanelContent,
  rightHeaderContent,

  languages,
  enableResize = false,
  rightPanelIsOpen = false,

  ...props
}: PropsWithChildren<MainLayoutProps>) => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useControllableState(
    false,
    props.isLeftPanelOpen,
    props.setIsLeftPanelOpen
  );

  const { isDesktop } = useResponsive();

  const ref = useRef<ImperativePanelHandle>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<number | undefined>(undefined);

  // Disable transitions during window resize to prevent panels from being visible
  useEffect(() => {
    const handleResizeStart = () => {
      setIsResizing(true);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        setIsResizing(false);
      }, 150);
    };

    window.addEventListener("resize", handleResizeStart);

    return () => {
      window.removeEventListener("resize", handleResizeStart);

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // We need to have two different states for the left panel, we want to always keep the
  // left panel mounted on mobile in order to show the animation when it opens or closes, instead
  // of abruptly disappearing when closing the panel.
  // On desktop, we want to hide the left panel when the prop is set to true, so we need to
  // completely unmount it as it will never be visible.
  const mountLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : true;
  const showLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : isLeftPanelOpen;

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
      const min = Math.round(calculateDefaultSize(300, isDesktop));
      const max = Math.round(
        Math.min(calculateDefaultSize(450, isDesktop), 40)
      );
      setMinPanelSize(isDesktop ? min : 0);
      if (enableResize) {
        setMaxPanelSize(max);
      } else {
        setMaxPanelSize(min);
      }
    };

    updatePanelSize();
    window.addEventListener("resize", updatePanelSize);

    return () => {
      window.removeEventListener("resize", updatePanelSize);
    };
  }, [isDesktop, enableResize]);

  return (
    <div className={clsx("c__main-layout", { resizing: isResizing })}>
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
        <PanelGroup autoSaveId={"persistance"} direction="horizontal">
          {mountLeftPanel && (
            <>
              <Panel
                ref={ref}
                order={0}
                defaultSize={minPanelSize}
                minSize={minPanelSize}
                maxSize={maxPanelSize}
              >
                <LeftPanel isOpen={showLeftPanel}>{leftPanelContent}</LeftPanel>
              </Panel>
              {isDesktop && (
                <PanelResizeHandle
                  className="bg-greyscale-200"
                  style={{
                    width: "1px",
                  }}
                />
              )}
            </>
          )}
          <Panel order={1}>
            <div className="c__main-layout__content__center">
              <div className="c__main-layout__content__center__children">
                {children}
              </div>

              <RightPanel isOpen={rightPanelIsOpen}>
                {rightPanelContent}
              </RightPanel>
            </div>
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
