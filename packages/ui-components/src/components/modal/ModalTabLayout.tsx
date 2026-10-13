import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { Button } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { tokens } from ":/cunningham-tokens";
import { useMediaQuery } from ":/hooks/useMediaQuery";
import { CloseIcon } from "./CloseIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ModalFooter } from "./ModalFooter";
import { ModalTabVariantProps } from "./index";

// Must match the `media(sm)` block of the tab variant styles.
const DRILL_DOWN_QUERY = `(max-width: ${tokens.themes.default.globals.breakpoints.sm})`;
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

// The browser skips hidden elements when tabbing, so the wrap must skip them
// too or its first or last target may be one it cannot focus.
const isVisible = (el: HTMLElement) => {
  if (typeof el.checkVisibility === "function") {
    return el.checkVisibility({ visibilityProperty: true });
  }
  if (getComputedStyle(el).visibility === "hidden") return false;
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (node.hidden || getComputedStyle(node).display === "none") return false;
  }
  return true;
};

export const ModalTabLayout = ({
  showCloseButton,
  titleId,
  ...props
}: ModalTabVariantProps & { showCloseButton: boolean; titleId: string }) => {
  const { t } = useCunningham();
  const closeLabel = t("components.modals.close_button_aria_label");
  const [internalActiveTab, setInternalActiveTab] = useState(
    props.defaultActiveTab ?? props.tabs[0]?.id,
  );
  const [mobileView, setMobileView] = useState<"sidebar" | "content">(
    "sidebar",
  );
  // On small screens, only one half of the layout is on screen at a time.
  const isDrillDown = useMediaQuery(DRILL_DOWN_QUERY);
  const layoutRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);

  useEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    // The other half slides in: focus would otherwise stay off screen.
    if (mobileView === "content") {
      backButtonRef.current?.focus({ preventScroll: true });
    } else {
      sidebarRef.current
        ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
        ?.focus({ preventScroll: true });
    }
  }, [mobileView]);

  const showView = (view: "sidebar" | "content") => {
    shouldMoveFocus.current = isDrillDown && view !== mobileView;
    setMobileView(view);
  };

  // react-modal traps Tab with its own list of tabbable elements, which
  // ignores `inert`: at the edges of the visible half, focus would leave the
  // dialog. Wrap it here instead.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isDrillDown || e.key !== "Tab" || !layoutRef.current) return;
    const focusables = Array.from(
      layoutRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(
      (el) => el.tabIndex >= 0 && !el.closest("[inert]") && isVisible(el),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const target =
      e.shiftKey && document.activeElement === first
        ? last
        : !e.shiftKey && document.activeElement === last
          ? first
          : undefined;
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      target.focus();
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [isContentScrollable, setIsContentScrollable] = useState(false);

  const checkScrollable = useCallback(() => {
    const el = contentRef.current;
    if (el) {
      setIsContentScrollable(el.scrollHeight > el.clientHeight);
    }
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    checkScrollable();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(checkScrollable);
    observer.observe(el);
    return () => observer.disconnect();
  }, [checkScrollable]);

  const activeTabId = props.activeTab ?? internalActiveTab;
  const currentTab =
    props.tabs.find((tab) => tab.id === activeTabId) ?? props.tabs[0];

  const handleTabChange = (tabId: string) => {
    if (props.activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    props.onTabChange?.(tabId);
  };

  const handleBackToSidebar = () => {
    showView("sidebar");
  };

  return (
    <Tabs
      className={classNames("c__modal__tab-layout", {
        "c__modal__tab-layout--show-content": mobileView === "content",
      })}
      orientation="vertical"
      keyboardActivation="manual"
      selectedKey={currentTab?.id}
      onSelectionChange={(key) => handleTabChange(String(key))}
      ref={layoutRef}
    >
      <div
        ref={sidebarRef}
        className="c__modal__tab-sidebar"
        inert={isDrillDown && mobileView === "content"}
        onKeyDown={handleKeyDown}
      >
        <div className="c__modal__tab-sidebar__header">
          {props.sidebarTitle && (
            <h2 id={titleId} className="c__modal__tab-sidebar__title">
              {props.sidebarTitle}
            </h2>
          )}
          {showCloseButton && (
            <div className="c__modal__tab-sidebar__close">
              <Button
                icon={<CloseIcon />}
                variant="tertiary"
                color="neutral"
                size="small"
                aria-label={closeLabel}
                onClick={props.onClose}
              />
            </div>
          )}
        </div>
        <TabList
          className="c__modal__tab-sidebar__nav"
          aria-labelledby={props.sidebarTitle ? titleId : undefined}
          aria-label={props.sidebarTitle ? undefined : props["aria-label"]}
        >
          {props.tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              className={({ isSelected }) =>
                classNames("c__modal__tab-sidebar__item", {
                  "c__modal__tab-sidebar__item--active": isSelected,
                })
              }
              // Also fires on the selected tab, to reopen it on mobile.
              onPress={() => showView("content")}
            >
              <span className="c__modal__tab-sidebar__item-label">
                {tab.icon && (
                  <span
                    className="c__modal__tab-sidebar__item-icon"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </span>
              <span
                className="c__modal__tab-sidebar__item-chevron"
                aria-hidden="true"
              >
                <ChevronRightIcon />
              </span>
            </Tab>
          ))}
        </TabList>
      </div>
      <div
        className={classNames("c__modal__tab-content", {
          "c__modal__tab-content--scrollable": isContentScrollable,
        })}
        inert={isDrillDown && mobileView === "sidebar"}
        onKeyDown={handleKeyDown}
      >
        <div className="c__modal__tab-content__head">
          <div className="c__modal__tab-content__header">
            <button
              ref={backButtonRef}
              type="button"
              className="c__modal__tab-content__back"
              onClick={handleBackToSidebar}
              aria-label={t("components.modals.back_to_tabs_aria_label")}
            >
              <ChevronLeftIcon />
            </button>
            <div className="c__modal__tab-content__title-group">
              {currentTab?.title && (
                <h3 className="c__modal__title">{currentTab.title}</h3>
              )}
            </div>
            {showCloseButton && (
              <div className="c__modal__close">
                <Button
                  icon={<CloseIcon />}
                  variant="tertiary"
                  color="neutral"
                  size="small"
                  aria-label={closeLabel}
                  onClick={props.onClose}
                />
              </div>
            )}
          </div>
          {currentTab?.subtitle && (
            <div className="c__modal__subtitle">{currentTab.subtitle}</div>
          )}
        </div>
        {currentTab && (
          <TabPanel
            id={currentTab.id}
            className="c__modal__content"
            ref={contentRef}
          >
            {currentTab.content}
          </TabPanel>
        )}
        {!props.stickyFooter && <ModalFooter {...props} />}
        {props.stickyFooter && <ModalFooter {...props} sticky />}
      </div>
    </Tabs>
  );
};
