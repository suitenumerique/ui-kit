import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { OnboardingModal } from "./OnboardingModal";
import { OnboardingStep } from "./types";

const meta: Meta<typeof OnboardingModal> = {
  title: "Components/OnboardingModal",
  component: OnboardingModal,
};

export default meta;
type Story = StoryObj<typeof OnboardingModal>;

// Example icons using material icons
const GridIcon = () => <span className="material-icons">grid_view</span>;
const FormatIcon = () => <span className="material-icons">format_paint</span>;
const ShareIcon = () => <span className="material-icons">share</span>;
const LibraryIcon = () => <span className="material-icons">library_books</span>;
const SettingsIcon = () => <span className="material-icons">settings</span>;
const SecurityIcon = () => <span className="material-icons">security</span>;

// Sample steps for the stories
const sampleSteps: OnboardingStep[] = [
  {
    icon: <GridIcon />,
    title: "Compose your doc easily",
    description:
      "Move, duplicate, and transform your texts, headings, lists, images without breaking your layout.",
    content: (
      <img
        src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Document+Editor"
        alt="Document editor preview"
      />
    ),
  },
  {
    icon: <FormatIcon />,
    title: "Format your content with the toolbar",
    description:
      "Apply styles, structure, and emphasis in one click—keep documents clean, consistent, and easy to scan.",
    content: (
      <img
        src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Formatting+Toolbar"
        alt="Formatting toolbar preview"
      />
    ),
  },
  {
    icon: <ShareIcon />,
    title: "Share and collaborate with ease",
    description:
      "Decide exactly who can view, comment, edit—or simply use shareable links.",
    content: (
      <img
        src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Share+Dialog"
        alt="Share dialog preview"
      />
    ),
  },
  {
    icon: <LibraryIcon />,
    title: "Draw inspiration from the content library",
    description:
      "Start from ready-made templates for common use cases, then customize them to match your workflow in minutes.",
    content: (
      <img
        src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Template+Library"
        alt="Template library preview"
      />
    ),
  },
];

// Interactive wrapper component
const OnboardingModalDemo = ({
  steps = sampleSteps,
  ...props
}: Partial<React.ComponentProps<typeof OnboardingModal>> & {
  steps?: OnboardingStep[];
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Onboarding</Button>
      <OnboardingModal
        isOpen={isOpen}
        appName="Discover Docs"
        mainTitle="Learn the core principles"
        steps={steps}
        onClose={() => setIsOpen(false)}
        onSkip={() => {
          console.log("Skipped");
          setIsOpen(false);
        }}
        onComplete={() => {
          console.log("Completed");
          setIsOpen(false);
        }}
        footerLink={{
          label: "Learn more docs features",
          href: "#",
        }}
        {...props}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <OnboardingModalDemo />,
};

export const WithoutAppName: Story = {
  render: () => <OnboardingModalDemo appName={undefined} />,
};

export const WithoutSkip: Story = {
  render: () => <OnboardingModalDemo onSkip={undefined} />,
};

export const WithoutFooterLink: Story = {
  render: () => <OnboardingModalDemo footerLink={undefined} />,
};

export const CustomLabels: Story = {
  render: () => (
    <OnboardingModalDemo
      labels={{
        skip: "Ignorer",
        next: "Continuer",
        previous: "Retour",
        complete: "J'ai compris !",
      }}
    />
  ),
};

export const StartAtStep2: Story = {
  render: () => <OnboardingModalDemo initialStep={1} />,
};

export const ManySteps: Story = {
  render: () => {
    const manySteps: OnboardingStep[] = [
      ...sampleSteps,
      {
        icon: <SettingsIcon />,
        title: "Customize your workspace",
        description: "Personalize your settings to fit your workflow.",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Settings"
            alt="Settings preview"
          />
        ),
      },
      {
        icon: <SecurityIcon />,
        title: "Secure your documents",
        description:
          "Enable two-factor authentication and manage access controls.",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Security"
            alt="Security preview"
          />
        ),
      },
    ];
    return <OnboardingModalDemo steps={manySteps} />;
  },
};

export const WithCustomContent: Story = {
  render: () => {
    const customSteps: OnboardingStep[] = [
      {
        icon: <GridIcon />,
        title: "Interactive demo",
        description: "This step contains a custom React component.",
        content: (
          <div className="c__onboarding-modal__custom-demo">
            <h3>Custom Component</h3>
            <p>You can put any React component here!</p>
            <Button onClick={() => alert("Clicked!")}>Try me</Button>
          </div>
        ),
      },
      {
        icon: <FormatIcon />,
        title: "Video content",
        description: "Steps can also contain videos.",
        content: (
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
          />
        ),
      },
    ];
    return <OnboardingModalDemo steps={customSteps} />;
  },
};

export const SingleStep: Story = {
  render: () => {
    const singleStep: OnboardingStep[] = [
      {
        icon: <GridIcon />,
        title: "Welcome!",
        description: "This is a single-step onboarding.",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Welcome"
            alt="Welcome"
          />
        ),
      },
    ];
    return <OnboardingModalDemo steps={singleStep} />;
  },
};

// Example with custom activeIcon using SVG icons (different icon, not just color)
const GridIconOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const GridIconFilled = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const WithActiveIcons: Story = {
  render: () => {
    const stepsWithActiveIcons: OnboardingStep[] = [
      {
        // Example: different icon variant when active (outline → filled)
        icon: <GridIconOutline />,
        activeIcon: <GridIconFilled />,
        title: "Compose your doc easily",
        description:
          "This step uses a custom activeIcon (filled variant instead of outline).",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Custom+Active+Icon"
            alt="Custom active icon demo"
          />
        ),
      },
      {
        // Example: font icon without activeIcon - color changes automatically via CSS
        icon: <FormatIcon />,
        title: "Format your content with the toolbar",
        description:
          "This step uses a font icon without activeIcon - the color changes automatically via CSS.",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Font+Icon+Auto+Color"
            alt="Font icon with automatic color"
          />
        ),
      },
      {
        icon: <ShareIcon />,
        title: "Share and collaborate with ease",
        description:
          "Another font icon example - no activeIcon needed for color change.",
        content: (
          <img
            src="https://placehold.co/400x300/e8f4fc/1a73e8?text=Share+Dialog"
            alt="Share dialog preview"
          />
        ),
      },
    ];
    return <OnboardingModalDemo steps={stepsWithActiveIcons} />;
  },
};
