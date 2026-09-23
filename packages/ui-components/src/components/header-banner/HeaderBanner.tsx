import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";
import { HeaderBannerVariant } from "./types";
import { useCunningham } from ":/components/provider";
import { Button, ButtonProps } from ":/components/button";
import { ExternalLink, XMark } from ":/icons";
import { useResponsive } from ":/hooks/useResponsive";

type HeaderBannerCTAProps = { label: string } & Omit<
  ButtonProps,
  "size" | "variant" | "color"
>;

export type HeaderBannerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Message displayed in the banner.
   */
  label: ReactNode;
  /**
   * Visual color driving the background and text colors.
   */
  color?: HeaderBannerVariant;
  /**
   * Optional call to action displayed at the end of the banner. An icon is
   * mandatory: on small viewports the CTA collapses to its icon only and sits
   * just before the close button. For links (`href`) the icon defaults to an
   * external-link glyph.
   */
  ctaProps?:
    | (HeaderBannerCTAProps & { href: string })
    | (HeaderBannerCTAProps & { href?: undefined; icon: ReactNode });
  /**
   * Called when the close button is clicked. The close button is only rendered
   * when this callback is provided.
   */
  onClose?: () => void;
};

/**
 * Full width banner meant to be displayed at the very top of the screen.
 *
 * As it sits outside the page landmarks (header, main...), the banner is itself
 * exposed as a `region` landmark with a short translated name ("Announcement"),
 * so assistive technology users can reach it from the landmarks list. Pass
 * `aria-label` to give it a more specific name.
 */
export const HeaderBanner = ({
  label,
  color = "brand",
  ctaProps,
  onClose,
  className,
  ...props
}: HeaderBannerProps) => {
  const { t } = useCunningham();

  return (
    <div
      className={clsx("c__header-banner", `c__header-banner--${color}`, className)}
      role="region"
      aria-label={t("components.headerBanner.region")}
      {...props}
    >
      <div className="c__header-banner__label">{label}</div>
      {ctaProps && (
        <div className="c__header-banner__cta">
          <HeaderBannerCTA {...ctaProps} color={color} />
        </div>
      )}
      {onClose && (
        <Button
          type="button"
          size="nano"
          color={color}
          className="c__header-banner__close"
          icon={<XMark size="small" />}
          aria-label={t("components.headerBanner.close")}
          onClick={onClose}
        />
      )}
    </div>
  );
};

const HeaderBannerCTA = ({
  label,
  href,
  icon,
  color,
  ...props
}: HeaderBannerCTAProps & { color: HeaderBannerVariant }) => {
  const { t } = useCunningham();
  const { isMobile: iconOnly } = useResponsive();
  const newWindowLabel =
    props.target === "_blank"
      ? t("components.headerBanner.newWindow")
      : undefined;

  return (
    <Button
      type={href ? undefined : "button"}
      size="nano"
      color={color}
      href={href}
      icon={icon ?? (href ? <ExternalLink size="small" /> : undefined)}
      // When collapsed to its icon, expose label as the button's accessible name
      aria-label={
        iconOnly
          ? [label, newWindowLabel].filter(Boolean).join(" ")
          : undefined
      }
      {...props}
    >
      {iconOnly ? undefined : (
        <>
          {label}
          {newWindowLabel && (
            <span className="c__offscreen">{` ${newWindowLabel}`}</span>
          )}
        </>
      )}
    </Button>
  );
};

export default HeaderBanner;
