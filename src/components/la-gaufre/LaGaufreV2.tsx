/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LogoLaSuite from ":/components/la-gaufre/assets/logo_la_suite.svg";
import { useEffect, useRef, memo, useMemo } from "react";
import {
  Button,
  ButtonElement,
  useCunningham,
} from "@gouvfr-lasuite/cunningham-react";
import { useResponsive } from ":/hooks/useResponsive";

export type Service = {
  name: string;
  url: string;
  maturity?: string;
  logo?: string;
};

type Organization = {
  name: string;
  type: string;
  siret: string;
};

type ServicesResponse = {
  organization?: Organization;
  services: Service[];
  error?: unknown;
};

export type LaGaufreV2Props = {
  widgetPath: string;
  apiUrl: string;
  data?: ServicesResponse;
  fontFamily?: string;
  background?: string;
  headerLogo?: string;
  headerUrl?: string;
  label?: string;
  closeLabel?: string;
  headerLabel?: string;
  loadingText?: string;
  newWindowLabelSuffix?: string;
  showMoreLimit?: number;
  viewMoreLabel?: string;
  viewLessLabel?: string;
};
export const LaGaufreV2 = memo(
  ({ apiUrl, data, ...props }: LaGaufreV2Props) => {
    const { t } = useCunningham();
    const { isMobile } = useResponsive();
    const buttonRef = useRef<ButtonElement>(null);

    const widgetPath = useMemo(
      () =>
        props.widgetPath ||
        "https://static.suite.anct.gouv.fr/widgets/lagaufre.js",
      [props.widgetPath]
    );

    const defaultApiUrl = data?.services ? undefined : apiUrl;

    const label = props.label || t("components.laGaufre.label");
    const closeLabel = props.closeLabel || t("components.laGaufre.closeLabel");
    const loadingText =
      props.loadingText || t("components.laGaufre.loadingText");
    const newWindowLabelSuffix =
      props.newWindowLabelSuffix ||
      t("components.laGaufre.newWindowLabelSuffix");
    const background = props.background || "";
    const headerLabel =
      props.headerLabel || t("components.laGaufre.headerLabel");

    const viewMoreLabel =
      props.viewMoreLabel || t("components.laGaufre.viewMoreLabel");
    const viewLessLabel =
      props.viewLessLabel || t("components.laGaufre.viewLessLabel");

    useEffect(() => {
      (window as any)._lasuite_widget = (window as any)._lasuite_widget || [];
      // Supprime tous les éléments ayant l'id "lasuite-widget-lagaufre-shadow"
      const shadowNodes = document.querySelectorAll(
        "#lasuite-widget-lagaufre-shadow"
      );

      shadowNodes.forEach((node) => node.parentNode?.removeChild(node));
      (window as any)._lasuite_widget.push([
        "lagaufre",
        "init",
        {
          ...props,
          api: defaultApiUrl,
          label: label,
          data: data,
          closeLabel: closeLabel,
          background: background,
          showFooter: isMobile,
          headerLabel: headerLabel,
          headerLogo: LogoLaSuite,
          loadingText: loadingText,
          newWindowLabelSuffix: newWindowLabelSuffix,
          viewMoreLabel: viewMoreLabel,
          viewLessLabel: viewLessLabel,
          buttonElement: buttonRef.current,
          position: () => {
            return {
              position: "absolute",
              top:
                (buttonRef.current?.offsetTop ?? 0) +
                (buttonRef.current?.offsetHeight ?? 0) +
                10,
              right:
                window.innerWidth -
                (buttonRef.current?.offsetLeft ?? 0) -
                (buttonRef.current?.offsetWidth ?? 0),
            };
          },
        },
      ]);
    }, [
      viewMoreLabel,
      viewLessLabel,
      closeLabel,
      headerLabel,
      loadingText,
      defaultApiUrl,
      widgetPath,
    ]);

    // Must include the explicit fill color here because Firefox doesn't seem to apply the CSS style (!?)
    return (
      <>
        <script src={widgetPath} id="lasuite-gaufre-script" async />
        <div>
          <Button
            ref={buttonRef}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
              >
                <defs>
                  <path
                    id="a"
                    fill="var(--c--contextuals--background--semantic--brand--primary)"
                    d="M2.796.5c.469 0 .704 0 .892.064.351.12.627.397.748.748.064.188.064.423.064.892v.592c0 .469 0 .704-.064.892-.12.351-.397.627-.748.748-.188.064-.423.064-.892.064h-.592c-.469 0-.704 0-.892-.064a1.2 1.2 0 0 1-.748-.748C.5 3.5.5 3.265.5 2.796v-.592c0-.469 0-.704.064-.892.12-.351.397-.627.748-.748C1.5.5 1.735.5 2.204.5z"
                  />
                </defs>
                <use href="#a" />
                <use href="#a" transform="translate(6.5)" />
                <use href="#a" transform="translate(13)" />
                <use href="#a" transform="translate(0 6.5)" />
                <use href="#a" transform="translate(6.5 6.5)" />
                <use href="#a" transform="translate(13 6.5)" />
                <use href="#a" transform="translate(0 13)" />
                <use href="#a" transform="translate(6.5 13)" />
                <use href="#a" transform="translate(13 13)" />
              </svg>
            }
            aria-label={label}
            variant="tertiary"
            className="lagaufre-button"
          />
        </div>
      </>
    );
  }
);

LaGaufreV2.displayName = "LaGaufreV2";
