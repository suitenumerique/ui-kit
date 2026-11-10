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

const RaiseToast = ({
  message = "Document saved",
  duration,
  primaryLabel,
}: {
  message?: string;
  duration?: number;
  primaryLabel?: string;
}) => {
  const { toast } = useToastProvider();
  return (
    <Button
      onClick={() =>
        toast(message, VariantType.INFO, {
          duration,
          primaryLabel,
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
      expect(region).toHaveAttribute("aria-live", "polite");
      expect(region).not.toHaveTextContent("Document saved");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      // The region stays a sibling of the provider children. Wrapping both
      // would put the toast container inside the app shell the other branch moves.
      expect(region.parentElement).toBe(trigger.parentElement);
      expect(region.parentElement).toBe(
        document.querySelector(".Toastify")?.parentElement,
      );

      trigger.focus();
      fireEvent.click(trigger);

      const toast = screen.getByRole("status");
      expect(toast).toHaveTextContent("Document saved");
      expect(trigger).toHaveFocus();
      expect(toast.contains(document.activeElement)).toBe(false);
      expect(region).not.toHaveTextContent("Document saved");

      act(() => {
        vi.advanceTimersByTime(99);
      });
      expect(region).not.toHaveTextContent("Document saved");

      act(() => {
        vi.advanceTimersByTime(51);
      });
      expect(region).toHaveTextContent("Document saved");
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
      render(<RaiseToast duration={1000} primaryLabel="Undo" />, {
        wrapper: CunninghamProvider,
      });

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

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(wrapper).toHaveAttribute("data-in", "true");

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
});
