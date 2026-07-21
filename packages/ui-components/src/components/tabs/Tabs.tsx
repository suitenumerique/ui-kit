import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { TabData } from "./types";
import clsx from "clsx";

export type TabsProps = {
  tabs: TabData[];
  defaultSelectedTab?: string;
  fullWidth?: boolean;
};

export const CustomTabs = ({
  tabs,
  defaultSelectedTab,
  fullWidth = false,
}: TabsProps) => {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx("c__tabs", {
        "c__tabs__full-width": fullWidth,
      })}
    >
      <Tabs defaultSelectedKey={defaultSelectedTab}>
        <TabList aria-label="History of Ancient Rome">
          {tabs.map((tab) => (
            <Tab key={tab.id} id={tab.id}>
              {tab.icon && <span className="material-icons">{tab.icon}</span>}
              {tab.label}
            </Tab>
          ))}
        </TabList>
        {tabs.map((tab) => (
          <TabPanel key={tab.id} id={tab.id}>
            {tab.content}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
