## Context

L'ui-kit fournit des composants React pour les applications de La Suite. Le composant `OnboardingModal` sera utilisé pour guider les nouveaux utilisateurs à travers les fonctionnalités d'une application via une modale multi-étapes.

Le projet utilise :
- La Modal de Cunningham pour la gestion de l'accessibilité (focus trap, fermeture via Escape)
- SCSS avec CSS custom properties pour le styling
- Le hook `useResponsive` pour la gestion du responsive
- Un système de locales FR/EN via `useCunningham().t()`

## Goals / Non-Goals

**Goals:**
- Créer un composant `OnboardingModal` générique et entièrement configurable
- Supporter deux layouts : desktop (50/50 avec navigation libre) et mobile (empilé avec Previous/Next)
- Permettre tout type de contenu dans la zone de preview (images, vidéos, GIFs, composants React)
- Changement d'étape instantané
- Fournir les labels par défaut en FR et EN

**Non-Goals:**
- Gestion de la persistence (localStorage, cookies) - à la charge de l'application parente
- Gestion des icônes - le consommateur les fournit via `ReactNode`
- Analytics ou tracking - à la charge de l'application parente

## Decisions

### 1. Structure des composants

```
src/components/onboarding-modal/
├── OnboardingModal.tsx       # Composant principal
├── OnboardingModal.scss      # Styles
├── OnboardingStep.tsx        # Composant étape individuelle
├── index.tsx                 # Exports
└── onboarding-modal.stories.tsx  # Storybook
```

**Rationale:** Séparation claire entre le conteneur (modal) et les items (steps), pattern déjà utilisé dans le projet (ex: ShareModal, QuickSearch).

### 2. API du composant

```tsx
interface OnboardingStep {
  icon: ReactNode;
  /** Icon displayed when the step is active (optional, defaults to icon with brand color via CSS) */
  activeIcon?: ReactNode;
  title: string;
  description?: string;
  content: ReactNode;
}

interface OnboardingModalProps {
  isOpen: boolean;

  /** Size of the modal on desktop (default: ModalSize.LARGE). On mobile, always ModalSize.FULL */
  size?: ModalSize;

  /** Name of the application or module (e.g., "Discover Docs", "Welcome to Messaging") */
  appName?: string;

  /** Main heading of the onboarding modal (e.g., "Learn the core principles") */
  mainTitle: string;

  steps: OnboardingStep[];
  initialStep?: number;
  footerLink?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  onSkip?: () => void;
  onComplete: () => void;
  onClose: () => void;
  labels?: {
    skip?: string;
    next?: string;
    previous?: string;
    complete?: string;
  };
}
```

**Rationale:**
- `isOpen` + `onClose` : pattern standard des modales Cunningham
- Callbacks séparés (`onSkip`, `onComplete`, `onClose`) : permet à l'app parente de distinguer les comportements
- `labels` optionnel : permet l'i18n custom tout en fournissant des défauts

### 3. Gestion du responsive

Utilisation du hook `useResponsive()` existant pour détecter mobile/desktop :
- **Desktop** : Layout flex 50/50, liste complète des étapes cliquables
- **Mobile** : Layout empilé, seule l'étape courante visible, navigation Previous/Next

**Rationale:** Réutilisation du hook existant, cohérence avec le reste de la librairie.

### 4. Gestion du scroll (n étapes)

Le nombre d'étapes est variable. Si la liste dépasse la hauteur disponible :
- La zone des étapes devient scrollable (`overflow-y: auto`)
- Lors du changement d'étape active, `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` est appelé pour garder l'étape visible

**Rationale:** UX fluide même avec beaucoup d'étapes, comportement natif du navigateur.

### 5. Styling

Classes CSS avec préfixe `c__onboarding-modal` :
- `c__onboarding-modal` : conteneur principal
- `c__onboarding-modal__header` : zone titre
- `c__onboarding-modal__body` : zone flex contenant steps + content
- `c__onboarding-modal__steps` : liste des étapes (desktop only)
- `c__onboarding-modal__step` : item étape
- `c__onboarding-modal__step--active` : modificateur étape active
- `c__onboarding-modal__content` : zone de preview
- `c__onboarding-modal__footer` : zone footer

**Rationale:** Convention de nommage BEM déjà utilisée dans le projet (`c__share-modal`, etc.).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Performance avec contenu lourd (vidéos) | Le contenu est un `ReactNode`, le consommateur gère le lazy loading si nécessaire |
| Accessibilité de la navigation clavier | La Modal Cunningham gère le focus trap, on ajoute `aria-current` sur l'étape active |
| Complexité du responsive | Deux rendus conditionnels clairs plutôt qu'un seul layout adaptatif complexe |
