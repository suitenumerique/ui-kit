import { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Controls } from "@storybook/blocks";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { ReleaseNoteModal } from "./ReleaseNoteModal";
import { ReleaseNoteStep } from "./types";

/**
 * The `ReleaseNoteModal` is a wrapper around `OnboardingModal` configured for displaying
 * release notes in a text-only, medium-sized modal.
 *
 * > **Tip:** It is recommended to use **4 steps or fewer** for the best user experience.
 *
 * ## Basic usage
 *
 * ```tsx
 * import { ReleaseNoteModal, ReleaseNoteStep } from "@gouvfr-lasuite/ui-kit";
 *
 * const steps: ReleaseNoteStep[] = [
 *   {
 *     icon: <span className="material-icons">new_releases</span>,
 *     title: "New collaboration mode",
 *     description: "Work together in real-time with your team.",
 *   },
 *   {
 *     icon: <span className="material-icons">speed</span>,
 *     title: "Faster document loading",
 *     description: "Documents now load up to 3x faster.",
 *   },
 * ];
 *
 * <ReleaseNoteModal
 *   isOpen={isOpen}
 *   appName="Docs v2.4"
 *   mainTitle="What's new"
 *   steps={steps}
 *   onClose={() => setIsOpen(false)}
 *   onComplete={() => setIsOpen(false)}
 * />
 * ```
 *
 * ## ReleaseNoteStep props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `icon` | `ReactNode` | Icon displayed next to the step title |
 * | `activeIcon` | `ReactNode` | Icon displayed when the step is active (optional) |
 * | `title` | `string` | Step title |
 * | `description` | `string` | Step description, visible only when the step is active |
 *
 * ## Differences with OnboardingModal
 *
 * - No `content` property in steps — the preview zone is always hidden
 * - Modal size is fixed to `ModalSize.MEDIUM`
 * - `hideContent` is always enabled
 */
const meta: Meta<typeof ReleaseNoteModal> = {
  title: "Components/ReleaseNoteModal",
  component: ReleaseNoteModal,
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
    steps: {
      description: "Array of release note steps (recommended: 4 max)",
    },
    appName: { description: "Version or app name displayed above the title" },
    onSkip: { description: "Called when the user clicks Skip" },
    onComplete: { description: "Called when the user clicks the final button" },
    onClose: { description: "Called when the user closes the modal" },
    footerLink: { description: "Optional link (e.g. full changelog)" },
    labels: { description: "Custom labels for i18n" },
  },
};

export default meta;
type Story = StoryObj<typeof ReleaseNoteModal>;

const AutoFixIcon = () => <span className="material-icons">auto_fix_high</span>;
const BugReportIcon = () => <span className="material-icons">bug_report</span>;
const SpeedIcon = () => <span className="material-icons">speed</span>;
const NewReleasesIcon = () => (
  <span className="material-icons">new_releases</span>
);

const sampleSteps: ReleaseNoteStep[] = [
  {
    icon: <NewReleasesIcon />,
    title: "New collaboration mode",
    description:
      "Work together in real-time with your team. See who's editing, leave comments, and resolve suggestions—all in one place.",
  },
  {
    icon: <AutoFixIcon />,
    title: "Improved formatting toolbar",
    description:
      "The toolbar now adapts to your context: select text for inline styles, click a block for layout options.",
  },
  {
    icon: <SpeedIcon />,
    title: "Faster document loading",
    description:
      "Documents now load up to 3x faster thanks to lazy rendering and optimized data fetching.",
  },
  {
    icon: <BugReportIcon />,
    title: "Bug fixes and stability",
    description:
      "Resolved issues with copy-paste formatting, table resizing, and image drag-and-drop on mobile.",
  },
];

const ReleaseNoteModalDemo = ({
  steps = sampleSteps,
  ...props
}: Partial<React.ComponentProps<typeof ReleaseNoteModal>> & {
  steps?: ReleaseNoteStep[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => { setIsOpen(true); }, []);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Release Notes</Button>
      <ReleaseNoteModal
        isOpen={isOpen}
        appName="Docs v2.4"
        mainTitle="What's new"
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
        {...props}
      />
    </>
  );
};

/** Default release note modal with 4 steps and a skip button. */
export const Default: Story = {
  render: () => <ReleaseNoteModalDemo />,
};

/** With an optional footer link pointing to the full changelog. */
export const WithFooterLink: Story = {
  render: () => (
    <ReleaseNoteModalDemo
      footerLink={{
        label: "View full changelog",
        href: "#",
      }}
    />
  ),
};

/** Without the Skip button — the user must go through all steps. */
export const WithoutSkip: Story = {
  render: () => <ReleaseNoteModalDemo onSkip={undefined} />,
};
