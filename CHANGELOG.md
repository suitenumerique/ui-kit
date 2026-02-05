# @gouvfr-lasuite/ui-kit

## [Unreleased]

## 0.19.6

### Minor Changes

- upgrade cunningham-react to 4.2.0

## 0.19.5

### Patch Changes

- Fix the delete option visibility in access role dropdown 

## 0.19.4

### Patch Changes

- Fix the delete option visibility in access role dropdown 

## 0.19.3

### Patch Changes

- Fix the ReleaseNoteModal component

## 0.19.2

### Minor Changes 

-  add can_delete property and improve ShareModal Storybook docs 

## 0.19.1

### Minor Changes 

- Add ReleaseNoteModal component
- Move delete access into AccessRoleDropdown.

### Patch Changes

- Fix update type apiUrl in LaGaufreV2 component
- Fix animation on OnboardingModal

## 0.19.0

### Minor Changes 

- Add ContextMenu component 
- Add OnBoardingModal component

## 0.18.7

### Minor Changes

- Update ShareModal and dropdown to show more informations

### Patch Changes

- Fix CSS syntax issue in QuickSearch component

## 0.18.6

### Minor Changes

- Update `UserAvatar` and `UserMenu` components to stick to the Figma design
- Upgrade to latest Cunningham tokens (@openfun/cunningham-* -> @gouvfr-lasuite/cunningham-*)
- Export White Label & ANCT themes with light/dark variants
- Export `getUIKitThemesFromGlobals` utility function to create a custom from UI Kit globals and overrides

### Patch Changes

- Fix icon size CSS selector specificity issue

## 0.18.5

### Minor Changes

- Add props to customize row in TreeView component

## 0.18.4

### Patch Changes

- fix LaGaufreV2 component rerender and add headerLogo for mobile

## 0.18.3

### Patch Changes

- fixes the responsiveness of the User Menu component

## 0.18.2

### Patch Changes

- fix missing export LaGaufreV2 component

## 0.18.1

### Minor Changes

- Add Gaufre V2 component

## 0.18.0

### Major changes

- Add pagination to the tree components

### Patch Changes

- Several patch fixes after the uikit v2 refactoring

## 0.17.2

### Patch Changes

- Make "build" command cross-platform compatible
- fix missing css variable replacement

## 0.17.1

### Patch Changes

- update styles to use the new globals tokens

## 0.17.0

### Major Changes

- switch and adapt all components to cunningham v4

## 0.16.2

### Patch Changes

- a11y: improves keyboard accessibility in the TreeView component
- a11y: Enable child node loading and fold/unfold via keyboard without requiring an initial mouse click.
- a11y: Expose useArrowRoving hook
- a11y: improves keyboard accessibility in the TreeView component
- a11y: Enable child node loading and fold/unfold via keyboard without requiring an initial mouse click.
- badge: fix the export

## 0.16.1

### Patch Changes

- Remove zindex on layout header
- Remove backdrop zindex

## 0.16.0

### Minor Changes

- Add dndRootElement for drag and drop functionality

## 0.15.0

### Minor Changes

- Make Footer configurable
- Add custom translation to share modal
- Make LanguagePicker component reusable and customizable
- Add UserMenu component

### Patch Changes

- Fix vertical separator stretch behavior

## 0.14.0

### Minor Changes

- Add vertical separator component

## 0.13.0

### Major Changes

- Remove base64 fonts and roboto from styles

### Minor Changes

- Remove ProConnect button logo from style

## 0.12.0

### Minor Changes

- Customize disable state of button link
- Improve active states look and feel for button component

### Removed

- Remove the import-locales script in favor of cunningham locale import

## 0.11.0

### Minor Changes

- Update cunningham version to 3.2.1

## 0.10.0

### Minor Changes

- Add cannot view feature to share modal

## 0.9.0

### Minor Changes

- Added link reach and role handling in ShareModal

### Patch Changes

- Make tooltip word break for multiline overflow

## 0.8.2

### Patch Changes

- add react 19 as peer dependency

## 0.8.1

### Patch Changes

- Improve hero css to avoid collision

## 0.8.0

### Minor Changes

- add icon component
- add material filled icons

## 0.7.0

### Minor Changes

- export avatar utils
- Do not show remove access option if the deleteAccess prop is not provided

### Patch Changes

- Fix the keyDown event propagation in TreeViewItem

## 0.6.0

### Minor Changes

- add separator for the filter component

### Patch Changes

- fix the cunningham file because the refs were not used correctly
- fix ShareModal

## 0.5.0

### Minor Changes

- add Badge component
- add controlled left-panel

### Patch Changes

- update react-aria deps

## 0.4.1

### Patch Changes

- hide the user list and enter in the Share Modal component if we can't update

## 0.4.0

### Minor Changes

- add filter component

## 0.3.0

### Minor Changes

- add ShareModal component and utils components
- add topMessage for DropdownMenu
- add Avatar component
- add UserRow commponent

### Patch changes

- fix useTree hook

## 0.2.0

### Minor Changes

- add Hero component
- add Footer component
- add La Gaufre component
- add hideLeftPanelOnDesktop on MainLayout

### Patch changes

- remove unused tokens
- fix locales format, frFR to fr-FR

## 0.1.10

### Patch Changes

- (tree-view) update node values when the tree has changed

## 0.1.9

### Patch Changes

- (tree-view) fix event propagation

## 0.1.8

### Patch Changes

- (tree-view) fixed the incessant row re-rendering

## 0.1.7

### Patch Changes

- (tree-view) fix updateNode method

## 0.1.6

### Patch Changes

- (tree-view) add getAncestors to the useTree hook

## 0.1.5

### Patch Changes

- (tree-view) Add getNode to the useTree hook

## 0.1.4

### Patch Changes

- Add RightPannel component
- Add TreeProvider and useTreeContext

## 0.1.3

### Patch Changes

- Adjusted the position of the separator in the TreeView component
- Added logic to update child elements when a parent element is updated in the useTree hook

## 0.1.2

### Patch Changes

- Updated logic of the TreeView component's onMove method

## 0.1.1

### Patch Changes

- Improve accessibility for DropdownMenu
- Fixed addChild method for useTree hook
- Fixed onMove method for TreeView

## 0.1.0

### Minor Changes

- Add resetTree method to useTree hook
- Add default opened node to TreeView

## 0.0.2

### Patch Changes

- Update react to 19.0.0
- Update cunningham to 3.0.0

## 0.0.1

### Major Changes

- Add basic components: button, datagrid, dropdown-menu, modal, layouts, provider, quick-search, tabs, tree-veiw
- Add storybook
- Add custom cunningham.ts file
- Still a WIP version

[unreleased]: https://github.com/suitenumerique/ui-kit/compare/v0.18.6...main
[0.18.6]: https://github.com/suitenumerique/ui-kit/compare/v0.18.5...v0.18.6
[0.18.5]: https://github.com/suitenumerique/ui-kit/compare/v0.18.4...v0.18.5
[0.18.4]: https://github.com/suitenumerique/ui-kit/compare/v0.18.3...v0.18.4
[0.18.3]: https://github.com/suitenumerique/ui-kit/compare/v0.18.2...v0.18.3
[0.18.2]: https://github.com/suitenumerique/ui-kit/compare/v0.18.1...v0.18.2
[0.18.1]: https://github.com/suitenumerique/ui-kit/compare/v0.18.0...v0.18.1
[0.18.0]: https://github.com/suitenumerique/ui-kit/compare/v0.17.2...v0.18.0
[0.17.2]: https://github.com/suitenumerique/ui-kit/compare/v0.17.1...v0.17.2
[0.17.1]: https://github.com/suitenumerique/ui-kit/compare/v0.17.0...v0.17.1
[0.17.0]: https://github.com/suitenumerique/ui-kit/compare/v0.16.2...v0.17.0
[0.16.2]: https://github.com/suitenumerique/ui-kit/compare/v0.16.1...v0.16.2
[0.16.1]: https://github.com/suitenumerique/ui-kit/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/suitenumerique/ui-kit/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/suitenumerique/ui-kit/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/suitenumerique/ui-kit/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/suitenumerique/ui-kit/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/suitenumerique/ui-kit/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/suitenumerique/ui-kit/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/suitenumerique/ui-kit/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/suitenumerique/ui-kit/compare/v0.8.2...v0.9.0
[0.8.2]: https://github.com/suitenumerique/ui-kit/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/suitenumerique/ui-kit/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/suitenumerique/ui-kit/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/suitenumerique/ui-kit/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/suitenumerique/ui-kit/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/suitenumerique/ui-kit/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/suitenumerique/ui-kit/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/suitenumerique/ui-kit/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/suitenumerique/ui-kit/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/suitenumerique/ui-kit/compare/v0.1.10...v0.2.0
[0.1.10]: https://github.com/suitenumerique/ui-kit/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/suitenumerique/ui-kit/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/suitenumerique/ui-kit/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/suitenumerique/ui-kit/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/suitenumerique/ui-kit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/suitenumerique/ui-kit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/suitenumerique/ui-kit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/suitenumerique/ui-kit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/suitenumerique/ui-kit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/suitenumerique/ui-kit/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/suitenumerique/ui-kit/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/suitenumerique/ui-kit/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/suitenumerique/ui-kit/compare/e9aeb1b9551c387368ea0211fe9a468dfb12a0ce...v0.0.1
