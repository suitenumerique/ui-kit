import IconLink from "./assets/external-link.svg";
import LogoGouv from ":/assets/logo-gouv.svg";

type FooterProps = {
  externalLinks?: {
    label: string;
    href: string;
  }[];
  legalLinks?: {
    label: string;
    href: string;
  }[];
  license?: {
    label: string;
    link: {
      label: string;
      href: string;
    };
  };
  logo?: {
    src: string;
    width?: string;
    height?: string;
    alt: string;
  };
}
// Improvements:
// - Customize all links
export const Footer = ({
  externalLinks,
  legalLinks,
  license,
  logo,
}: FooterProps) => {
  return (
    <footer className="c__footer">
      <div className="c__footer__stripe" />
      <div className="c__footer__content">
        <div className="c__footer__content__top">
          <div>
            <div className="c__footer__content__top__logo">
              <img
                className="c__footer__logo"
                alt={logo?.alt}
                width={logo?.width}
                height={logo?.height}
                decoding="async"
                data-nimg="1"
                src={logo?.src || LogoGouv}
              />
            </div>
          </div>
          <div className="c__footer__content__top__links">
            {externalLinks?.map(({ label, href }) => (
              <a key={label} href={href} target="_blank">
                <span>{label}</span>
                <img
                  alt=""
                  width="18"
                  decoding="async"
                  data-nimg="1"
                  src={IconLink}
                />
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
        <p className="c__footer__content__mention">
          {license?.label}{" "}
          <a
            href={license?.link.href}
            target="__blank"
          >
            <span>{license?.link.label}</span>
            <img
              alt=""
              width="18"
              decoding="async"
              data-nimg="1"
              src={IconLink}
            />
          </a>
        </p>
      </div>
    </footer>
  );
};
