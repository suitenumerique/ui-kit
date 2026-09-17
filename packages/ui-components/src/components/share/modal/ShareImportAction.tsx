import { Button } from ":/cunningham";
import { DropdownMenu, useDropdownMenu } from ":/components/dropdown-menu";
import { IconSize } from ":/components/icon";
import { useCunningham } from ":/components/provider";
import { More } from ":/icons";

/** Renders the members header menu for opening the contact import dialog. */
export const ShareImportAction = ({ onOpen }: { onOpen: () => void }) => {
  const menu = useDropdownMenu();
  const { t } = useCunningham();

  return (
    <DropdownMenu
      options={[
        {
          label: t("components.share.import.title"),
          icon: <span className="material-icons">upload_file</span>,
          callback: onOpen,
        },
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
        aria-label={t("components.share.import.title")}
      />
    </DropdownMenu>
  );
};
