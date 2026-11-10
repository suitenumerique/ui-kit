# Guide de relecture : refactor du DropdownMenu

> ⚠️ **Fichier temporaire.** Il sert uniquement à expliquer ce refactor aux
> relecteurs de la PR. Il sera supprimé avant le merge et ne doit pas
> arriver sur `main`.

## En bref

L'ancien `DropdownMenu` enveloppait son déclencheur dans une `div`, comptait
sur chaque application pour ouvrir et fermer le menu avec un `onClick`, et
exposait les éléments cochés comme de simples `menuitem`. Un lecteur d'écran
ne savait ni que le bouton ouvrait un menu, ni quel élément était
sélectionné, et chaque application réécrivait l'état d'ouverture.

Le `DropdownMenu` est reconstruit sur le
[pattern « menu button » de React Aria](https://react-spectrum.adobe.com/react-aria/Menu.html).
Son API publique garde ses noms (`options`, les types, `useDropdownMenu`),
et le `ContextMenu` utilise désormais le même rendu.

C'est un changement **majeur** de `@gouvfr-lasuite/ui-components`. Côté
application, ce qui change surtout :

- `children` est le déclencheur lui-même : un seul élément focusable qui
  transmet sa `ref` et ses props (`Button`, `<button>`…), sans `div` autour ;
- le menu s'ouvre tout seul : le `onClick` qui basculait l'état n'est plus
  nécessaire (`isOpen` / `onOpenChange` restent disponibles pour piloter le
  menu) ;
- les éléments avec une `value` ou un `isChecked` deviennent des
  `menuitemradio` (ou `menuitemcheckbox`) avec `aria-checked` ;
- les classes des lignes changent (`__content`, `__description`).

Le détail est dans `docs/MIGRATION.md` (section « DropdownMenu and menus »)
et dans le changeset `.changeset/brave-menus-open.md`.

## La logique

```
options ──► buildMenuModel ──► renderMenuLevel ──► briques composables ──► React Aria
            (fonction pure,    (partagé avec        Root / Popover /        MenuTrigger
             testée)            ContextMenu)        Item / Section /        Popover, Menu
                                                    Separator / Submenu     MenuItem
```

Tout le code est dans `packages/ui-components/src/components/dropdown-menu/`.

### 1. `buildMenuModel.ts` : des `options` à un arbre

Une fonction pure, sans React, qui transforme le tableau `options` en arbre :

- elle retire les éléments masqués (`isHidden`), puis les séparateurs en
  début, en fin ou en double ;
- elle donne à chaque élément une clé unique (`id`, sinon `value`, sinon
  `label`, suffixée en cas de doublon) ;
- elle décide **où vit la sélection**. Un élément est sélectionnable s'il a
  une `value` ou un `isChecked`. Si tous les éléments le sont et qu'aucun
  séparateur ne les coupe, tout le menu forme un seul groupe. Sinon, chaque
  suite d'éléments sélectionnables devient sa propre `Section`, comme
  « Trier par » et « Ordre » dans un même menu : chaque groupe à choix
  unique garde ainsi un seul élément coché.

Elle est couverte par `buildMenuModel.spec.ts`.

### 2. `renderMenu.tsx` : de l'arbre aux composants

`renderMenuLevel` rend cet arbre avec les briques composables, sous-menus
compris. `DropdownMenu` et `ContextMenu` l'appellent tous les deux, ils ne
peuvent donc plus diverger.

`DropdownMenu.tsx` se contente d'assembler : `buildMenuModel` dans un
`useMemo`, puis `DropdownMenu.Root` avec le déclencheur et le résultat de
`renderMenuLevel`.

### 3. `DropdownMenuRoot.tsx` : brancher n'importe quel déclencheur

Il enveloppe le `MenuTrigger` de React Aria. Le premier enfant est le
déclencheur : il reçoit `aria-haspopup`, `aria-expanded`, les handlers de
pression et une `ref`.

- Les composants qui consomment déjà le contexte de pression de React Aria
  (`Button`, `Link`, `ToggleButton` de React Aria, `DropdownMenu.Trigger`)
  sont passés tels quels ; les autres sont enveloppés dans `Pressable`.
- Il regarde à travers un `Tooltip` qui envelopperait le déclencheur.
- Il ajoute `type="button"` à un bouton qui n'en a pas, pour qu'un menu
  dans un formulaire ne le soumette pas.
- Un déclencheur désactivé n'ouvre pas le menu : React Aria l'ouvrirait
  quand même au clavier (Entrée, flèches) si le déclencheur reste focusable
  avec `aria-disabled`. S'il est désactivé pendant que le menu est ouvert,
  le menu se ferme.
- L'état d'ouverture est toujours contrôlé en interne, même sans `isOpen` :
  basculer `MenuTrigger` en mode contrôlé seulement quand le déclencheur est
  désactivé ferait revenir son ancien état, et le menu, à la réactivation.

### 4. `DropdownMenuPopover.tsx` : la surface du menu

Un `Popover` de React Aria qui contient un `Menu`. C'est le fichier le plus
dense, avec plusieurs choix à regarder de près :

- **Propagation des événements.** Le popover est rendu dans un portail, mais
  React fait remonter ses événements le long de l'arbre des composants. Sans
  le `stopPropagation`, les flèches ou les clics dans le menu atteindraient
  les ancêtres du déclencheur (une ligne cliquable, une liste navigable au
  clavier). Échap continue de remonter pour que le popover se ferme. Les
  événements `pointerdown` et `mousedown` sont aussi arrêtés : React Aria
  termine la pression du déclencheur sur un écouteur du document, et sans
  cela le menu se rouvrait au survol suivant du déclencheur.
- **Tab ferme le menu**, tous niveaux compris, comme le demande le pattern
  WAI-ARIA, au lieu du piège à focus de React Aria. Le focus revient alors au
  déclencheur.
- **Hors d'un `MenuTrigger`** (le `ContextMenu`, ouvert à la position du
  pointeur), rien ne fermerait le menu au choix d'un élément ou à Tab, et
  rien ne lui donnerait le focus. Le popover fournit donc lui-même l'état de
  menu racine, piloté par `isOpen` / `onOpenChange`, et donne le focus au
  menu.
- Les **sous-menus** héritent de la variante `tiny` par un contexte.
- `topMessage` et `bottomMessage` sont reliés au menu par
  `aria-describedby`.

### 5. `MenuItemBody` : le contenu d'une ligne

Partagé par `DropdownMenu`, `ContextMenu`, `Filter` et `SearchFilter`. Il
place le libellé, la description et le raccourci dans les « slots » texte de
React Aria : l'élément est **nommé par son seul libellé** et **décrit** par
le reste. Les icônes sont décoratives (`aria-hidden`) ; l'état coché passe
par le rôle de l'élément, pas par l'icône.

React Aria lève une erreur sur le slot `label` dans les composants qui ne le
définissent pas (champs de formulaire, `GridList`, `Tree`, `Table`…), d'où
l'échappatoire `withSlots={false}`.

### Les briques composables

`DropdownMenu.Root`, `.Popover`, `.Item`, `.Section`, `.Separator`,
`.Submenu`, et `.Trigger` (un déclencheur sans style pour un contenu
libre, comme un avatar). Elles couvrent ce que le tableau `options` ne
sait pas décrire, et ce sont elles que `renderMenuLevel` utilise.

## Comment le refactor a été construit

1. **Les prérequis d'abord**, dans des commits séparés : le `Tooltip`
   transmet ses props et sa `ref` (pour pouvoir envelopper un déclencheur),
   le `Button` affiche son anneau de focus à partir de `data-focus-visible`
   de React Aria (l'anneau réapparaît quand le focus revient d'un menu au
   clavier), et un helper axe-core pour les tests e2e.
2. **Les tokens et le style** : de nouveaux tokens de composant
   `dropdown-menu`, puis le nouveau style des menus. Les fichiers
   `cunningham-tokens.*` sont générés par `yarn build-theme` : inutile de les
   relire ligne par ligne.
3. **Le cœur**, en trois temps : le modèle (`buildMenuModel`), les briques
   composables, puis le `DropdownMenu` reconstruit par-dessus.
4. **Les menus du kit lui-même** passent sur la nouvelle API : menu d'aide,
   sélecteur de langue, formulaire de retour, prévisualisation de fichier,
   menus de la modale de partage. Ils perdent leur `onClick` qui basculait
   l'état. Dans les réglages du lien de partage, « Jamais » et les durées
   d'expiration forment désormais un seul groupe de boutons radio.
5. **Le `ContextMenu`** passe sur le rendu partagé.
6. **Les tests** : tests unitaires (Vitest) du modèle et de `MenuItemBody`,
   et tests de composants Playwright pour le déclencheur, le clavier, la
   sélection, les options, la compatibilité avec l'ancienne API, et un audit
   axe-core et de l'arbre d'accessibilité.
7. **La documentation** : page MDX dans Storybook, stories réécrites, guide
   de migration et changeset.
8. **Le codemod** : la commande `ui-codemod dropdown-menu [chemin]` liste,
   avec le fichier et la ligne, ce qu'une application doit reprendre à la
   main. Elle ne modifie aucun fichier et sort en erreur (code 1) quand elle
   trouve du code qui casse, pour pouvoir tourner en CI. `migrate` cible
   maintenant `ui-components@^2.0.0`.

## Ordre de lecture conseillé

Les commits sont atomiques et se lisent dans l'ordre de la branche :

| Commits | Contenu | Où regarder |
| --- | --- | --- |
| `✨(tooltip)`, `💄(button)`, `✅(e2e)` | Prérequis | Petits, rapides |
| `✨(dropdown-menu) add the dropdown-menu component tokens`, `💄(dropdown-menu) restyle…` | Tokens et style | Survoler les fichiers générés |
| `♻️(menu) name menu rows…` | Slots de `MenuItemBody` | `withSlots` |
| `✨(dropdown-menu) build the menu tree…` | `buildMenuModel` | **Cœur**, à lire avec son spec |
| `✨(dropdown-menu) add the composable menu parts`, `♻️(dropdown-menu) rebuild DropdownMenu…` | Briques, puis `DropdownMenu` | **Cœur** : `DropdownMenuRoot`, `DropdownMenuPopover` |
| `📝(dropdown-menu) rewrite the DropdownMenu stories` | Stories | À essayer dans Storybook |
| `♻️(components)`, `♻️(share)`, `🐛(share)` | Menus du kit | Suppression des `onClick` |
| `♻️(context-menu)` | `ContextMenu` sur le rendu partagé | |
| `✅(dropdown-menu)` ×3 | Tests | |
| `📝(dropdown-menu)` ×2 | Doc, migration, changeset | Formulation des changements cassants |
| `✨(codemod)`, `⬆️(codemod)` | Codemod | |

## Comment tester

- Storybook (`yarn storybook`) → **Components/DropdownMenu** : ouvrir les
  menus à la souris et au clavier (Entrée, Espace, ↓, ↑), naviguer aux
  flèches, fermer avec Échap et Tab, écouter les éléments radio et case à
  cocher avec un lecteur d'écran.
- Storybook → **Components/ContextMenu** : clic droit, puis les mêmes
  touches.
- Dans une application : `npx @gouvfr-lasuite/ui-codemod dropdown-menu .`
- Tests : `yarn test` (unitaires) et `yarn test:ct` dans
  `packages/ui-components` (Playwright, dossiers `e2e/dropdown-menu` et
  `e2e/context-menu`).
