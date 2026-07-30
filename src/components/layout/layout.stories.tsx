/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from "@storybook/react";
import { LeftPanel } from "./left-panel/LeftPanel";
import { Header } from "./header/Header";
import svg from "./header/logo-example.svg";
import { MainLayout } from "./MainLayout";
import { useResponsive } from ":/hooks/useResponsive";
import { useState } from "react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { HelpMenu } from "../help-menu/HelpMenu";

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
        <span className="material-icons clr-content-semantic-brand-tertiary">
          help_outline
        </span>
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
        <LeftPanel hasHeader={false}>
          <div className="p-s">LeftPanel</div>
        </LeftPanel>
      </div>
    );
  },
};

// --- Story pour le Layout avec Footer ---
export const FullLayoutWithFooter: StoryObj = {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "Gray",
    },
  },
  render: () => {
    const { isDesktop } = useResponsive();
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    return (
      <MainLayout
        leftPanelContent={
          <div style={{ padding: "1rem" }}>
            <div style={{ height: "2000px" }}>
              <p>Long scrollable content in the left panel</p>
              <p>Scroll down to see the footer stay fixed at the bottom.</p>
              {Array.from({ length: 50 }, (_, i) => (
                <p key={i}>Item {i + 1}</p>
              ))}
            </div>
          </div>
        }
        leftPanelFooter={
          <div style={{ padding: "0.75rem 1rem" }}>
            <HelpMenu
              documentationUrl="https://example.com/docs"
              onOnboarding={() => alert("Onboarding clicked")}
              feedbackForm={{
                onSend: (data) => console.log("Feedback sent:", data),
                showEmailReply: true,
                emailPrivacyUrl: "#",
              }}
              release={{
                version: "4.3.0",
                date: "Updated Yesterday",
                url: "https://example.com/releases/4.3.0",
              }}
            />
          </div>
        }
        isLeftPanelOpen={isLeftPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        icon={<img src={svg} alt="logo" />}
        languages={[
          { label: "Français", isChecked: true },
          { label: "Anglais" },
        ]}
        rightHeaderContent={
          !isDesktop && <div style={{ width: "40px", height: "40px" }} />
        }
      >
        <div style={{ padding: "1rem" }}>
          <p>Main content area</p>
        </div>
      </MainLayout>
    );
  },
};

// --- Story for the full layout ---
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
    const [rightPanelIsOpen, setRightPanelIsOpen] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    return (
      <MainLayout
        enableResize
        rightPanelIsOpen={rightPanelIsOpen}
        onToggleRightPanel={() => setRightPanelIsOpen(!rightPanelIsOpen)}
        rightPanelContent={
          <div>
            <div
              style={{
                height: "2000px",
              }}
            >
              {!isDesktop && (
                <div>
                  <button
                    onClick={() => setRightPanelIsOpen(!rightPanelIsOpen)}
                    className="btn btn-primary"
                  >
                    close
                  </button>
                </div>
              )}
              RightPanel
            </div>
          </div>
        }
        leftPanelContent={
          <div style={{ padding: "1rem" }} className="p-s">
            <div
              style={{
                height: "2000px",
              }}
            >
              LeftPanel
              <Button onClick={() => setIsLeftPanelOpen(false)}>
                Close left panel (controlled)
              </Button>
            </div>
          </div>
        }
        isLeftPanelOpen={isLeftPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        icon={<img src={svg} alt="logo" />}
        languages={[
          { label: "Français", isChecked: true },
          { label: "Anglais" },
        ]}
        rightHeaderContent={
          !isDesktop && <div style={{ width: "40px", height: "40px" }} />
        }
      >
        <div
          style={{
            height: "2000px",
            padding: "1rem",
          }}
        >
          <button
            onClick={() => setRightPanelIsOpen(!rightPanelIsOpen)}
            className="btn btn-primary"
          >
            Toggle Right Panel
          </button>
          <div className="p-s">Content</div>
        </div>
      </MainLayout>
    );
  },
};
