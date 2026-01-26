## Why

L'ui-kit ne dispose pas de composant d'onboarding pour guider les nouveaux utilisateurs à travers les fonctionnalités d'une application. Les applications de La Suite ont besoin d'un moyen standardisé pour présenter leurs fonctionnalités clés aux utilisateurs lors de leur première visite.

## What Changes

- Ajout d'un nouveau composant `OnboardingModal` qui affiche une modale guidée multi-étapes
- Le composant utilise la Modal de Cunningham pour la gestion de l'accessibilité (focus trap, fermeture Escape)
- Support desktop (layout 50/50 avec liste d'étapes cliquables) et mobile (navigation Previous/Next uniquement)
- Changement d'étape instantané (sans transition)
- Contenu entièrement configurable (titres, étapes, icônes, contenu rich media ou composants React)

## Capabilities

### New Capabilities

- `onboarding-modal`: Composant modal d'onboarding multi-étapes avec navigation libre (desktop) ou séquentielle (mobile), affichant une liste d'étapes à gauche et un contenu contextuel à droite

### Modified Capabilities

<!-- Aucune capability existante n'est modifiée -->

## Impact

- **Nouveau composant**: `src/components/OnboardingModal/`
- **Exports**: Ajout à l'index principal de la librairie
- **Dépendances**: Utilise la Modal Cunningham existante
- **Styles**: Nouveaux fichiers SCSS pour le composant
- **Locales**: Ajout des labels par défaut (Skip, Next, Previous, Understood) en FR/EN
