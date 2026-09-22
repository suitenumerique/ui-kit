import { Button } from ":/cunningham";
import { DropdownMenu, useDropdownMenu } from ":/components/dropdown-menu";
import { IconSize } from ":/components/icon";
import { useCunningham } from ":/components/provider";
import { Folder, FolderRestricted, More } from ":/icons";
import { useState } from "react";
import { ShareAccessConfirmationModal } from "./ShareAccessConfirmationModal";

/** Renders the members header menu and the restriction confirmation. */
export const ShareImportAction = ({
  onOpen,
  allowFileImport = true,
  canRestrict = false,
  isRestricted = false,
  onRestrict,
  onUnrestrict,
}: {
  onOpen: () => void;
  allowFileImport?: boolean;
  canRestrict?: boolean;
  isRestricted?: boolean;
  onRestrict?: () => void;
  onUnrestrict?: () => void;
}) => {
  const menu = useDropdownMenu();
  const [confirmationAction, setConfirmationAction] = useState<
    "restrict" | "unrestrict"
  >();
  const { t } = useCunningham();

  return (
    <>
      <DropdownMenu
        options={[
          ...(allowFileImport
            ? [
              {
                label: t("components.share.import.title"),
                icon: <span className="material-icons">upload_file</span>,
                callback: onOpen,
              },
            ]
            : []),
          ...(canRestrict
            ? isRestricted
              ? [
                  {
                    label: t("components.share.unrestrict.title"),
                    subText: t("components.share.unrestrict.description"),
                    icon: <Folder size={IconSize.SMALL} />,
                    value: "unrestrict",
                    callback: () => setConfirmationAction("unrestrict"),
                  },
                ]
              : [
                  {
                    label: t("components.share.restrict.title"),
                    subText: t("components.share.restrict.description"),
                    icon: <FolderRestricted size={IconSize.SMALL} />,
                    value: "restrict",
                    callback: () => setConfirmationAction("restrict"),
                  },
                ]
            : []),
        ]}
        isOpen={menu.isOpen}
        onOpenChange={menu.setIsOpen}
      >
        <Button
          variant="tertiary"
          color="neutral"
          size="small"
          icon={<More size={IconSize.SMALL} />}
          onClick={() => menu.setIsOpen(!menu.isOpen)}
          aria-label={t(
            allowFileImport
              ? "components.share.import.title"
              : isRestricted
                ? "components.share.unrestrict.title"
                : "components.share.restrict.title",
          )}
        />
      </DropdownMenu>
      {confirmationAction && canRestrict && (
        <ShareAccessConfirmationModal
          action={confirmationAction}
          onClose={() => setConfirmationAction(undefined)}
          onConfirm={
            confirmationAction === "restrict" ? onRestrict : onUnrestrict
          }
        />
      )}
    </>
  );
};
