# `@gouvfr-lasuite/ui-tokens`

The Cunningham design-token engine, now maintained in the La Suite numérique UI
monorepo. Existing runtime conventions remain stable:

- the binary is still named `cunningham`;
- generated files are still named `cunningham-tokens.*`;
- generated CSS custom properties still use the `--c--` prefix;
- `buildRefs`, `getThemesFromGlobals` and the default tokens remain public.

## CLI

```bash
yarn add --dev @gouvfr-lasuite/ui-tokens
cunningham -g css,scss,js,ts -o src
```

The CLI reads `cunningham.ts`, `cunningham.js` or `cunningham.cjs` from the
working directory. The default CSS tokens are also available through:

```scss
@use "@gouvfr-lasuite/ui-tokens/default-tokens";
```

```ts
import {
  buildRefs,
  defaultTokenRefs,
  getThemesFromGlobals,
} from "@gouvfr-lasuite/ui-tokens";
```
