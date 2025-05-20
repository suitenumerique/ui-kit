# @gouvfr-lasuite/ui-kit

[Unreleased]

### Minor Changes

- Do not show remove access option if the deleteAccess prop is not provided

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
