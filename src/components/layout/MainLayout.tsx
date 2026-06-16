import {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Header } from "./header/Header";
import { LeftPanel } from "./left-panel/LeftPanel";
import clsx from "clsx";

const MIN_LEFT_PANEL_PX = 300;
const MAX_LEFT_PANEL_PX = 450;
const MAX_LEFT_PANEL_PERCENT = 40;

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
  /**
   * Optional banner rendered above the whole layout (header included), pushing
   * everything down by its height. Typically a `HeaderBanner`.
   */
  topBanner?: React.ReactNode;
  leftPanelContent?: React.ReactNode;
  leftPanelFooter?: React.ReactNode;
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
  topBanner,
  hideLeftPanelOnDesktop = false,
  leftPanelContent,
  leftPanelFooter,
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

  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const hasTopBanner = Boolean(topBanner);

  // We need to have two different states for the left panel, we want to always keep the
  // left panel mounted on mobile in order to show the animation when it opens or closes, instead
  // of abruptly disappearing when closing the panel.
  // On desktop, we want to hide the left panel when the prop is set to true, so we need to
  // completely unmount it as it will never be visible.
  const mountLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : true;
  const showLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : isLeftPanelOpen;

  const [minPanelSize, setMinPanelSize] = useState(
    calculateDefaultSize(MIN_LEFT_PANEL_PX, isDesktop)
  );
  const [maxPanelSize, setMaxPanelSize] = useState(
    calculateDefaultSize(MAX_LEFT_PANEL_PX, isDesktop)
  );

  const onTogglePanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  // Combined resize listener: disable transitions during window resize + update panel sizes
  useEffect(() => {
    const updatePanelSizes = () => {
      const min = Math.round(calculateDefaultSize(MIN_LEFT_PANEL_PX, isDesktop));
      const max = Math.round(
        Math.min(calculateDefaultSize(MAX_LEFT_PANEL_PX, isDesktop), MAX_LEFT_PANEL_PERCENT)
      );
      setMinPanelSize(isDesktop ? min : 0);
      setMaxPanelSize(enableResize ? max : min);
    };

    const handleResize = () => {
      setIsResizing(true);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        setIsResizing(false);
      }, 150);
      updatePanelSizes();
    };

    updatePanelSizes();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isDesktop, enableResize]);

  // Measure the optional top banner so the layout (and its fixed header) can be
  // offset by its height. A ResizeObserver keeps the offset correct when the
  // banner wraps onto several lines on small viewports.
  useEffect(() => {
    const element = bannerRef.current;
    if (!element) {
      setBannerHeight(0);
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setBannerHeight(entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasTopBanner]);

  return (
    <div
      className={clsx("c__main-layout", { resizing: isResizing })}
      style={
        {
          "--c--main-layout--banner-height": `${bannerHeight}px`,
        } as CSSProperties
      }
    >
      {topBanner && (
        <div className="c__main-layout__banner" ref={bannerRef}>
          {topBanner}
        </div>
      )}
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
                <LeftPanel isOpen={showLeftPanel} footer={leftPanelFooter}>
                  {leftPanelContent}
                </LeftPanel>
              </Panel>
              {isDesktop && (
                <PanelResizeHandle
                  className={clsx("c__resize-handle", {
                    "c__resize-handle--interactive": enableResize,
                  })}
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
