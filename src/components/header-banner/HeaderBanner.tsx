import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";
import { HeaderBannerVariant } from "./types";
import { Button, ButtonProps, useCunningham } from "@gouvfr-lasuite/cunningham-react";
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
 * It flows in the normal document order (it is not sticky nor fixed): place it
 * as the first element of your layout to keep it pinned above the content.
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
      {...props}
    >
      <p className="c__header-banner__label">{label}</p>
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
}: HeaderBannerCTAProps & {
    color: HeaderBannerVariant;
    }) => {
    const { isMobile: iconOnly } = useResponsive();
    return (
        <Button
            type="button"
            size="nano"
            color={color}
            href={href}
            icon={icon ?? (href ? <ExternalLink size="small" /> : undefined)}
            // When collapsed to its icon, the visible label disappears, so expose it as
            // the button's accessible name and as a hover tooltip instead.
            aria-label={iconOnly ? label : undefined}
            title={iconOnly ? label : undefined}
            {...props}
        >
            {iconOnly ? undefined : label}
        </Button>
    )
};

export default HeaderBanner;
