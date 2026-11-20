import { act, render, screen, waitFor } from "@testing-library/react";
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
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("exposes the steps as vertical tabs controlling the preview", async () => {
    // 1. Open the modal: the step list is a vertical tab list named by the
    //    heading, and is not a Tab stop of its own.
    renderOnboarding();
    const heading = await screen.findByRole("heading", {
      name: "Learn the basics",
    });
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    expect(tablist).toHaveAttribute("aria-labelledby", heading.id);
    expect(tablist).not.toHaveAttribute("tabindex");

    // 2. Each step is named by its title, and only the selected one is
    //    described.
    const compose = screen.getByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    expect(compose).toHaveAttribute("aria-selected", "true");
    expect(compose).toHaveAccessibleDescription("Compose description");
    expect(format).toHaveAttribute("aria-selected", "false");
    expect(format).not.toHaveAccessibleDescription();

    // 3. Only the selected step controls the panel, which is named after it.
    const panel = screen.getByRole("tabpanel");
    expect(compose).toHaveAttribute("aria-controls", panel.id);
    expect(format).not.toHaveAttribute("aria-controls");
    expect(panel).toHaveAttribute("aria-labelledby", compose.id);

    // 4. Only the selected step is in the tab order (roving tabindex).
    expect(compose).toHaveAttribute("tabindex", "0");
    expect(format).toHaveAttribute("tabindex", "-1");
  });

  it("moves the focus with the arrows and selects with Enter or Space", async () => {
    // 1. Focus the first step.
    renderOnboarding();
    const user = userEvent.setup();
    const compose = await screen.findByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    const share = screen.getByRole("tab", { name: "Share" });
    act(() => compose.focus());

    // 2. An arrow moves the focus without selecting: the preview does not
    //    change (manual activation).
    await user.keyboard("{ArrowDown}");
    expect(format).toHaveFocus();
    expect(compose).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Compose preview")).toBeInTheDocument();

    // 3. End and Home jump to the last and first steps, and the arrows wrap.
    await user.keyboard("{End}");
    expect(share).toHaveFocus();
    await user.keyboard("{Home}");
    expect(compose).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(share).toHaveFocus();

    // 4. Enter selects the focused step and shows its preview.
    await user.keyboard("{ArrowUp}{Enter}");
    expect(format).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Format preview")).toBeInTheDocument();

    // 5. Space selects too.
    await user.keyboard("{ArrowDown} ");
    expect(share).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Try sharing")).toBeInTheDocument();
  });

  it("brings the focus back to the selected tab when tabbing back in", async () => {
    // 1. Move the focus to another step without selecting it.
    renderOnboarding();
    const user = userEvent.setup();
    const compose = await screen.findByRole("tab", { name: "Compose" });
    const format = screen.getByRole("tab", { name: "Format" });
    act(() => compose.focus());
    await user.keyboard("{ArrowDown}");
    expect(format).toHaveAttribute("tabindex", "0");

    // 2. Leave the list: the selected step is the Tab stop again.
    //    react-modal cannot find tabbable elements in jsdom and blocks Tab.
    act(() => screen.getByRole("tabpanel").focus());
    expect(compose).toHaveAttribute("tabindex", "0");
    expect(format).toHaveAttribute("tabindex", "-1");
  });

  it("makes the panel focusable only when its content is not", async () => {
    // 1. The first preview has nothing focusable: the panel is a Tab stop.
    renderOnboarding();
    const user = userEvent.setup();
    expect(await screen.findByRole("tabpanel")).toHaveAttribute(
      "tabindex",
      "0",
    );

    // 2. The Share preview holds a button: the panel leaves the tab order.
    await user.click(screen.getByRole("tab", { name: "Share" }));
    await screen.findByText("Try sharing");
    expect(screen.getByRole("tabpanel")).not.toHaveAttribute("tabindex");
  });

  it("describes the panel with contentAlt", async () => {
    // 1. The first step has no contentAlt: the panel has no description.
    renderOnboarding();
    const user = userEvent.setup();
    expect(
      await screen.findByRole("tabpanel"),
    ).not.toHaveAccessibleDescription();

    // 2. Select Format: the panel is described by its contentAlt at once,
    //    while the previous preview is still fading out.
    await user.click(screen.getByRole("tab", { name: "Format" }));
    expect(screen.getByText("Compose preview")).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveAccessibleDescription(
      "Animation of the formatting toolbar",
    );

    // 3. Once the fade is over, the preview and the description match.
    await screen.findByText("Format preview");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleDescription(
      "Animation of the formatting toolbar",
    );
  });

  it("announces the step changed by Next and Previous", async () => {
    // 1. Open the modal: the status region is empty.
    const onComplete = vi.fn();
    renderOnboarding({ onComplete });
    const user = userEvent.setup();
    const status = await screen.findByRole("status");
    expect(status).toBeEmptyDOMElement();

    // 2. Next keeps the focus on itself, selects the next step and announces
    //    it.
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

    // 3. Selecting a step from the list needs no announcement: the focus is
    //    already on it.
    await user.click(screen.getByRole("tab", { name: "Compose" }));
    expect(status).toBeEmptyDOMElement();

    // 4. On the last step, the main button completes the onboarding.
    await user.click(screen.getByRole("tab", { name: "Share" }));
    await user.click(screen.getByRole("button", { name: "Understood" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("scrolls the selected step into view when Next changes it", async () => {
    // 1. Watch the scroll of the second step.
    renderOnboarding();
    const user = userEvent.setup();
    const format = await screen.findByRole("tab", { name: "Format" });
    format.scrollIntoView = vi.fn();

    // 2. Next keeps the focus on itself, so the list scrolls to the new step.
    await user.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() =>
      expect(format.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
      }),
    );
  });

  it("marks a footer link that opens in a new window", async () => {
    renderOnboarding({
      footerLink: { label: "Learn more", href: "https://example.com" },
    });

    const link = await screen.findByRole("link", {
      name: "Learn more (opens in a new window)",
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a footer action without href as a button", async () => {
    const onClick = vi.fn();
    renderOnboarding({ footerLink: { label: "Take the tour", onClick } });
    const user = userEvent.setup();

    const button = await screen.findByRole("button", { name: "Take the tour" });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("warns in development when only some steps have a content", async () => {
    // 1. Run in development and listen to the console.
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    // 2. Mix a step with a preview and a step without one.
    renderOnboarding({
      steps: [steps[0], { icon: <span>4</span>, title: "No preview" }],
    });
    await screen.findByRole("tablist");

    // 3. The developer is told to give a content to every step.
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("give a content to every step"),
    );
    warn.mockRestore();
    vi.unstubAllEnvs();
  });

  it("does not move the focus to a step at opening", async () => {
    // 1. Open the modal: the focus follows the Modal default, not the first
    //    step.
    renderOnboarding();
    const compose = await screen.findByRole("tab", { name: "Compose" });
    expect(compose).not.toHaveFocus();
  });

  describe("in text-only mode", () => {
    it("renders the steps as a list of buttons marking the current one", async () => {
      // 1. Open the modal without preview: there are no tabs and no panel.
      renderOnboarding({ hideContent: true });
      const user = userEvent.setup();
      const heading = await screen.findByRole("heading", {
        name: "Learn the basics",
      });
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();

      // 2. The steps are a list named by the heading.
      const list = screen.getByRole("list", { name: "Learn the basics" });
      expect(list).toHaveAttribute("aria-labelledby", heading.id);

      // 3. Each step is a button named by its title. The current one is
      //    marked and described.
      const compose = screen.getByRole("button", { name: "Compose" });
      const format = screen.getByRole("button", { name: "Format" });
      expect(compose).toHaveAttribute("aria-current", "step");
      expect(compose).toHaveAccessibleDescription("Compose description");
      expect(format).not.toHaveAttribute("aria-current");

      // 4. Clicking another step moves the mark and the description to it.
      await user.click(format);
      expect(format).toHaveAttribute("aria-current", "step");
      expect(format).toHaveAccessibleDescription("Format description");
      expect(compose).not.toHaveAttribute("aria-current");
    });
  });
});
