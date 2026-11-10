import React, { PropsWithChildren } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { CunninghamProvider } from ":/components/provider";
import { useToastProvider } from ":/components/toast/ToastProvider";
import { Toast, ToastProps } from ":/components/toast";
import { Button } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";

// A provider toast has no live role, so it is found through its message.
const findToast = async (text: string) => {
  const message = await screen.findByText(text, { selector: ".c__toast *" });
  const toast = message.closest(".c__toast");
  if (!(toast instanceof HTMLElement)) {
    throw new Error(`toast "${text}" missing`);
  }
  return toast;
};

describe("<Toast />", () => {
  const Wrapper = ({ children }: PropsWithChildren) => {
    return <CunninghamProvider>{children}</CunninghamProvider>;
  };

  // The dismissal itself is driven by a CSS animation, which jsdom parses but
  // never runs. `e2e/toast/toast.spec.tsx` covers it in a real browser.
  it("shows a toast when clicking on the button", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button onClick={() => toast("Toast content", VariantType.NEUTRAL)}>
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });

    const user = userEvent.setup();
    const button = screen.getByText("Create toast");

    // No toast displayed.
    expect(document.querySelector(".c__toast")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await findToast("Toast content");
    expect(toast).toHaveTextContent("Toast content");
  });

  it("shows a toast with a primary button", async () => {
    let flag = false;
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.NEUTRAL, {
              primaryLabel: "Action",
              primaryOnClick: () => {
                flag = true;
              },
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });

    const user = userEvent.setup();
    const button = screen.getByText("Create toast");

    // No toast displayed.
    expect(document.querySelector(".c__toast")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await findToast("Toast content");
    expect(toast).toHaveTextContent("Toast content");
    // Toast has a button.
    const $button = within(toast).getByRole("button", { name: "Action" });
    expect($button).toHaveClass("c__button--small");

    // Button is not clicked yet.
    expect(flag).toBe(false);
    await user.click($button);
    // Button is clicked.
    await waitFor(() => expect(flag).toBe(true));
  });
  it("shows a toast with custom buttons", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.NEUTRAL, {
              actions: <Button variant="tertiary">Tertiary</Button>,
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });

    const user = userEvent.setup();
    const button = screen.getByText("Create toast");

    // No toast displayed.
    expect(document.querySelector(".c__toast")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await findToast("Toast content");
    expect(toast).toHaveTextContent("Toast content");
    // Toast has custom button.
    within(toast).getByRole("button", { name: "Tertiary" });
  });

  it.each([
    VariantType.INFO,
    VariantType.SUCCESS,
    VariantType.WARNING,
    VariantType.ERROR,
    VariantType.NEUTRAL,
  ])("shows a %s toast with the default arrow icon", async (type) => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button onClick={() => toast("Toast content", type)}>
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });

    const user = userEvent.setup();
    const button = screen.getByText("Create toast");

    expect(document.querySelector(".c__toast")).not.toBeInTheDocument();

    await user.click(button);

    // The provider's announcer speaks for every type, so no toast has a role.
    const toast = await findToast("Toast content");
    expect(toast).toHaveClass(`c__toast--${type}`);
    expect(toast).not.toHaveAttribute("role");
    expect(
      toast.querySelector(".c__notification__icon svg"),
    ).toBeInTheDocument();
  });

  it("lets icon replace the default arrow", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.INFO, {
              icon: <span data-testid="custom-icon">!</span>,
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });
    await userEvent.setup().click(screen.getByText("Create toast"));

    const toast = await findToast("Toast content");
    expect(within(toast).getByTestId("custom-icon")).toBeInTheDocument();
    expect(
      toast.querySelector(".c__notification__icon svg"),
    ).not.toBeInTheDocument();
  });

  it("renders the labelled buttons with the shared borderless look", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.NEUTRAL, {
              primaryLabel: "Primary",
              tertiaryLabel: "Tertiary",
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });
    await userEvent.setup().click(screen.getByText("Create toast"));

    const toast = await findToast("Toast content");
    expect(within(toast).getByRole("button", { name: "Primary" })).toHaveClass(
      "c__notification__action",
      "c__button--small",
    );
    expect(within(toast).getByRole("button", { name: "Tertiary" })).toHaveClass(
      "c__notification__action",
      "c__button--small",
    );
  });

  it("dismisses the toast from the close button when canClose is set", async () => {
    const onDelete = vi.fn();
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.NEUTRAL, {
              canClose: true,
              disableAnimate: true,
              onDelete,
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });
    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await findToast("Toast content");
    await user.click(
      within(toast).getByRole("button", { name: "Close notification" }),
    );

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
  });

  it("hides the icon when hideIcon is set", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.INFO, { hideIcon: true })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: Wrapper });
    await userEvent.setup().click(screen.getByText("Create toast"));

    const toast = await findToast("Toast content");
    expect(
      toast.querySelector(".c__notification__icon"),
    ).not.toBeInTheDocument();
  });

  // The provider raises toasts through react-toastify, but `Toast` is exported
  // on its own too and has to keep working when mounted directly.
  describe("mounted on its own", () => {
    const standalone = (props: Partial<ToastProps> = {}) =>
      render(
        <Toast type={VariantType.INFO} {...props}>
          Standalone
        </Toast>,
        { wrapper: Wrapper },
      );

    it("is announced as a status", () => {
      standalone();
      expect(screen.getByRole("status")).toHaveTextContent("Standalone");
      expect(screen.getByRole("status")).not.toHaveAttribute("aria-live");
    });

    it.each([VariantType.WARNING, VariantType.ERROR])(
      "is announced as an alert when %s",
      (type) => {
        standalone({ type });
        expect(screen.getByRole("alert")).toHaveTextContent("Standalone");
        expect(screen.getByRole("alert")).not.toHaveAttribute("aria-live");
      },
    );

    it("fades out and calls onDelete once its duration has elapsed", async () => {
      const onDelete = vi.fn();
      standalone({ duration: 50, onDelete });

      expect(onDelete).not.toHaveBeenCalled();
      await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
      expect(screen.getByRole("status")).toHaveClass("c__toast--disappear");
    });

    it("dismisses itself from the close button when canClose is set", async () => {
      const onDelete = vi.fn();
      standalone({ canClose: true, onDelete });

      await userEvent.click(
        screen.getByRole("button", { name: "Close notification" }),
      );

      await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
      expect(screen.getByRole("status")).toHaveClass("c__toast--disappear");
    });

    it("never schedules a dismissal without a duration", async () => {
      const onDelete = vi.fn();
      standalone({ onDelete });

      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(onDelete).not.toHaveBeenCalled();
      expect(screen.getByRole("status")).not.toHaveClass("c__toast--disappear");
    });

    it("opts out of the timer when disableAnimate is set", async () => {
      const onDelete = vi.fn();
      standalone({ duration: 20, disableAnimate: true, onDelete });

      await new Promise((resolve) => setTimeout(resolve, 80));
      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});
