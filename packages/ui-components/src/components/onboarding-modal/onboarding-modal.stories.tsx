import { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Controls } from "@storybook/blocks";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { OnboardingModal } from "./OnboardingModal";
import { OnboardingStep } from "./types";

/**
 * The `OnboardingModal` component displays a step-by-step onboarding wizard inside a modal,
 * with an optional content preview zone (image, video, or any React component).
 *
 * > **Tip:** It is recommended to use **4 steps or fewer** for the best user experience.
 *
 * ## Basic usage
 *
 * ```tsx
 * import { OnboardingModal, OnboardingStep } from "@gouvfr-lasuite/ui-kit";
 *
 * const steps: OnboardingStep[] = [
 *   {
 *     icon: <span className="material-icons">grid_view</span>,
 *     title: "Compose your doc easily",
 *     description: "Move, duplicate, and transform your content.",
 *     content: <img src="/onboarding-1.png" alt="Step 1" />,
 *   },
 *   {
 *     icon: <span className="material-icons">share</span>,
 *     title: "Share and collaborate",
 *     description: "Decide who can view, comment, or edit.",
 *     content: <img src="/onboarding-2.png" alt="Step 2" />,
 *   },
 * ];
 *
 * <OnboardingModal
 *   isOpen={isOpen}
 *   appName="Discover Docs"
 *   mainTitle="Learn the core principles"
 *   steps={steps}
 *   onClose={() => setIsOpen(false)}
 *   onComplete={() => setIsOpen(false)}
 * />
 * ```
 *
 * ## OnboardingStep props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `icon` | `ReactNode` | Icon displayed next to the step title |
 * | `activeIcon` | `ReactNode` | Icon displayed when the step is active (optional, defaults to `icon` with brand color) |
 * | `title` | `string` | Step title |
 * | `description` | `string` | Step description, visible only when the step is active |
 * | `content` | `ReactNode` | Content displayed in the preview zone (image, video, component, etc.) |
 *
 * ## OnboardingModalProps
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `isOpen` | `boolean` | Whether the modal is open |
 * | `mainTitle` | `string` | Main heading of the modal |
 * | `steps` | `OnboardingStep[]` | Array of onboarding steps (recommended: 4 max) |
 * | `onComplete` | `() => void` | Called when the user clicks the final Understood button |
 * | `onClose` | `() => void` | Called when the user closes the modal |
 * | `appName` | `string` | Application name displayed above the title |
 * | `size` | `ModalSize` | Modal size on desktop (default: `ModalSize.LARGE`) |
 * | `initialStep` | `number` | Index of the initially active step (default: `0`) |
 * | `hideContent` | `boolean` | Hide the content preview zone (text-only mode) |
 * | `onSkip` | `() => void` | Called when the user clicks Skip |
 * | `footerLink` | `{ label, href?, onClick? }` | Optional link displayed in the footer |
 * | `labels` | `{ skip?, next?, previous?, complete? }` | Custom labels for i18n |
 *
 * ## Text-only mode
 *
 * Set `hideContent` to remove the preview zone and display only the step list:
 *
 * ```tsx
 * <OnboardingModal
 *   isOpen={isOpen}
 *   mainTitle="Welcome"
 *   steps={textOnlySteps}
 *   hideContent
 *   onClose={() => setIsOpen(false)}
 *   onComplete={() => setIsOpen(false)}
 * />
 * ```
 *
 * ## Custom labels
 *
 * Override the default button labels for i18n:
 *
 * ```tsx
 * <OnboardingModal
 *   // ...props
 *   labels={{
 *     skip: "Skip",
 *     next: "Next",
 *     previous: "Previous",
 *     complete: "Understood!",
 *   }}
 * />
 * ```
 */
const meta: Meta<typeof OnboardingModal> = {
  title: "Components/OnboardingModal",
  component: OnboardingModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Controls />
        </>
      ),
    },
  },
  argTypes: {
    isOpen: { description: "Whether the modal is open" },
    mainTitle: { description: "Main heading of the modal" },
    steps: { description: "Array of onboarding steps (recommended: 4 max)" },
    appName: { description: "Application name displayed above the title" },
    size: { description: "Modal size on desktop (default: ModalSize.LARGE)" },
    initialStep: {
      description: "Index of the initially active step (default: 0)",
    },
    hideContent: {
      description: "Hide the content preview zone (text-only mode)",
    },
    onSkip: { description: "Called when the user clicks Skip" },
    onComplete: {
      description: "Called when the user clicks the final Understood button",
    },
    onClose: { description: "Called when the user closes the modal" },
    footerLink: { description: "Optional link displayed in the footer" },
    labels: {
      description: "Custom labels for i18n (skip, next, previous, complete)",
    },
  },
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
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

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

/** Default onboarding modal with 4 steps, app name, skip button, and footer link. */
export const Default: Story = {
  render: () => <OnboardingModalDemo />,
};

/** Without the application name above the title. */
export const WithoutAppName: Story = {
  render: () => <OnboardingModalDemo appName={undefined} />,
};

/** Without the Skip button — the user must go through all steps. */
export const WithoutSkip: Story = {
  render: () => <OnboardingModalDemo onSkip={undefined} />,
};

/** Without the footer link at the bottom. */
export const WithoutFooterLink: Story = {
  render: () => <OnboardingModalDemo footerLink={undefined} />,
};

/** Overriding the default button labels for French i18n. */
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

/** Starting the onboarding at step 2 using `initialStep`. */
export const StartAtStep2: Story = {
  render: () => <OnboardingModalDemo initialStep={1} />,
};

/** With 6 steps — the step list becomes scrollable. */
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

/** Steps with custom React components and video as content. */
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
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls />
        ),
      },
    ];
    return <OnboardingModalDemo steps={customSteps} />;
  },
};

// Text-only steps (no content)
const textOnlySteps: OnboardingStep[] = [
  {
    icon: <GridIcon />,
    title: "Compose your doc easily",
    description:
      "Move, duplicate, and transform your texts, headings, lists, images without breaking your layout.",
  },
  {
    icon: <FormatIcon />,
    title: "Format your content with the toolbar",
    description:
      "Apply styles, structure, and emphasis in one click—keep documents clean, consistent, and easy to scan.",
  },
  {
    icon: <ShareIcon />,
    title: "Share and collaborate with ease",
    description:
      "Decide exactly who can view, comment, edit—or simply use shareable links.",
  },
  {
    icon: <LibraryIcon />,
    title: "Draw inspiration from the content library",
    description:
      "Start from ready-made templates for common use cases, then customize them to match your workflow in minutes.",
  },
];

/** Text-only mode with `hideContent` — no content preview zone. */
export const TextOnly: Story = {
  render: () => <OnboardingModalDemo steps={textOnlySteps} hideContent />,
};

// Example with custom activeIcon using SVG icons (different icon, not just color)
const GridIconOutline = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
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

/** Using `activeIcon` to display a different icon variant when the step is active. */
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
