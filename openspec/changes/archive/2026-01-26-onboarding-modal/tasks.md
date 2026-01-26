## 1. Setup

- [x] 1.1 Créer la structure du dossier `src/components/onboarding-modal/`
- [x] 1.2 Ajouter les traductions FR/EN dans `src/locales/` (skip, next, previous, complete)

## 2. Composant OnboardingStep

- [x] 2.1 Créer le composant `OnboardingStep` avec les props (icon, title, description, isActive, onClick)
- [x] 2.2 Implémenter l'affichage conditionnel (titre seul vs titre + description selon isActive)
- [x] 2.3 Ajouter les styles SCSS pour l'état actif (bordure, fond) et inactif

## 3. Composant OnboardingModal - Structure

- [x] 3.1 Créer le composant `OnboardingModal` avec les props définies dans le design
- [x] 3.2 Intégrer la Modal Cunningham comme conteneur
- [x] 3.3 Implémenter la gestion de l'état `currentStep` avec `initialStep`

## 4. Layout Desktop

- [x] 4.1 Implémenter le layout flex 50/50 (steps list | content zone)
- [x] 4.2 Rendre la liste des étapes cliquable pour navigation directe
- [x] 4.3 Afficher le header avec appName et mainTitle
- [x] 4.4 Ajouter le scroll sur la liste des étapes quand elle dépasse la hauteur disponible
- [x] 4.5 Implémenter le scroll-into-view automatique vers l'étape active

## 5. Layout Mobile

- [x] 5.1 Détecter mobile via `useResponsive()` et basculer le layout
- [x] 5.2 Afficher uniquement l'étape courante (pas la liste complète)
- [x] 5.3 Implémenter les boutons Previous/Next pour navigation séquentielle
- [x] 5.4 Masquer le bouton Previous sur la première étape

## 6. Footer

- [x] 6.1 Implémenter les boutons Skip et Next avec leurs callbacks
- [x] 6.2 Changer "Next" en "Understood" (ou label custom) sur la dernière étape
- [x] 6.3 Implémenter le footerLink optionnel (href ou onClick)

## 7. Transitions (supprimé)

- [ ] ~~7.1 Ajouter les transitions CSS fade pour le changement de contenu~~
- [ ] ~~7.2 Gérer l'état de transition pour éviter les clics multiples rapides~~

## 8. Styles

- [x] 8.1 Créer le fichier SCSS avec les classes BEM `c__onboarding-modal*`
- [x] 8.2 Intégrer les tokens Cunningham (couleurs, espacements, typographie)
- [x] 8.3 Assurer la cohérence visuelle avec le design system

## 9. Exports et Documentation

- [x] 9.1 Exporter le composant dans `src/components/onboarding-modal/index.tsx`
- [x] 9.2 Ajouter l'export dans le barrel principal de la librairie
- [x] 9.3 Créer les stories Storybook avec exemples variés (image, vidéo, composant custom)
- [x] 9.4 Ajouter la prop `size` pour configurer la taille de la modal sur desktop (défaut: ModalSize.LARGE)
- [x] 9.5 Ajouter `activeIcon` dans OnboardingStep pour permettre une icône différente quand l'étape est active

## 10. Tests (skipped - pas de stack de test pour le moment)

- [ ] ~~10.1 Écrire les tests pour la navigation entre étapes~~
- [ ] ~~10.2 Tester les callbacks (onSkip, onComplete, onClose)~~
- [ ] ~~10.3 Tester le comportement responsive (desktop vs mobile)~~
- [ ] ~~10.4 Tester les labels par défaut et personnalisés~~
