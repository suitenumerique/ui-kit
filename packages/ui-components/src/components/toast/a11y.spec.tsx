import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent, within } from "@testing-library/dom";
import { CunninghamProvider } from ":/components/provider";
import {
  ToastProvider,
  useToastProvider,
} from ":/components/toast/ToastProvider";
import { Button } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";
import deDE from ":/locales/de-DE.json";

const LIVE_REGION_NAME = "Notifications Alt+T";

const announcer = (politeness: "polite" | "assertive") => {
  const region = document.querySelector(
    `.c__toast__announcer [aria-live="${politeness}"]`,
  );
  if (!(region instanceof HTMLElement)) {
    throw new Error(`${politeness} announcer missing`);
  }
  return region;
};

const liveNodesContaining = (text: string) =>
  [...document.querySelectorAll<HTMLElement>("[aria-live]")].filter(
    (node) =>
      node.getAttribute("aria-live") !== "off" &&
      node.textContent?.includes(text),
  );

const RaiseToast = ({
  message = "Document saved",
  duration,
  primaryLabel,
  tertiaryLabel,
  type = VariantType.INFO,
}: {
  message?: string;
  duration?: number;
  primaryLabel?: string;
  tertiaryLabel?: string;
  type?: VariantType;
}) => {
  const { toast } = useToastProvider();
  return (
    <Button
      onClick={() =>
        toast(message, type, {
          duration,
          primaryLabel,
          tertiaryLabel,
        })
      }
    >
      Create toast
    </Button>
  );
};

describe("toast announcements", () => {
  it("keeps a live region mounted and announces the toast after focus settles", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      render(<RaiseToast />, { wrapper: CunninghamProvider });

      const region = screen.getByRole("region", { name: LIVE_REGION_NAME });
      const trigger = screen.getByRole("button", { name: "Create toast" });
      expect(region).toHaveClass("Toastify");
      expect(region).toHaveAttribute("aria-live", "off");
      expect(announcer("polite")).not.toHaveTextContent("Document saved");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      // The container and the announcer stay siblings of the provider
      // children, so moving `.c__app` inside the provider keeps both outside it.
      expect(region.parentElement).toBe(trigger.parentElement);
      expect(announcer("polite").parentElement?.parentElement).toBe(
        trigger.parentElement,
      );

      trigger.focus();
      fireEvent.click(trigger);

      const toast = screen.getByRole("status");
      expect(toast).toHaveTextContent("Document saved");
      expect(toast).toHaveAttribute("aria-live", "off");
      expect(trigger).toHaveFocus();
      expect(toast.contains(document.activeElement)).toBe(false);
      expect(announcer("polite")).not.toHaveTextContent("Document saved");

      act(() => {
        vi.advanceTimersByTime(99);
      });
      expect(announcer("polite")).not.toHaveTextContent("Document saved");

      act(() => {
        vi.advanceTimersByTime(51);
      });
      expect(announcer("polite")).toHaveTextContent("Document saved");
      expect(liveNodesContaining("Document saved")).toEqual([
        announcer("polite"),
      ]);
      expect(trigger).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it("names the live region with the translated shortcut", () => {
    render(<RaiseToast />, {
      wrapper: ({ children }) => (
        <CunninghamProvider
          currentLocale="de-DE"
          customLocales={{ "de-DE": deDE }}
        >
          {children}
        </CunninghamProvider>
      ),
    });

    expect(
      screen.getByRole("region", { name: "Benachrichtigungen Alt+T" }),
    ).toBeInTheDocument();
  });

  it("moves focus into the first visible toast with Alt+T", async () => {
    const user = userEvent.setup();
    render(<RaiseToast />, { wrapper: CunninghamProvider });

    await user.click(screen.getByRole("button", { name: "Create toast" }));
    const toast = screen.getByRole("status");
    expect(toast.contains(document.activeElement)).toBe(false);

    await user.keyboard("{Alt>}t{/Alt}");

    expect(toast.closest(".Toastify__toast")).toHaveFocus();
    expect(
      screen.getByRole("region", { name: LIVE_REGION_NAME }),
    ).toHaveAccessibleName(LIVE_REGION_NAME);
  });

  it("follows a shortcut passed to ToastProvider", async () => {
    const user = userEvent.setup();
    render(
      <CunninghamProvider>
        <ToastProvider shortcut="Ctrl+Shift+N">
          <RaiseToast message="Renamed" />
        </ToastProvider>
      </CunninghamProvider>,
    );

    expect(
      screen.getByRole("region", { name: "Notifications Ctrl+Shift+N" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create toast" }));
    const toast = screen.getByRole("status");

    await user.keyboard("{Alt>}t{/Alt}");
    expect(toast.closest(".Toastify__toast")).not.toHaveFocus();

    await user.keyboard("{Control>}{Shift>}n{/Shift}{/Control}");
    expect(toast.closest(".Toastify__toast")).toHaveFocus();
  });

  it("pauses the timer while a control inside the toast has focus", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      render(
        <RaiseToast duration={1000} primaryLabel="Undo" tertiaryLabel="Open" />,
        {
          wrapper: CunninghamProvider,
        },
      );

      const trigger = screen.getByRole("button", { name: "Create toast" });
      fireEvent.click(trigger);
      const toast = screen.getByRole("status");
      const wrapper = toast.closest(".Toastify__toast");
      if (!wrapper) {
        throw new Error("toast wrapper missing");
      }
      // jsdom never finishes the enter animation, which is what starts the timer.
      fireEvent.animationEnd(wrapper);
      const bar = wrapper.querySelector("[role='progressbar']");
      if (!(bar instanceof HTMLElement)) {
        throw new Error("progress bar missing");
      }
      expect(bar.style.animationPlayState).toBe("running");

      const undo = within(toast).getByRole("button", { name: "Undo" });
      act(() => {
        undo.focus();
      });
      expect(undo).toHaveFocus();
      expect(bar.style.animationPlayState).toBe("paused");

      const open = within(toast).getByRole("button", { name: "Open" });
      act(() => {
        open.focus();
      });
      expect(open).toHaveFocus();
      expect(bar.style.animationPlayState).toBe("paused");

      act(() => {
        undo.focus();
      });
      expect(bar.style.animationPlayState).toBe("paused");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(undo).toHaveFocus();
      expect(bar.style.animationPlayState).toBe("paused");

      fireEvent.mouseOver(undo);
      fireEvent.mouseOut(undo, { relatedTarget: trigger });
      expect(bar.style.animationPlayState).toBe("paused");

      act(() => {
        trigger.focus();
      });
      expect(trigger).toHaveFocus();
      expect(bar.style.animationPlayState).toBe("running");

      // The remaining time is the progress animation. jsdom does not run it.
      fireEvent.animationEnd(bar);
      expect(wrapper).toHaveAttribute("data-in", "false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns focus to the previous element when a focused toast closes", async () => {
    const user = userEvent.setup();
    render(<RaiseToast />, { wrapper: CunninghamProvider });

    const trigger = screen.getByRole("button", { name: "Create toast" });
    await user.click(trigger);
    const toast = screen.getByRole("status");
    const wrapper = toast.closest(".Toastify__toast");
    if (!wrapper) {
      throw new Error("toast wrapper missing");
    }

    await user.keyboard("{Alt>}t{/Alt}");
    expect(wrapper).toHaveFocus();

    const bar = wrapper.querySelector("[role='progressbar']");
    if (!(bar instanceof HTMLElement)) {
      throw new Error("progress bar missing");
    }
    fireEvent.animationEnd(bar);

    expect(trigger).toHaveFocus();
  });

  it("announces every toast raised in the same turn, and an update", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const Harness = () => {
        const { toast, updateToast } = useToastProvider();
        return (
          <Button
            onClick={() => {
              toast("Saved", VariantType.INFO);
              const id = toast("Uploading", VariantType.INFO);
              updateToast(id, { message: "Uploaded" });
            }}
          >
            Create toast
          </Button>
        );
      };
      render(<Harness />, { wrapper: CunninghamProvider });
      fireEvent.click(screen.getByRole("button", { name: "Create toast" }));

      act(() => {
        vi.advanceTimersByTime(150);
      });

      const polite = announcer("polite");
      expect(polite).toHaveTextContent("Saved");
      expect(polite).toHaveTextContent("Uploaded");
      expect(polite).not.toHaveTextContent("Uploading");
      expect(liveNodesContaining("Saved")).toEqual([polite]);
      expect(liveNodesContaining("Uploaded")).toEqual([polite]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("announces an error assertively and only once", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      render(<RaiseToast message="Failed" type={VariantType.ERROR} />, {
        wrapper: CunninghamProvider,
      });
      fireEvent.click(screen.getByRole("button", { name: "Create toast" }));
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(announcer("assertive")).toHaveTextContent("Failed");
      expect(announcer("polite")).not.toHaveTextContent("Failed");
      expect(liveNodesContaining("Failed")).toEqual([announcer("assertive")]);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "off");
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps a second toast running after Alt+T focuses the first", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() => {
            toast("First", VariantType.INFO);
            toast("Second", VariantType.INFO);
          }}
        >
          Create toast
        </Button>
      );
    };
    render(<Harness />, { wrapper: CunninghamProvider });
    await user.click(screen.getByRole("button", { name: "Create toast" }));

    const wrappers = [
      ...document.querySelectorAll<HTMLElement>(".Toastify__toast"),
    ];
    expect(wrappers).toHaveLength(2);
    wrappers.forEach((wrapper) => fireEvent.animationEnd(wrapper));
    const bars = wrappers.map((wrapper) => {
      const bar = wrapper.querySelector("[role='progressbar']");
      if (!(bar instanceof HTMLElement)) {
        throw new Error("progress bar missing");
      }
      return bar;
    });

    await user.keyboard("{Alt>}t{/Alt}");
    expect(wrappers[0]).toHaveFocus();
    expect(bars[0].style.animationPlayState).toBe("paused");
    expect(bars[1].style.animationPlayState).toBe("running");
  });
});
