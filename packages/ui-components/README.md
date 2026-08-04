# `@gouvfr-lasuite/ui-components`

The unified React component library for La Suite numérique. It contains all
components previously published by UI Kit and Cunningham, with a single
enhanced `CunninghamProvider` that includes the UI Kit locales.

## Install

```bash
yarn add @gouvfr-lasuite/ui-components @tanstack/react-query
```

React 19, React DOM 19 and TanStack React Query 5 are peer dependencies.
`ui-tokens` is installed transitively. Add it explicitly as a development
dependency only when generating an application-specific theme.

```tsx
import "@gouvfr-lasuite/ui-components/style";
import "@gouvfr-lasuite/ui-components/fonts/roboto";
import "@gouvfr-lasuite/ui-components/fonts/marianne";
import "@gouvfr-lasuite/ui-components/fonts/material-icons";

import {
  Button,
  CunninghamProvider,
  MainLayout,
} from "@gouvfr-lasuite/ui-components";
import { ArrowRight } from "@gouvfr-lasuite/ui-components/icons";

export function App() {
  return (
    <CunninghamProvider>
      <MainLayout>
        <Button icon={<ArrowRight />}>Continue</Button>
      </MainLayout>
    </CunninghamProvider>
  );
}
```

## Public subpaths

| Subpath                | Content                                   |
| ---------------------- | ----------------------------------------- |
| `/style`               | Component styles and all generated themes |
| `/icons`               | Named React SVG components                |
| `/fonts/material-icons` | Material Icons font CSS                  |
| `/fonts/roboto`        | Roboto Flex CSS                           |
| `/fonts/marianne`      | Marianne CSS and bundled font files       |
| `/sass/fonts/*`        | Sass entries for Roboto and Material Icons |

The package root deliberately does not export named SVG icons. Import them from
`@gouvfr-lasuite/ui-components/icons` so icon bundles stay explicit.

## Custom themes

The default, dark, DSFR and ANCT themes are included in `/style`. Custom theme
generation is optional and uses the token package CLI:

```bash
yarn add --dev @gouvfr-lasuite/ui-tokens
cunningham -g css,scss,ts -o src --utility-classes
```
