import { useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { Tabs, TabsProps } from "../../src/components/tabs/Tabs";
import { TabData } from "../../src/components/tabs/types";
import { Calendar2 } from "../../src/components/icon/icons/Calendar2";

const tabs: TabData[] = [
  {
    id: "overview",
    label: "Overview",
    content: <button>Overview action</button>,
  },
  { id: "activity", label: "Activity", content: "Activity content" },
  { id: "settings", label: "Settings", content: "Settings content" },
];

export const TestTabs = ({
  controlled = false,
  icons = false,
  iconOnly = false,
  disableActivity = false,
  width = 600,
  theme = "dsfr-light",
  ...props
}: Partial<TabsProps> & {
  controlled?: boolean;
  icons?: boolean;
  iconOnly?: boolean;
  disableActivity?: boolean;
  width?: number;
  theme?: string;
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [lastSelection, setLastSelection] = useState("");

  return (
    <CunninghamProvider theme={theme}>
      <div style={{ width, maxWidth: "100%" }}>
        <button>Before tabs</button>
        <Tabs
          aria-label="Project"
          tabs={tabs.map((tab) => ({
            ...tab,
            icon: icons ? <Calendar2 /> : undefined,
            iconOnly,
            isDisabled: disableActivity && tab.id === "activity",
          }))}
          selectedTab={controlled ? selectedTab : undefined}
          onSelectionChange={(id) => {
            setLastSelection(id);
            if (controlled) setSelectedTab(id);
          }}
          {...props}
        />
        <output aria-label="Last selection">{lastSelection}</output>
        {controlled && (
          <button onClick={() => setSelectedTab("settings")}>
            Open settings
          </button>
        )}
      </div>
    </CunninghamProvider>
  );
};
