import IconLink from "./assets/external-link.svg";
import LogoGouv from ":/assets/logo-gouv.svg";
import { useCunningham } from "@openfun/cunningham-react";

// Improvements:
// - Customize all links
export const Footer = () => {
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
                alt=""
                width="0"
                height="0"
                decoding="async"
                data-nimg="1"
                src={LogoGouv}
              />
            </div>
          </div>
          <div className="c__footer__content__top__links">
            {[
              {
                label: "legifrance.gouv.fr",
                href: "https://legifrance.gouv.fr/",
              },
              {
                label: "info.gouv.fr",
                href: "https://info.gouv.fr/",
              },
              {
                label: "service-public.fr",
                href: "https://service-public.fr/",
              },
              {
                label: "data.gouv.fr",
                href: "https://data.gouv.fr/",
              },
            ].map(({ label, href }) => (
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
          {[
            {
              label: t("components.footer.links.legal"),
              href: "/legal-notice",
            },
            {
              label: t("components.footer.links.personal_data"),
              href: "/personal-data-cookies",
            },
            {
              label: t("components.footer.links.accessibility"),
              href: "/accessibility",
            },
          ].map(({ label, href }) => (
            <a key={label} href={href}>
              <span>{label}</span>
            </a>
          ))}
        </div>
        <p className="c__footer__content__mention">
          {t("components.footer.mention")}{" "}
          <a
            href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
            target="__blank"
          >
            <span>{t("components.footer.license")}</span>
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
