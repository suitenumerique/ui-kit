import { Meta, StoryObj } from "@storybook/react";
import React, { useEffect } from "react";
import { ProgressBar, Toast } from ":/components/toast/index";
import { CircleCheckFilled } from ":/components/icon/icons/CircleCheckFilled";
import { Button } from ":/components/button";
import { useToastProvider } from ":/components/toast/ToastProvider";
import { VariantType } from ":/utils/VariantUtils";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  args: {
    children: "Corrupti vestigium aiunt aeneus demulceo consequatur.",
    duration: 30000,
    disableAnimate: true,
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Demo: Story = {
  render: () => {
    const { toast } = useToastProvider();
    const TYPES = [
      VariantType.INFO,
      VariantType.SUCCESS,
      VariantType.WARNING,
      VariantType.ERROR,
      VariantType.NEUTRAL,
    ];

    useEffect(() => {
      toast("Adhuc civis creber super amita", VariantType.SUCCESS, {
        primaryLabel: "Read more",
        primaryOnClick: () => {
          // eslint-disable-next-line no-alert
          alert("Clicked here !");
        },
      });
    }, []);

    return (
      <div style={{ height: "300px" }}>
        <Button
          onClick={() => {
            const type = TYPES[Math.floor(Math.random() * TYPES.length)];
            toast("Adhuc civis creber super amita", type, {
              primaryLabel: "Primary",
              primaryOnClick: () => {
                // eslint-disable-next-line no-alert
                alert("Clicked here !");
              },
            });
          }}
        >
          Create toast!
        </Button>
      </div>
    );
  },
};

export const Info: Story = {
  args: {
    type: VariantType.INFO,
  },
};

export const InfoWithButton: Story = {
  args: {
    type: VariantType.INFO,
    primaryLabel: "Primary",
  },
};

export const InfoCustom: Story = {
  args: {
    type: VariantType.INFO,
    actions: (
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    type: VariantType.SUCCESS,
  },
};

export const Warning: Story = {
  args: {
    type: VariantType.WARNING,
  },
};

export const Error: Story = {
  args: {
    type: VariantType.ERROR,
  },
};

export const Neutral: Story = {
  args: {
    type: VariantType.NEUTRAL,
  },
};

export const CustomIcon: Story = {
  args: {
    type: VariantType.SUCCESS,
    icon: <CircleCheckFilled size={24} />,
    children: "Document uploaded",
  },
};

export const HiddenIcon: Story = {
  args: {
    type: VariantType.INFO,
    hideIcon: true,
    children: "Document 1 moved to Document 2",
  },
};

export const ProgressBarExample: Story = {
  render: () => {
    return (
      <div>
        <ProgressBar duration={6000} />
      </div>
    );
  },
};

export const WithProgress: Story = {
  render: () => {
    const { toast } = useToastProvider();
    return (
      <div style={{ height: "300px" }}>
        <Button
          onClick={() =>
            toast("Uploading document…", VariantType.INFO, {
              progress: 45,
              disableAnimate: true,
            })
          }
        >
          Create toast with progress
        </Button>
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const { toast, dismissToast } = useToastProvider();
    return (
      <div style={{ height: "300px" }}>
        <Button
          onClick={() => {
            const id = toast(
              "Document 1 moved to Document 2",
              VariantType.INFO,
              {
                progress: 15,
                disableAnimate: true,
                actions: [
                  {
                    label: "See",
                    onClick: () => alert("Navigate to document"),
                  },
                  { label: "Cancel", onClick: () => dismissToast(id) },
                ],
              },
            );
          }}
        >
          Create toast with actions
        </Button>
      </div>
    );
  },
};

export const Stacked: Story = {
  render: () => {
    const { toast } = useToastProvider();
    let count = 0;
    return (
      <div style={{ height: "300px" }}>
        <Button
          onClick={() => {
            count += 1;
            toast(`Document ${count} moved to Folder`, VariantType.SUCCESS);
          }}
        >
          Create toast (click several times)
        </Button>
      </div>
    );
  },
};

export const Extended: Story = {
  render: () => {
    const { toastExtended, dismissToast } = useToastProvider();
    return (
      <div style={{ height: "300px" }}>
        <Button
          onClick={() => {
            const id = toastExtended({
              summary: "3 documents in transfer",
              progress: 15,
              items: [
                {
                  id: "1",
                  title: "Presentation on Monet",
                  size: "12 GB",
                  mimetype: "application/vnd.ms-powerpoint",
                  status: "completed",
                },
                {
                  id: "2",
                  title: "Flower wallpaper – Uploading",
                  mimetype: "image/jpeg",
                  status: "loading",
                },
                {
                  id: "3",
                  title: "Seminar Logistics",
                  size: "2 MB",
                  mimetype: "application/pdf",
                  status: "completed",
                },
              ],
              onClose: () => dismissToast(id),
              onInfoClick: () => alert("More information"),
            });
          }}
        >
          Create extended toast
        </Button>
      </div>
    );
  },
};
