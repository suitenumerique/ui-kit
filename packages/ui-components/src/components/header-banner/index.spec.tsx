import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderBanner } from ":/components/header-banner";
import { CunninghamProvider } from ":/components/provider";
import { ArrowSquarepath } from ":/icons";

describe("<HeaderBanner/>", () => {
  it("is exposed as a region landmark with a translated name", () => {
    render(
      <CunninghamProvider>
        <HeaderBanner label="Banner message" />
      </CunninghamProvider>,
    );

    expect(
      screen.getByRole("region", { name: "Announcement" }),
    ).toHaveTextContent("Banner message");
  });

  it("lets the consumer override the region name and role", () => {
    render(
      <CunninghamProvider>
        <HeaderBanner label="Maintenance" aria-label="Scheduled maintenance" />
        <HeaderBanner label="Outage" role="alert" />
      </CunninghamProvider>,
    );

    expect(
      screen.getByRole("region", { name: "Scheduled maintenance" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Outage");
  });

  it("renders a translated close button calling onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CunninghamProvider>
        <HeaderBanner label="Banner message" onClose={onClose} />
      </CunninghamProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders a link CTA named by its label, without button type nor title", () => {
    render(
      <CunninghamProvider>
        <HeaderBanner
          label="Banner message"
          ctaProps={{ label: "Read more", href: "https://example.com" }}
        />
      </CunninghamProvider>,
    );

    const link = screen.getByRole("link", { name: "Read more" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).not.toHaveClass("c__button--icon-only");
    expect(link).not.toHaveAttribute("type");
    expect(link).not.toHaveAttribute("title");
    expect(link).not.toHaveAttribute("aria-label");
  });

  it("announces that a link CTA opens in a new window", () => {
    render(
      <CunninghamProvider>
        <HeaderBanner
          label="Banner message"
          ctaProps={{
            label: "Read more",
            href: "https://example.com",
            target: "_blank",
          }}
        />
      </CunninghamProvider>,
    );

    expect(
      screen.getByRole("link", {
        name: "Read more (opens in a new window)",
      }),
    ).toBeInTheDocument();
  });

  it("renders a button CTA with type button", () => {
    render(
      <CunninghamProvider>
        <HeaderBanner
          label="Banner message"
          ctaProps={{
            label: "Reload",
            icon: <ArrowSquarepath size="small" />,
          }}
        />
      </CunninghamProvider>,
    );

    expect(screen.getByRole("button", { name: "Reload" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  describe("on mobile", () => {
    const initialInnerWidth = window.innerWidth;

    beforeEach(() => {
      window.innerWidth = 500;
    });

    afterEach(() => {
      window.innerWidth = initialInnerWidth;
    });

    it("collapses the CTA to its icon and exposes its label as accessible name", () => {
      render(
        <CunninghamProvider>
          <HeaderBanner
            label="Banner message"
            ctaProps={{ label: "Read more", href: "https://example.com" }}
          />
        </CunninghamProvider>,
      );

      const link = screen.getByRole("link", { name: "Read more" });
      expect(link).toHaveAttribute("aria-label", "Read more");
      expect(link).toHaveClass("c__button--icon-only");
      expect(link).not.toHaveAttribute("title");
    });

    it("announces that an icon-only link CTA opens in a new window", () => {
      render(
        <CunninghamProvider>
          <HeaderBanner
            label="Banner message"
            ctaProps={{
              label: "Read more",
              href: "https://example.com",
              target: "_blank",
            }}
          />
        </CunninghamProvider>,
      );

      expect(
        screen.getByRole("link", {
          name: "Read more (opens in a new window)",
        }),
      ).toHaveClass("c__button--icon-only");
    });
  });
});
