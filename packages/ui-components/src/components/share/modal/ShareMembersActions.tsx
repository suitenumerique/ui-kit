import { Button } from ":/cunningham";
import { DropdownMenu, useDropdownMenu } from ":/components/dropdown-menu";
import { IconSize } from ":/components/icon";
import { useCunningham } from ":/components/provider";
import { FileUp, Folder, FolderRestricted, More } from ":/icons";

export type ShareAccessAction = "restrict" | "unrestrict";

/** Renders the members header menu: contacts import and access restriction. */
export const ShareMembersActions = ({
  onOpenImport,
  isRestricted = false,
  onRequestAccessAction,
}: {
  /** Shows the import option when provided. */
  onOpenImport?: () => void;
  isRestricted?: boolean;
  /** Shows the restrict / open access option when provided. */
  onRequestAccessAction?: (action: ShareAccessAction) => void;
}) => {
  const menu = useDropdownMenu();
  const { t } = useCunningham();
  const accessAction: ShareAccessAction = isRestricted
    ? "unrestrict"
    : "restrict";

  return (
    <DropdownMenu
      options={[
        ...(onOpenImport
          ? [
              {
                label: t("components.share.import.title"),
                icon: <FileUp size={IconSize.SMALL} />,
                callback: onOpenImport,
              },
            ]
          : []),
        ...(onOpenImport && onRequestAccessAction
          ? [{ type: "separator" as const }]
          : []),
        ...(onRequestAccessAction
          ? [
              {
                label: t(`components.share.${accessAction}.title`),
                subText: t(`components.share.${accessAction}.description`),
                icon: isRestricted ? (
                  <Folder size={IconSize.SMALL} />
                ) : (
                  <FolderRestricted size={IconSize.SMALL} />
                ),
                value: accessAction,
                callback: () => onRequestAccessAction(accessAction),
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
        aria-label={t("components.share.actions.label")}
      />
    </DropdownMenu>
  );
};
