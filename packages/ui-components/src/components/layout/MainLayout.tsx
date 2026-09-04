import {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Header } from "./header/Header";
import { LeftPanel } from "./left-panel/LeftPanel";
import clsx from "clsx";

// Left panel constraints, in pixels: react-resizable-panels v4 reads bare
// numbers as pixels, so they can be handed to `Panel` as-is.
const MIN_LEFT_PANEL_PX = 300;
const MAX_LEFT_PANEL_PX = 450;
// ...except the upper bound, which is also capped to a share of the viewport so
// the panel never dominates a narrow desktop window. This is the only
// constraint that depends on the window size, hence the only one recomputed on
// resize.
const MAX_LEFT_PANEL_VIEWPORT_RATIO = 0.4;

const cappedMaxLeftPanelPx = () =>
  Math.min(MAX_LEFT_PANEL_PX, window.innerWidth * MAX_LEFT_PANEL_VIEWPORT_RATIO);

// Panels are identified explicitly so the persisted layout survives the left
// panel being conditionally mounted (react-resizable-panels v4 keys stored
// layouts by panel id, where v2 used the `order` prop).
const LEFT_PANEL_ID = "left";
const CENTER_PANEL_ID = "center";

import { useResponsive } from ":/hooks/useResponsive";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
} from "react-resizable-panels";
import { DropdownMenuOption } from "../dropdown-menu/types";
import { RightPanel } from "./right-panel/RightPanel";
import { useControllableState } from ":/hooks/useControllableState";

export type MainLayoutProps = {
  icon?: React.ReactNode;
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

  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<number | undefined>(undefined);

  // We need to have two different states for the left panel, we want to always keep the
  // left panel mounted on mobile in order to show the animation when it opens or closes, instead
  // of abruptly disappearing when closing the panel.
  // On desktop, we want to hide the left panel when the prop is set to true, so we need to
  // completely unmount it as it will never be visible.
  const mountLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : true;
  const showLeftPanel = isDesktop ? !hideLeftPanelOnDesktop : isLeftPanelOpen;

  const [maxResizablePanelSize, setMaxResizablePanelSize] = useState(
    cappedMaxLeftPanelPx
  );

  // The left panel is collapsed to nothing on mobile, where it is displayed as
  // an overlay rather than as a panel of the group.
  const minPanelSize = isDesktop ? MIN_LEFT_PANEL_PX : 0;
  const maxPanelSize =
    isDesktop && enableResize ? maxResizablePanelSize : minPanelSize;

  const panelIds = useMemo(
    () =>
      mountLeftPanel ? [LEFT_PANEL_ID, CENTER_PANEL_ID] : [CENTER_PANEL_ID],
    [mountLeftPanel]
  );

  // Replaces the `autoSaveId` prop dropped in react-resizable-panels v4.
  // `panelIds` keeps a separate stored layout per panel combination, so the
  // width saved with the left panel mounted is not applied without it.
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "persistance",
    panelIds,
  });

  const onTogglePanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
  };

  // Combined resize listener: disable transitions during window resize + keep
  // the viewport-capped upper bound in sync.
  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        setIsResizing(false);
      }, 150);
      setMaxResizablePanelSize(cappedMaxLeftPanelPx());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

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
        <Group
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          {mountLeftPanel && (
            <>
              <Panel
                id={LEFT_PANEL_ID}
                defaultSize={minPanelSize}
                minSize={minPanelSize}
                maxSize={maxPanelSize}
              >
                <LeftPanel isOpen={showLeftPanel} footer={leftPanelFooter}>
                  {leftPanelContent}
                </LeftPanel>
              </Panel>
              {isDesktop && (
                <Separator
                  className={clsx("c__resize-handle", {
                    "c__resize-handle--interactive": enableResize,
                  })}
                />
              )}
            </>
          )}
          <Panel id={CENTER_PANEL_ID}>
            <div className="c__main-layout__content__center">
              <div className="c__main-layout__content__center__children">
                {children}
              </div>

              <RightPanel isOpen={rightPanelIsOpen}>
                {rightPanelContent}
              </RightPanel>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  );
};
