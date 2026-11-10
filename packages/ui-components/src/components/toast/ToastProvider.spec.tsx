import { useEffect, useRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { CunninghamProvider } from ":/components/provider";
import {
  ToastProvider,
  useToastProvider,
} from ":/components/toast/ToastProvider";
import { Button } from ":/components/button";
import { VariantType } from ":/utils/VariantUtils";
import { ToastId } from "./types";

// A provider toast has no live role, so it is found through its message.
const findToast = async (text: string) => {
  const message = await screen.findByText(text, { selector: ".c__toast *" });
  const toast = message.closest(".c__toast");
  if (!(toast instanceof HTMLElement)) {
    throw new Error(`toast "${text}" missing`);
  }
  return toast;
};

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

    const toast = await screen.findByText("first", { selector: ".c__toast *" });
    expect(toast.closest(".c__app")).toBe(
      screen.getByTestId("first").closest(".c__app"),
    );
  });

  // The root container is already mounted. A toast raised in the nested
  // page's mount effect must still land in the nested container.
  it("keeps a toast raised on mount inside a nested provider", async () => {
    const Page = () => {
      const { toast } = useToastProvider();
      useEffect(() => {
        toast("Saved", VariantType.INFO, { disableAnimate: true });
      }, [toast]);
      return null;
    };

    const App = () => {
      const [showNested, setShowNested] = useState(false);
      useEffect(() => {
        setShowNested(true);
      }, []);
      return (
        <CunninghamProvider>
          {showNested && (
            <ToastProvider containerId="nested">
              <Page />
            </ToastProvider>
          )}
        </CunninghamProvider>
      );
    };

    render(<App />);

    const toast = await findToast("Saved");
    expect(document.getElementById("nested")).toContainElement(toast);
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

    const toast = await findToast("Uploading");
    expect(toast).toHaveTextContent("45%");
    expect(toast.querySelector(".c__toast__progress")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
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

    const toast = await findToast("Document moved");
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

    const toast = await findToast("Uploading");
    expect(toast).toHaveTextContent("15%");
    expect(toast).toHaveClass("c__toast", "c__toast--info");

    await user.click(screen.getByText("Update toast"));

    const updated = await findToast("Uploaded");
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
    await findToast("Uploading");
    await user.click(screen.getByText("Update toast"));

    await waitFor(() => expect(screen.getByText("60%")).toBeInTheDocument());
    const updated = await findToast("Uploading");
    expect(updated).toHaveTextContent("60%");
    expect(updated).toHaveClass("c__toast--info");
    expect(
      within(updated).getByRole("button", { name: "Retry" }),
    ).toBeInTheDocument();
  });

  it("renders an info toast without a status or alert role", async () => {
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

    const toast = await findToast("Only one");
    expect(document.querySelectorAll(".c__toast")).toHaveLength(1);
    expect(toast).not.toHaveAttribute("role");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(document.querySelector(".Toastify")).toHaveAttribute(
      "aria-label",
      "Notifications Alt+T",
    );
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
    await findToast("Hello");

    expect(
      document.querySelector(".Toastify__toast-container--bottom-right"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".c__toast__container--slide-right"),
    ).toBeInTheDocument();
  });
});
