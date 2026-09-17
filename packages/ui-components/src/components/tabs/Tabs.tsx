import clsx from "clsx";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SelectionIndicator,
} from "react-aria-components";
import { Icon } from "../icon/Icon";
import { TabData } from "./types";

export type TabsProps = {
  /** Tabs and their associated panels, in display order. */
  tabs: TabData[];
  /** Accessible name describing the group of tabs. */
  "aria-label": string;
  /** Initially selected tab. Defaults to the first enabled tab. */
  defaultSelectedTab?: string;
  /** Selected tab in controlled mode. */
  selectedTab?: string;
  /** Called when the user selects a tab. */
  onSelectionChange?: (id: string) => void;
  /** Filled selection or an underline. */
  variant?: "default" | "line";
  /** Distribute tabs equally across the available width. */
  fullWidth?: boolean;
  /** In manual mode, Enter or Space activates the focused tab. */
  keyboardActivation?: "automatic" | "manual";
  className?: string;
  id?: string;
};

export const CustomTabs = ({
  tabs,
  "aria-label": ariaLabel,
  defaultSelectedTab,
  selectedTab,
  onSelectionChange,
  variant = "default",
  fullWidth = false,
  keyboardActivation = "automatic",
  className,
  id,
}: TabsProps) => {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <Tabs
      id={id}
      className={clsx("c__tabs", `c__tabs--${variant}`, className, {
        "c__tabs--full-width": fullWidth,
      })}
      defaultSelectedKey={defaultSelectedTab}
      selectedKey={selectedTab}
      onSelectionChange={(key) => onSelectionChange?.(String(key))}
      keyboardActivation={keyboardActivation}
    >
      <TabList className="c__tabs__list" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            className="c__tabs__tab"
            isDisabled={tab.isDisabled}
            aria-label={tab.iconOnly ? tab.label : undefined}
          >
            {tab.icon != null && (
              <span className="c__tabs__icon" aria-hidden="true">
                {typeof tab.icon === "string" ? (
                  <Icon name={tab.icon} size={18} />
                ) : (
                  tab.icon
                )}
              </span>
            )}
            {!tab.iconOnly && tab.label}
            {variant === "line" && (
              <SelectionIndicator
                className="c__tabs__indicator"
                aria-hidden="true"
              />
            )}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} className="c__tabs__panel">
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  );
};
