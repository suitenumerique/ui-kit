import { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

  // An update has to go through the kit's content model: react-toastify's own
  // options would leave the rendered `<Toast>` with the props it was raised
  // with, so the change would never show up.
  it("updates the message, the variant and the progress of a live toast", async () => {
    const Inner = () => {
      const { toast, updateToast } = useToastProvider();
      const id = useRef<ToastId>(undefined);
      return (
        <>
          <Button
            onClick={() => {
              id.current = toast("Uploading", VariantType.INFO, {
                progress: 15,
                disableAnimate: true,
              });
            }}
          >
            Create toast
          </Button>
          <Button
            onClick={() =>
              updateToast(id.current!, {
                message: "Uploaded",
                type: VariantType.SUCCESS,
                progress: 100,
              })
            }
          >
            Update toast
          </Button>
        </>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));

    const toast = await screen.findByRole("alert");
    expect(toast).toHaveTextContent("Uploading");
    expect(toast).toHaveTextContent("15%");
    expect(toast).toHaveClass("c__toast", "c__toast--info");

    await user.click(screen.getByText("Update toast"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Uploaded"),
    );
    const updated = screen.getByRole("alert");
    expect(updated).toHaveTextContent("100%");
    // The kit wrapper survives the update, restyled for the new variant.
    expect(updated).toHaveClass("c__toast", "c__toast--success");
    expect(updated).not.toHaveClass("c__toast--info");
  });

  it("keeps the untouched props when updating only one of them", async () => {
    const Inner = () => {
      const { toast, updateToast } = useToastProvider();
      const id = useRef<ToastId>(undefined);
      return (
        <>
          <Button
            onClick={() => {
              id.current = toast("Uploading", VariantType.INFO, {
                progress: 15,
                primaryLabel: "Retry",
                disableAnimate: true,
              });
            }}
          >
            Create toast
          </Button>
          <Button onClick={() => updateToast(id.current!, { progress: 60 })}>
            Update toast
          </Button>
        </>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));
    await screen.findByRole("alert");
    await user.click(screen.getByText("Update toast"));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("60%"),
    );
    const updated = screen.getByRole("alert");
    expect(updated).toHaveTextContent("Uploading");
    expect(updated).toHaveClass("c__toast--info");
    expect(
      within(updated).getByRole("button", { name: "Retry" }),
    ).toBeInTheDocument();
  });

  it("renders a single alert element per toast", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button
          onClick={() =>
            toast("Only one", VariantType.INFO, { disableAnimate: true })
          }
        >
          Create toast
        </Button>
      );
    };

    render(<Inner />, { wrapper: CunninghamProvider });
    await userEvent.setup().click(screen.getByText("Create toast"));

    await screen.findByRole("alert");
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it("sits on the right and slides in from that side", async () => {
    const Inner = () => {
      const { toast } = useToastProvider();
      return (
        <Button onClick={() => toast("Hello", VariantType.INFO)}>
          Create toast
        </Button>
      );
    };

    render(
      <CunninghamProvider toastPosition="bottom-right">
        <Inner />
      </CunninghamProvider>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Create toast"));
    await screen.findByRole("alert");

    expect(
      document.querySelector(".Toastify__toast-container--bottom-right"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".c__toast__container--slide-right"),
    ).toBeInTheDocument();
  });
});
