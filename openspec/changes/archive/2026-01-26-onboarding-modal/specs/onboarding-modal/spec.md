## ADDED Requirements

### Requirement: Modal displays with configurable titles
The `OnboardingModal` component SHALL display a modal with an optional app name and a required main title.

#### Scenario: Modal with app name and main title
- **WHEN** the modal is opened with `appName="Discover Docs"` and `mainTitle="Learn the core principles"`
- **THEN** the modal displays "Discover Docs" as a contextual label above "Learn the core principles" as the main heading

#### Scenario: Modal with main title only
- **WHEN** the modal is opened with only `mainTitle="Getting Started"` (no appName)
- **THEN** the modal displays only "Getting Started" as the main heading

### Requirement: Steps list displays on desktop
The component SHALL display a list of all steps on the left side (50% width) on desktop viewports. The number of steps is variable (n steps).

#### Scenario: Desktop displays all steps
- **WHEN** the modal is displayed on a desktop viewport with n steps configured
- **THEN** all n steps are visible in a vertical list on the left side

#### Scenario: Active step is visually distinct
- **WHEN** a step is active (current)
- **THEN** the step displays with a colored border, shows both title and description, and has a highlighted background

#### Scenario: Inactive steps show title only
- **WHEN** a step is not active
- **THEN** the step displays only the icon and title (no description)

### Requirement: Active step can display a different icon
The component SHALL allow specifying a different icon for the active state via `activeIcon`. By default, font icons get the brand primary color via CSS.

#### Scenario: Active step with activeIcon
- **WHEN** a step has `activeIcon` defined and the step is active
- **THEN** the `activeIcon` is displayed instead of `icon`

#### Scenario: Active step without activeIcon
- **WHEN** a step has no `activeIcon` defined and the step is active
- **THEN** the `icon` is displayed with the brand primary color applied via CSS

#### Scenario: Inactive step always uses icon
- **WHEN** a step is not active
- **THEN** the `icon` is displayed regardless of whether `activeIcon` is defined

### Requirement: Steps list scrolls when content overflows
The component SHALL display a scrollable list when the number of steps exceeds the modal height, and SHALL scroll to keep the active step visible.

#### Scenario: Many steps trigger scroll
- **WHEN** the modal has more steps than can fit in the visible area
- **THEN** the steps list becomes scrollable

#### Scenario: Active step scrolls into view
- **WHEN** the active step changes to a step that is not currently visible
- **THEN** the list scrolls to make the active step visible

### Requirement: Steps are clickable for navigation on desktop
The component SHALL allow users to click on any step to navigate directly to it on desktop.

#### Scenario: Click on inactive step
- **WHEN** user clicks on step 3 while on step 1 (desktop)
- **THEN** the current step changes to step 3 and the content zone updates accordingly

#### Scenario: Click on active step
- **WHEN** user clicks on the currently active step
- **THEN** nothing changes (step remains active)

### Requirement: Mobile displays single step with sequential navigation
The component SHALL display only the current step on mobile with Previous/Next buttons instead of a clickable list.

#### Scenario: Mobile shows current step only
- **WHEN** the modal is displayed on a mobile viewport
- **THEN** only the current step (icon, title, description) and its content are visible

#### Scenario: Mobile navigation buttons
- **WHEN** the modal is on mobile and not on the first or last step
- **THEN** both "Previous" and "Next" buttons are displayed in the footer

#### Scenario: First step hides Previous button
- **WHEN** the modal is on mobile and on the first step
- **THEN** the "Previous" button is not displayed

### Requirement: Content zone displays step content
The component SHALL display the `content` ReactNode of the active step in the right zone (50% width on desktop, below step info on mobile).

#### Scenario: Content displays image
- **WHEN** the active step has `content={<img src="..." alt="..." />}`
- **THEN** the image is displayed in the content zone

#### Scenario: Content displays React component
- **WHEN** the active step has `content={<CustomComponent />}`
- **THEN** the custom component is rendered in the content zone

### Requirement: Navigation buttons in footer
The component SHALL display Skip and Next buttons in the footer, with Next becoming "Understood" (or custom label) on the last step.

#### Scenario: Footer shows Skip and Next
- **WHEN** the modal is displayed and not on the last step
- **THEN** the footer shows a "Skip" button and a "Next" button

#### Scenario: Last step shows Understood
- **WHEN** the modal is on the last step
- **THEN** the "Next" button changes to "Understood" (or the custom `labels.complete` value)

#### Scenario: Skip button calls onSkip
- **WHEN** user clicks the "Skip" button
- **THEN** the `onSkip` callback is invoked

#### Scenario: Next button advances step
- **WHEN** user clicks the "Next" button and not on last step
- **THEN** the current step advances to the next step

#### Scenario: Understood button calls onComplete
- **WHEN** user clicks the "Understood" button (last step)
- **THEN** the `onComplete` callback is invoked

### Requirement: Close button calls onClose
The component SHALL have a close button (×) that calls the `onClose` callback.

#### Scenario: Close button click
- **WHEN** user clicks the close button (×)
- **THEN** the `onClose` callback is invoked

### Requirement: Footer link is optional and configurable
The component SHALL optionally display a footer link with configurable label and action.

#### Scenario: Footer link with href
- **WHEN** `footerLink={{ label: "Learn more", href: "/docs" }}` is provided
- **THEN** a link "Learn more" pointing to "/docs" is displayed in the footer

#### Scenario: Footer link with onClick
- **WHEN** `footerLink={{ label: "Learn more", onClick: handler }}` is provided
- **THEN** clicking "Learn more" invokes the handler

#### Scenario: No footer link
- **WHEN** `footerLink` is not provided
- **THEN** no link is displayed in the footer

### Requirement: Initial step is configurable
The component SHALL start at the step specified by `initialStep` (default 0).

#### Scenario: Default initial step
- **WHEN** `initialStep` is not provided
- **THEN** the modal starts at step 0 (first step)

#### Scenario: Custom initial step
- **WHEN** `initialStep={2}` is provided
- **THEN** the modal starts at step 2 (third step)

### Requirement: Modal size is configurable on desktop
The component SHALL allow configuring the modal size on desktop via the `size` prop, defaulting to `ModalSize.LARGE`. On mobile, the size is always `ModalSize.FULL`.

#### Scenario: Default size on desktop
- **WHEN** no `size` prop is provided on desktop
- **THEN** the modal uses `ModalSize.LARGE`

#### Scenario: Custom size on desktop
- **WHEN** `size={ModalSize.MEDIUM}` is provided on desktop
- **THEN** the modal uses `ModalSize.MEDIUM`

#### Scenario: Size ignored on mobile
- **WHEN** any `size` prop is provided on mobile
- **THEN** the modal always uses `ModalSize.FULL`

### Requirement: Labels are customizable for i18n
The component SHALL use default labels from the locale system, overridable via the `labels` prop.

#### Scenario: Default labels in French
- **WHEN** the locale is French and no custom labels are provided
- **THEN** buttons display "Passer", "Suivant", "Précédent", "Compris"

#### Scenario: Default labels in English
- **WHEN** the locale is English and no custom labels are provided
- **THEN** buttons display "Skip", "Next", "Previous", "Understood"

#### Scenario: Custom labels override defaults
- **WHEN** `labels={{ complete: "Got it!" }}` is provided
- **THEN** the last step button displays "Got it!" instead of "Understood"
