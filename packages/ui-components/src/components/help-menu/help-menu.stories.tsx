/* eslint-disable react-hooks/rules-of-hooks */
import { Meta, StoryObj } from "@storybook/react";
import { HelpMenu } from "./HelpMenu";
import { DropdownMenuItem } from "../dropdown-menu/types";
import { MainLayout } from "../layout/MainLayout";
import { useResponsive } from ":/hooks/useResponsive";
import { useState } from "react";
import svg from "../layout/header/logo-example.svg";
import { Keyboard, Megaphone } from ":/icons";
import { IconSize } from "../icon";

const meta: Meta<typeof HelpMenu> = {
  title: "Components/HelpMenu",
  component: HelpMenu,
};

export default meta;

type Story = StoryObj<typeof HelpMenu>;

export const AllOptions: Story = {
  render: () => (
    <HelpMenu
      documentationUrl="https://example.com/docs"
      onOnboarding={() => alert("Onboarding clicked")}
      onContactUs={() => alert("Contact us clicked")}
      legal={{
        personalDataUrl: "https://example.com/personal-data",
        termsOfUseUrl: "https://example.com/terms",
        accessibilityUrl: "https://example.com/accessibility",
        legalNoticeUrl: "https://example.com/legal-notice",
      }}
      release={{
        version: "4.3.0",
        date: "Updated Yesterday",
        url: "https://example.com/releases/4.3.0",
      }}
    />
  ),
};

export const WithLegal: Story = {
  render: () => (
    <HelpMenu
      documentationUrl="https://example.com/docs"
      legal={{
        personalDataUrl: "https://example.com/personal-data",
        legalNoticeUrl: "https://example.com/legal-notice",
      }}
    />
  ),
};

const customOptions: DropdownMenuItem[] = [
  {
    label: "Keyboard shortcuts",
    icon: <Keyboard size={IconSize.SMALL} />,
    callback: () => alert("Keyboard shortcuts clicked"),
  },
  {
    label: "What's new",
    icon: <Megaphone size={IconSize.SMALL} />,
    opensInNewWindow: true,
    callback: () => {
      window.open("https://example.com/changelog", "_blank");
    },
  },
];

export const WithCustomOptions: Story = {
  render: () => (
    <HelpMenu
      documentationUrl="https://example.com/docs"
      legal={{
        personalDataUrl: "https://example.com/personal-data",
        legalNoticeUrl: "https://example.com/legal-notice",
      }}
      customOptions={customOptions}
      onContactUs={() => alert("Contact us clicked")}
    />
  ),
};

export const ContactUsMailto: Story = {
  render: () => (
    <HelpMenu
      documentationUrl="https://example.com/docs"
      onContactUs={() => {
        window.open("mailto:support@example.com?subject=Need%20help");
      }}
    />
  ),
};

export const WithFeedbackForm: Story = {
  render: () => (
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
  ),
};

export const DocumentationOnly: Story = {
  render: () => <HelpMenu documentationUrl="https://example.com/docs" />,
};

export const WithoutRelease: Story = {
  render: () => (
    <HelpMenu
      documentationUrl="https://example.com/docs"
      onOnboarding={() => alert("Onboarding clicked")}
      onContactUs={() => alert("Contact us clicked")}
    />
  ),
};

export const InLayoutFooter: Story = {
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
          { label: "Fran\u00e7ais", isChecked: true },
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
