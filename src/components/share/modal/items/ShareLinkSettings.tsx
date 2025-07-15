import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import LogoPublic from ":/components/share/assets/public.svg";
import LogoPrivate from ":/components/share/assets/lock_person.svg";
import { Button, useCunningham } from "@openfun/cunningham-react";
import { useMemo, useState } from "react";
import { DropdownMenuOption } from ":/components/dropdown-menu";

const getIcon = (value: string | undefined) => {
  switch (value) {
    case "public":
      return <img src={LogoPublic} alt="" />;
    case "restricted":
      return <img src={LogoPrivate} alt="" />;
    default:
      return null;
  }
};

export const ShareLinkSettings = ({
  linkReachChoices = [],
  canUpdate,
  linkReach = "public",
  onUpdateLinkReach,
  showLinkRole = false,
  linkRoleChoices = [],
  linkRole = "reader",
  onUpdateLinkRole,
}: {
  canUpdate?: boolean;
  linkReachChoices?: Partial<DropdownMenuOption>[];
  linkReach?: string;
  onUpdateLinkReach: (value: string) => void;
  showLinkRole?: boolean;
  linkRoleChoices?: Partial<DropdownMenuOption>[];
  linkRole?: "reader" | "editor";
  onUpdateLinkRole: (value: string) => void;
}) => {
  const linkReachDropdown = useDropdownMenu();
  const linkRoleDropdown = useDropdownMenu();
  const [selectedLinkReachValues, setSelectedLinkReachValues] = useState<
    string[]
  >([linkReach]);
  const selectedLinkReach = selectedLinkReachValues[0];
  const [selectedLinkRoleValues, setSelectedLinkRoleValues] = useState<
    string[]
  >([linkRole]);
  const selectedLinkRole = selectedLinkRoleValues[0];
  const { t } = useCunningham();

  const reachChoices = useMemo(
    () =>
      linkReachChoices.map((choice) => {
        return {
          icon: choice.icon ?? getIcon(choice.value),
          value: choice.value,
          label: t(
            "components.share.linkSettings.reach.choices." +
              choice.value +
              ".title"
          ),
          ...choice,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkReachChoices]
  );
  const selectedLinkReachChoice = useMemo(
    () => reachChoices.find((choice) => choice.value === selectedLinkReach),
    [reachChoices, selectedLinkReach]
  );

  const roleChoices = useMemo(
    () =>
      linkRoleChoices.map((choice) => {
        return {
          value: choice.value,
          label: t(
            "components.share.linkSettings.role.choices." +
              choice.value +
              ".title"
          ),
          ...choice,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkRoleChoices]
  );
  const selectedLinkRoleChoice = useMemo(
    () => roleChoices.find((choice) => choice.value === selectedLinkRole),
    [roleChoices, selectedLinkRole]
  );

  const showLinkRoleEffectively = showLinkRole && linkRoleChoices.length > 0;

  const renderLinkReach = () => {
    return (
      <div className="c__share-modal__link-settings__content__select">
        {canUpdate ? (
          <DropdownMenu
            onSelectValue={(value) => {
              setSelectedLinkReachValues([value]);
              onUpdateLinkReach?.(value);
            }}
            options={reachChoices}
            isOpen={linkReachDropdown.isOpen}
            onOpenChange={linkReachDropdown.setIsOpen}
            selectedValues={selectedLinkReachValues}
          >
            <Button
              color="primary-text"
              icon={getIcon(selectedLinkReach)}
              iconPosition="left"
              onClick={() => {
                if (canUpdate) {
                  linkReachDropdown.setIsOpen(!linkReachDropdown.isOpen);
                }
              }}
            >
              {selectedLinkReachChoice?.label}
              <span className="material-icons">
                {linkReachDropdown.isOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </Button>
          </DropdownMenu>
        ) : (
          <span className="c__share-modal__link-settings__content__select__value">
            {getIcon(selectedLinkReach)}
            {selectedLinkReachChoice?.label}
          </span>
        )}
      </div>
    );
  };

  const renderLinkRole = () => {
    if (!showLinkRoleEffectively) {
      return null;
    }
    return (
      <div className="c__share-modal__link-settings__content__select-role">
        {canUpdate ? (
          <DropdownMenu
            onSelectValue={(value) => {
              setSelectedLinkRoleValues([value]);
              onUpdateLinkRole?.(value);
            }}
            options={roleChoices}
            isOpen={linkRoleDropdown.isOpen}
            onOpenChange={linkRoleDropdown.setIsOpen}
            selectedValues={selectedLinkRoleValues}
          >
            <Button
              color="primary-text"
              icon={
                <span className="material-icons">
                  {linkRoleDropdown.isOpen
                    ? "arrow_drop_up"
                    : "arrow_drop_down"}
                </span>
              }
              iconPosition="right"
              onClick={() => {
                if (canUpdate) {
                  linkRoleDropdown.setIsOpen(!linkRoleDropdown.isOpen);
                }
              }}
              size="small"
            >
              {selectedLinkRoleChoice?.label}
            </Button>
          </DropdownMenu>
        ) : (
          <span className="c__share-modal__link-settings__content__select-role__value">
            {getIcon(selectedLinkRole)}
            {selectedLinkRoleChoice?.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="c__share-modal__link-settings">
      <span className="c__share-modal__link-settings__title">
        {t("components.share.linkSettings.title")}
      </span>
      <div className="c__share-modal__link-settings__content">
        {renderLinkReach()}
        <div className="c__share-modal__link-settings__content__description desktop">
          {t(
            `components.share.linkSettings.reach.choices.${selectedLinkReach}.description`
          )}
        </div>
        {renderLinkRole()}
      </div>
      <div className="c__share-modal__link-settings__content__description mobile">
        {t(
          `components.share.linkSettings.reach.choices.${selectedLinkReach}.description`
        )}
      </div>
    </div>
  );
};
