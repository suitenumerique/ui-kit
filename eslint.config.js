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
