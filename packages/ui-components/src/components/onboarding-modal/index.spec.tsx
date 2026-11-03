import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CunninghamProvider } from ":/components/provider";
import { OnboardingModal, OnboardingModalProps } from "./OnboardingModal";
import { OnboardingStep } from "./types";

const steps: OnboardingStep[] = [
  {
    icon: <span>1</span>,
    title: "Compose",
    description: "Compose description",
    content: <p>Compose preview</p>,
  },
  {
    icon: <span>2</span>,
    title: "Format",
    description: "Format description",
    content: <p>Format preview</p>,
    contentAlt: "Animation of the formatting toolbar",
  },
  {
    icon: <span>3</span>,
    title: "Share",
    description: "Share description",
    content: <button>Try sharing</button>,
  },
];

const renderOnboarding = (props: Partial<OnboardingModalProps> = {}) =>
  render(
    <CunninghamProvider>
      <OnboardingModal
        isOpen
        mainTitle="Learn the basics"
        steps={steps}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        {...props}
      />
    </CunninghamProvider>,
  );

describe("<OnboardingModal/>", () => {
  it("exposes the steps as vertical tabs controlling the preview", async () => {
    renderOnboarding();

    const heading = await screen.findByRole("heading", {
      name: "Learn the basics",
    });
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    expect(tablist).toHaveAttribute("aria-labelledby", heading.id);
    expect(tablist).not.toHaveAttribute("tabindex");

    // Steps are named by their title, the selected one is described.
    const compose = screen.getByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    expect(compose).toHaveAttribute("aria-selected", "true");
    expect(compose).toHaveAccessibleDescription("Compose description");
    expect(format).toHaveAttribute("aria-selected", "false");
    expect(format).not.toHaveAccessibleDescription();

    // Only the selected tab points to the panel, which exists.
    const panel = screen.getByRole("tabpanel");
    expect(compose).toHaveAttribute("aria-controls", panel.id);
    expect(format).not.toHaveAttribute("aria-controls");
    expect(panel).toHaveAttribute("aria-labelledby", compose.id);

    // Roving tabindex.
    expect(compose).toHaveAttribute("tabindex", "0");
    expect(format).toHaveAttribute("tabindex", "-1");
  });

  it("moves the focus with the arrows and selects with Enter or Space", async () => {
    renderOnboarding();
    const user = userEvent.setup();

    const compose = await screen.findByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    const share = screen.getByRole("tab", { name: "Share" });
    act(() => compose.focus());

    await user.keyboard("{ArrowDown}");
    expect(format).toHaveFocus();
    expect(compose).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Compose preview")).toBeInTheDocument();

    await user.keyboard("{End}");
    expect(share).toHaveFocus();
    await user.keyboard("{Home}");
    expect(compose).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(share).toHaveFocus();

    await user.keyboard("{ArrowUp}{Enter}");
    expect(format).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Format preview")).toBeInTheDocument();

    await user.keyboard("{ArrowDown} ");
    expect(share).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Try sharing")).toBeInTheDocument();
  });

  it("brings the focus back to the selected tab when tabbing back in", async () => {
    renderOnboarding();
    const user = userEvent.setup();

    const compose = await screen.findByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    act(() => compose.focus());
    await user.keyboard("{ArrowDown}");
    expect(format).toHaveAttribute("tabindex", "0");

    // react-modal cannot find tabbable elements in jsdom and blocks Tab.
    act(() => screen.getByRole("tabpanel").focus());
    expect(compose).toHaveAttribute("tabindex", "0");
    expect(format).toHaveAttribute("tabindex", "-1");
  });

  it("makes the panel focusable only when its content is not", async () => {
    renderOnboarding();
    const user = userEvent.setup();

    expect(await screen.findByRole("tabpanel")).toHaveAttribute(
      "tabindex",
      "0",
    );

    await user.click(screen.getByRole("tab", { name: "Share" }));
    await screen.findByText("Try sharing");
    expect(screen.getByRole("tabpanel")).not.toHaveAttribute("tabindex");
  });

  it("describes the panel with contentAlt", async () => {
    renderOnboarding();
    const user = userEvent.setup();

    expect(
      await screen.findByRole("tabpanel"),
    ).not.toHaveAccessibleDescription();

    await user.click(screen.getByRole("tab", { name: "Format" }));
    await screen.findByText("Format preview");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleDescription(
      "Animation of the formatting toolbar",
    );
  });

  it("announces the step changed by Next and Previous", async () => {
    const onComplete = vi.fn();
    renderOnboarding({ onComplete });
    const user = userEvent.setup();

    const status = await screen.findByRole("status");
    expect(status).toBeEmptyDOMElement();

    const next = screen.getByRole("button", { name: "Next" });
    await user.click(next);
    expect(next).toHaveFocus();
    expect(status).toHaveTextContent("Step 2 of 3: Format");
    expect(screen.getByRole("tab", { name: "Format" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(next);
    expect(status).toHaveTextContent("Step 3 of 3: Share");

    // Selecting a step from the list needs no announcement.
    await user.click(screen.getByRole("tab", { name: "Compose" }));
    expect(status).toBeEmptyDOMElement();

    await user.click(screen.getByRole("tab", { name: "Share" }));
    await user.click(screen.getByRole("button", { name: "Understood" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not move the focus to a step at opening", async () => {
    renderOnboarding();

    const compose = await screen.findByRole("tab", { name: "Compose" });
    expect(compose).not.toHaveFocus();
  });

  describe("in text-only mode", () => {
    it("renders the steps as a list of buttons marking the current one", async () => {
      renderOnboarding({ hideContent: true });
      const user = userEvent.setup();

      const heading = await screen.findByRole("heading", {
        name: "Learn the basics",
      });
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();

      const list = screen.getByRole("list", { name: "Learn the basics" });
      expect(list).toHaveAttribute("aria-labelledby", heading.id);

      const compose = screen.getByRole("button", { name: "Compose" });
      const format = screen.getByRole("button", { name: "Format" });
      expect(compose).toHaveAttribute("aria-current", "step");
      expect(compose).toHaveAccessibleDescription("Compose description");
      expect(format).not.toHaveAttribute("aria-current");

      await user.click(format);
      expect(format).toHaveAttribute("aria-current", "step");
      expect(format).toHaveAccessibleDescription("Format description");
      expect(compose).not.toHaveAttribute("aria-current");
    });
  });
});
