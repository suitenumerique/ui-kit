import { useRef } from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { CunninghamProvider } from ":/components/provider";
import { useToastProvider } from ":/components/toast/ToastProvider";
import { Button } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";
import { ToastId } from "./types";

describe("<ToastProvider />", () => {
  it("keeps a toast inside the provider it was raised from", async () => {
    const Inner = ({ label }: { label: string }) => {
      const { toast } = useToastProvider();
      return (
        <Button onClick={() => toast(label, VariantType.NEUTRAL)}>
          {label}
        </Button>
      );
    };

    render(
      <>
        <CunninghamProvider>
          <div data-testid="first">
            <Inner label="first" />
          </div>
        </CunninghamProvider>
        <CunninghamProvider>
          <div data-testid="second">
            <Inner label="second" />
          </div>
        </CunninghamProvider>
      </>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("first"));

    const toast = await screen.findByRole("alert");
    expect(toast.closest(".c__app")).toBe(
      screen.getByTestId("first").closest(".c__app"),
    );
  });

  it("shows the progress next to the message", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() => toast("Uploading", VariantType.INFO, { progress: 45 })}
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await screen.findByRole("alert");
    expect(toast).toHaveTextContent("45%");
  });

  it("renders actions given as a list of descriptors", async () => {
    let clicked = false;
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Document moved", VariantType.INFO, {
              actions: [
                { label: "Undo", onClick: () => (clicked = true) },
                { label: "See", onClick: () => {} },
              ],
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await screen.findByRole("alert");
    within(toast).getByRole("button", { name: "See" });

    await user.click(within(toast).getByRole("button", { name: "Undo" }));
    expect(clicked).toBe(true);
  });

  it("dismisses a toast through the id returned by toast()", async () => {
    const Inner = () => {
      const { toast, dismissToast } = useToastProvider();
      const id = useRef<ToastId>(null);
      return (
        <>
          <Button
            onClick={() => {
              id.current = toast("Stays until dismissed", VariantType.NEUTRAL, {
                disableAnimate: true,
              });
            }}
          >
            Create toast
          </Button>
          <Button onClick={() => dismissToast(id.current!)}>Dismiss</Button>
        </>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await screen.findByRole("alert");
    expect(toast).toHaveTextContent("Stays until dismissed");

    await user.click(screen.getByText("Dismiss"));
    await waitForElementToBeRemoved(toast);
  });

  it("lists the items of an extended toast", async () => {
    const Inner = () => {
      const { toastExtended } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toastExtended({
              summary: "2 documents in transfer",
              progress: 15,
              items: [
                { id: "1", title: "Report", size: "2 MB", status: "completed" },
                { id: "2", title: "Picture", status: "loading" },
              ],
            })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await screen.findByRole("alert");
    expect(within(toast).getAllByRole("listitem")).toHaveLength(2);
    expect(toast).toHaveTextContent("2 documents in transfer");
    expect(toast).toHaveTextContent("15%");
  });
});
