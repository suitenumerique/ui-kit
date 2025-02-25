/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from "@storybook/react/*";
import { LeftPanel } from "./left-panel/LeftPanel";
import { Header } from "./header/Header";
import svg from "./header/logo-exemple.svg";
import { MainLayout } from "./MainLayout";
import { useResponsive } from ":/hooks/useResponsive";

const meta: Meta = {
  title: "Components/Layout",
};

export default meta;

// --- Story pour le Header ---
export const HeaderOnly: StoryObj = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <Header
      leftIcon={<img src={svg} alt="logo" />}
      rightIcon={
        <span className="material-icons clr-primary-800">help_outline</span>
      }
      languages={[{ label: "Français", isChecked: true }, { label: "Anglais" }]}
    />
  ),
};

// --- Story pour la Sidebar ---
export const LeftPanelOnly: StoryObj = {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      // 👇 Override default background value for this story
      default: "Gray",
    },
  },
  render: () => {
    return (
      <div className="left-panel-story">
        <LeftPanel>
          <div className="p-s">LeftPanel</div>
        </LeftPanel>
      </div>
    );
  },
};

// --- Story pour le Layout Complet ---
export const FullLayout: StoryObj = {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      // 👇 Override default background value for this story
      default: "Gray",
    },
  },
  render: () => {
    const { isDesktop } = useResponsive();
    return (
      <MainLayout
        enableResize
        leftPanelContent={<div className="p-s">LeftPanel</div>}
        icon={<img src={svg} alt="logo" />}
        rightHeaderContent={
          !isDesktop && <div style={{ width: "40px", height: "40px" }} />
        }
      />
    );
  },
};
