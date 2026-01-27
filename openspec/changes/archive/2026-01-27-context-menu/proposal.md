## Why

Les applications de La Suite (notamment le drive/explorateur de fichiers) ont besoin de menus contextuels au clic droit pour offrir des actions rapides sur les éléments (fichiers, dossiers) et sur le fond de page. Actuellement, il n'existe pas de composant ContextMenu dans l'ui-kit, obligeant chaque application à implémenter sa propre solution.

## What Changes

- Ajout d'un nouveau composant `ContextMenuProvider` pour gérer l'état global et le rendu unique du menu
- Ajout d'un composant `ContextMenu` (wrapper) pour déclarer les zones cliquables et leurs menus associés
- Support du positionnement dynamique aux coordonnées du clic droit via virtual element
- Réutilisation du styling CSS existant de `dropdown-menu` pour la cohérence visuelle
- Support des menus statiques et dynamiques (fonction recevant un contexte typé)
- Pattern `asChild` pour éviter les éléments wrapper superflus
- Accessibilité via React Aria (Menu, Popover) : navigation clavier, focus management, fermeture Escape
- **Type partagé `MenuItem`** : unification des types entre `ContextMenu` et `DropdownMenu` pour permettre la réutilisation des mêmes définitions d'actions (ex: même menu pour le bouton "..." et le clic droit)
- **Ajout de `variant: "danger"`** au `DropdownMenu` pour la cohérence

## Capabilities

### New Capabilities

- `context-menu`: Composant de menu contextuel accessible au clic droit avec Provider pattern, support de menus imbriqués (le plus proche l'emporte), positionnement intelligent aux bords d'écran, et contenu dynamique basé sur un contexte typé

### Modified Capabilities

<!-- Aucune capability existante n'est modifiée -->

## Impact

- **Nouveaux fichiers**: `src/components/context-menu/` (Provider, composant, types, stories)
- **Dépendances existantes**: Utilise `react-aria-components` (déjà installé) pour Menu, Popover, MenuItem
- **Styling**: Réutilise les classes CSS de `dropdown-menu` (`.c__dropdown-menu`, `.c__dropdown-menu-item`)
- **Exports**: Nouveaux exports depuis l'index principal de la librairie
