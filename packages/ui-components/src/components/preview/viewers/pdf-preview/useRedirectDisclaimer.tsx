import { useCallback } from "react";
import { useModals } from "@gouvfr-lasuite/cunningham-react";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";

const SAFE_PROTOCOLS = ["https:", "http:"];

export const useRedirectDisclaimer = () => {
  const modals = useModals();
  const { t } = useCustomTranslations();
  const handlePdfClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        if (anchor.closest("[data-internal-link]")) return;

        e.preventDefault();
        e.stopPropagation();

        try {
          const url = new URL(anchor.href);
          if (!SAFE_PROTOCOLS.includes(url.protocol)) return;
        } catch {
          return;
        }

        modals.confirmationModal({
          title: t("components.filePreview.externalLink.title"),
          children: (
            <div>
              <p>{t("components.filePreview.externalLink.description")}</p>
              <span className="pdf-preview__external-link">{anchor.href}</span>
              <p>{t("components.filePreview.externalLink.confirmQuestion")}</p>
            </div>
          ),
          onDecide: (decision) => {
            if (decision === "yes") {
              window.open(anchor.href, "_blank", "noopener,noreferrer");
            }
          },
        });
      }
    },
    [modals, t],
  );
  return { handlePdfClick };
};
