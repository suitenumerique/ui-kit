// ---------------------------------------------------------------------------
// Checks that every locale file exposes the same keys as the reference locale.
//
// Any divergence, whatever the locale, exits with a non zero code and fails
// the `check-locales` CI job. `src/types/translations.type-check.ts` enforces
// the same rule at compile time for `fr-FR` only, so this script is what
// covers the other locales, and what reports the offending keys one by one,
// which a TS error cannot do.
//
// Run it with:
//      yarn check-locales
// ---------------------------------------------------------------------------

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Locale all the others are compared to. */
const REFERENCE_LOCALE = "en-US";

const LOCALES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/locales",
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationObject = Record<string, TranslationValue>;

interface LocaleReport {
  locale: string;
  missing: string[];
  extra: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flattens a translation object into its dot notation keys. */
const extractKeys = (
  translations: TranslationObject,
  prefix = "",
): Set<string> => {
  const keys = new Set<string>();

  for (const [key, value] of Object.entries(translations)) {
    const dottedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      extractKeys(value, dottedKey).forEach((nestedKey) => keys.add(nestedKey));
    } else {
      keys.add(dottedKey);
    }
  }

  return keys;
};

const readLocale = (locale: string): TranslationObject =>
  JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), "utf-8"),
  ) as TranslationObject;

const listLocales = (): string[] =>
  fs
    .readdirSync(LOCALES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"))
    .filter((locale) => locale !== REFERENCE_LOCALE)
    .sort();

/**
 * ANSI red, honouring the https://no-color.org convention so a log
 * redirected to a file stays readable.
 */
const colorize = (text: string) =>
  process.env.NO_COLOR ? text : `\x1b[31m${text}\x1b[0m`;

/**
 * Prints a report. GitHub Actions annotations are used when available so the
 * offending file is pointed at directly in the pull request.
 */
const print = (report: LocaleReport) => {
  const details = [
    ...report.missing.map((key) => `missing: ${key}`),
    ...report.extra.map((key) => `unknown: ${key}`),
  ];
  const title = `${colorize("error")} ${report.locale} is not aligned with ${REFERENCE_LOCALE} (${details.length} key(s))`;

  if (process.env.GITHUB_ACTIONS) {
    console.log(
      `::error file=src/locales/${report.locale}.json,title=${report.locale} translations::${details.join(", ")}`,
    );
  }

  console.log([title, ...details.map((detail) => `  - ${detail}`)].join("\n"));
};

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

const referenceKeys = extractKeys(readLocale(REFERENCE_LOCALE));

const reports: LocaleReport[] = listLocales()
  .map((locale) => {
    const keys = extractKeys(readLocale(locale));

    return {
      locale,
      missing: [...referenceKeys].filter((key) => !keys.has(key)).sort(),
      extra: [...keys].filter((key) => !referenceKeys.has(key)).sort(),
    };
  })
  .filter((report) => report.missing.length > 0 || report.extra.length > 0);

reports.forEach(print);

if (reports.length > 0) {
  console.log(
    colorize(
      `\nEvery locale must expose exactly the same keys as ${REFERENCE_LOCALE}. Fix the translations above.`,
    ),
  );
  process.exit(1);
}

console.log(`All locales are aligned with ${REFERENCE_LOCALE}.`);
