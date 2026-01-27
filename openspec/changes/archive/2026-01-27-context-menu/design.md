## Context

L'ui-kit dispose déjà d'un composant `DropdownMenu` utilisant React Aria (Menu, MenuItem, Popover). Ce composant se positionne par rapport à un élément trigger via `triggerRef`. Pour le ContextMenu, nous avons besoin d'un positionnement aux coordonnées du clic droit, ce qui nécessite une approche différente.

Le styling CSS existant (`.c__dropdown-menu`, `.c__dropdown-menu-item`) est bien conçu et sera réutilisé pour garantir la cohérence visuelle.

## Goals / Non-Goals

**Goals:**
- Composant ContextMenu réutilisable et générique (pas spécifique au drive)
- Accessibilité complète via React Aria (navigation clavier, focus trap, aria attributes)
- Support des menus imbriqués avec propagation correcte (le plus proche gagne)
- API simple et typée avec support du contexte dynamique
- Performance : un seul Popover rendu dans le DOM, même avec de nombreux triggers

**Non-Goals:**
- Sous-menus imbriqués (feature future)
- Ouverture au clavier (Shift+F10) - peut être ajouté plus tard
- Animations de transition (peut être ajouté via CSS)
- Gestion des confirmations (responsabilité des callbacks)

## Decisions

### 1. Architecture Provider + Wrapper léger

**Choix**: Un `ContextMenuProvider` global gère l'état et rend un unique Popover. Les composants `ContextMenu` sont des wrappers légers qui déclarent leurs zones.

**Alternatives considérées**:
- Chaque `ContextMenu` rend son propre Popover → Problème de performance (500 fichiers = 500 Popovers dans le DOM)
- Hook seul sans Provider → Ne garantit pas qu'un seul menu est ouvert à la fois

**Rationale**: Le Provider centralise le rendu, garantit un menu unique ouvert, et optimise la mémoire.

### 2. Virtual Element pour le positionnement

**Choix**: Créer un objet avec `getBoundingClientRect()` retournant les coordonnées du clic pour simuler un élément trigger.

```typescript
const virtualRef = {
  current: {
    getBoundingClientRect: () => ({
      x, y, top: y, left: x, bottom: y, right: x, width: 0, height: 0
    })
  }
};
```

**Rationale**: React Aria Popover attend un `triggerRef`. Cette technique est standard (utilisée par Floating UI, Popper.js) et permet de réutiliser le comportement de positionnement intelligent de React Aria.

### 3. Pattern asChild avec Slot

**Choix**: Utiliser le pattern `asChild` (comme Radix) pour permettre aux consommateurs d'éviter un élément wrapper.

```tsx
// Sans asChild - ajoute un div
<ContextMenu menu={items}>
  <FileCard />
</ContextMenu>

// Avec asChild - clone l'enfant et ajoute onContextMenu
<ContextMenu menu={items} asChild>
  <li className="file-item">...</li>
</ContextMenu>
```

**Alternatives considérées**:
- Toujours wrapper dans un div → Casse parfois le layout (flexbox, grid)
- Prop `as="li"` → Moins flexible, ne permet pas de passer des props à l'élément

**Rationale**: Meilleure DX et flexibilité pour les cas où le wrapper pose problème.

### 4. API des items : tableau ou fonction

**Choix**: Supporter les deux formes :

```typescript
type ContextMenuProps<T> = {
  menu: ContextMenuItem[] | ((context: T) => ContextMenuItem[]);
  context?: T;
};
```

**Rationale**: Tableau simple pour les cas statiques, fonction pour les menus dynamiques basés sur l'élément cliqué.

### 5. Réutilisation du styling DropdownMenu

**Choix**: Utiliser les mêmes classes CSS (`.c__dropdown-menu`, `.c__dropdown-menu-item`) sans créer de nouveau fichier SCSS.

**Alternatives considérées**:
- Extraire un fichier `menu-base.scss` partagé → Refactoring risqué du DropdownMenu existant
- Dupliquer le SCSS → Maintenance double

**Rationale**: Pragmatique, cohérent visuellement, pas de risque de régression.

### 6. Types séparés de DropdownMenuOption

**Choix**: Créer un type `ContextMenuItem` distinct :

```typescript
type ContextMenuItem =
  | {
      label: string;
      icon?: ReactNode;
      onAction: () => void;
      disabled?: boolean;
      hidden?: boolean;
      variant?: "default" | "danger";
    }
  | { type: "separator" };
```

**Alternatives considérées**:
- Réutiliser `DropdownMenuOption` → Confus (props `isChecked`, `value` non pertinentes)

**Rationale**: API plus claire et adaptée au cas d'usage des context menus.

## Risks / Trade-offs

**[Risk] Virtual element non standard** → Le pattern est bien établi (Floating UI, Popper) et React Aria le supporte via `triggerRef`. Mitigation: tests exhaustifs du positionnement.

**[Risk] asChild complexité** → Utilisation de `React.cloneElement` qui a des edge cases. Mitigation: documenter les limitations (enfant unique, doit accepter onContextMenu).

**[Trade-off] Composant séparé vs extension DropdownMenu** → On accepte une légère duplication de logique (rendu des items) pour éviter de complexifier le DropdownMenu existant. Le styling reste partagé.

**[Trade-off] Pas de sous-menus** → Simplifie l'implémentation initiale. Peut être ajouté plus tard avec une structure récursive des items.
