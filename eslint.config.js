import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/storybook-static/**",
      "**/playwright/.cache/**",
      "**/test-results/**",
      "packages/ui-components/public/pdf.worker.mjs",
      "packages/ui-components/src/cunningham-tokens.{js,ts}",
      "packages/ui-tokens/src/bin/tests/assets/**",
      "packages/ui-tokens/src/bin/ThemeColors/**",
      "packages/ui-tokens/src/lib/cunningham-tokens.ts",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["packages/ui-tokens/**/*.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
    },
  },
  {
    files: ["packages/ui-components/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // The calendar and date picker hooks exchange per-render state through a
    // WeakMap held in the module scope of @react-aria/calendar. Importing one
    // of them through the react-aria umbrella instead resolves to a second
    // copy in any consumer whose tree carries one, and the cell then reads a
    // map the grid never wrote to. Types are erased, so they stay allowed.
    files: [
      "packages/ui-components/src/components/calendar/**/*.{ts,tsx}",
      "packages/ui-components/src/components/forms/date-picker/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-aria",
              importNames: [
                "useCalendar",
                "useCalendarCell",
                "useCalendarGrid",
                "useRangeCalendar",
                "useDateField",
                "useDatePicker",
                "useDateRangePicker",
              ],
              message:
                "Import calendar and date picker hooks from @react-aria/calendar or @react-aria/datepicker so every hook resolves to one copy.",
            },
            {
              name: "react-stately",
              importNames: [
                "useCalendarState",
                "useRangeCalendarState",
                "useDateFieldState",
                "useDatePickerState",
                "useDateRangePickerState",
              ],
              message:
                "Import calendar and date picker state from @react-stately/calendar or @react-stately/datepicker so every hook resolves to one copy.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "packages/ui-components/**/*.stories.{ts,tsx}",
      "packages/ui-components/**/*.spec.{ts,tsx}",
      "packages/ui-components/**/*.test.{ts,tsx}",
    ],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
);
