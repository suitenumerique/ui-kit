import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import IconLink from "./assets/external-link.svg";
import LogoGouv from ":/assets/logo-gouv.svg";

type Link = {
  label: string;
  href: string;
};

export type FooterProps = {
  externalLinks?: readonly Link[];
  legalLinks?: readonly Link[];
  license?: {
    label: string;
    link: Link;
  };
  logo?: {
    src: string;
    width?: string;
    height?: string;
    alt: string;
  };
};

export const Footer = ({
  externalLinks,
  legalLinks,
  license,
  logo,
}: FooterProps) => {
  const { t } = useCunningham();
  return (
    <footer className="c__footer">
      <div className="c__footer__stripe" />
      <div className="c__footer__content">
        <div className="c__footer__content__top">
          <div>
            <div className="c__footer__content__top__logo">
              <img
                className="c__footer__logo"
                alt={logo?.alt || t("components.footer.logo.alt")}
                width={logo?.width}
                height={logo?.height}
                decoding="async"
                src={logo?.src || LogoGouv}
              />
            </div>
          </div>
          <div className="c__footer__content__top__links">
            {externalLinks?.map(({ label, href }) => (
              <a key={label} href={href} target="_blank">
                <span>{label}</span>
                <img alt="" width="18" decoding="async" src={IconLink} />
              </a>
            ))}
          </div>
        </div>
        <div className="c__footer__content__middle">
          {legalLinks?.map(({ label, href }) => (
            <a key={label} href={href}>
              <span>{label}</span>
            </a>
          ))}
        </div>
        {license && (
          <p className="c__footer__content__mention">
            {license?.label}{" "}
            <a href={license?.link.href} target="_blank">
              <span>{license?.link.label}</span>
              <img alt="" width="18" decoding="async" src={IconLink} />
            </a>
          </p>
        )}
      </div>
    </footer>
  );
};
