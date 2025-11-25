import { Button, ButtonProps } from "@openfun/cunningham-react";
import { useEffect, useMemo, useState } from "react";
import {
  useDropdownMenu,
  DropdownMenu,
  DropdownMenuOption,
} from ":/components/dropdown-menu";
import { Icon, IconSize } from ":/components/icon";

export type LanguagesOption = DropdownMenuOption & {
  shortLabel?: string;
};

export type LanguagePickerProps = {
  languages: LanguagesOption[];
  onChange?: (language: string) => void;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  fullWidth?: ButtonProps["fullWidth"];
  compact?: boolean;
};

/**
 * A DropdownMenu specific to languages.
 *
 * **Props:**
 * - `languages`: The languages options (use `isChecked` attribute to set the default selected language).
 * - `onChange`: A callback called when a language is selected.
 * - `size`: The size of the CTA.
 * - `color`: The color of the CTA.
 */
export const LanguagePicker = ({
  languages,
  onChange,
  size,
  color = "brand",
  variant = "tertiary",
  fullWidth,
  compact: lightMode = false,
}: LanguagePickerProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();
  const getInitialLanguage = () => {
    const selectedLanguage = languages.find((lang) => lang.isChecked);
    return selectedLanguage?.value ?? languages[0].value!;
  };
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(getInitialLanguage);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onChange?.(value);
  };

  const iconSize = useMemo((): IconSize | undefined => {
    if (!size) return undefined;
    switch (size) {
      case "nano":
        return IconSize.X_SMALL;
      case "small":
        return IconSize.SMALL;
      case "medium":
        return IconSize.MEDIUM;
    }
  }, [size]);

  /**
   * Effect to update the selected language when the `languages` prop changes.
   */
  useEffect(() => {
    setSelectedLanguage(getInitialLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  const selectedLanguageOption = useMemo(() => {
    const lang = languages.find((lang) => lang.value === selectedLanguage);
    return lang?.shortLabel ?? lang?.label;
  }, [languages, selectedLanguage]);

  return (
    <DropdownMenu
      options={languages}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelectValue={handleLanguageChange}
      selectedValues={[selectedLanguage]}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="c__language-picker"
        icon={<Icon name={isOpen ? "arrow_drop_up" : "arrow_drop_down"} />}
        iconPosition="right"
        size={size}
        color={lightMode ? "neutral" : color}
        variant={variant}
        fullWidth={fullWidth}
      >
        {!lightMode ? <Icon name="translate" size={iconSize} /> : null}
        <span className="c__language-picker__label">
          {selectedLanguageOption}
        </span>
      </Button>
    </DropdownMenu>
  );
};
