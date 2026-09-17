import React, { PropsWithChildren } from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { CunninghamProvider } from ":/components/provider";
import { useToastProvider } from ":/components/toast/ToastProvider";
import { Button } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";

describe("<Toast />", () => {
  const Wrapper = ({ children }: PropsWithChildren) => {
    return <CunninghamProvider>{children}</CunninghamProvider>;
  };

  it("shows a toast when clicking on the button and disappears", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Toast content", VariantType.NEUTRAL, { duration: 50 })
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
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await screen.findByRole("alert");
    expect(toast).toHaveTextContent("Toast content");

    await waitForElementToBeRemoved(toast);
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
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await screen.findByRole("alert");
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
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(button);

    // Toast displayed.
    const toast = await screen.findByRole("alert");
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

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(button);

    const toast = await screen.findByRole("alert");
    expect(toast).toHaveTextContent("Toast content");
    expect(toast.querySelector(".c__toast__icon svg")).toBeInTheDocument();
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

    const toast = await screen.findByRole("alert");
    expect(within(toast).getByTestId("custom-icon")).toBeInTheDocument();
    expect(toast.querySelector(".c__toast__icon svg")).not.toBeInTheDocument();
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

    const toast = await screen.findByRole("alert");
    expect(toast.querySelector(".c__toast__icon")).not.toBeInTheDocument();
  });
});
