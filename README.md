# @gouvfr-lasuite/ui-kit

<!-- TODO: Add CI/CD badge when available -->
[![npm version](https://img.shields.io/npm/v/@gouvfr-lasuite/ui-kit.svg)](https://www.npmjs.com/package/@gouvfr-lasuite/ui-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> Official UI Kit for **La Suite numérique** - A modern, accessible, and customizable React component library built on [Cunningham](https://github.com/openfun/cunningham).

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Available Components](#available-components)
- [Themes](#themes)
- [Hooks](#hooks)
- [Internationalization](#internationalization)
- [Storybook Documentation](#storybook-documentation)
- [Development](#development)
- [Customization](#customization)
- [Usage Examples](#usage-examples)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

`@gouvfr-lasuite/ui-kit` is the official design system for **La Suite numérique**, the French government's collaborative tools ecosystem. This library provides a consistent set of reusable, accessible React components that comply with governmental design standards.

Built on top of [Cunningham](https://github.com/openfun/cunningham) (v4), this kit extends the design system capabilities with components specific to La Suite numérique needs.

### Goals

- **Visual Consistency**: Ensure a uniform user experience across all La Suite numérique products
- **Accessibility**: Comply with WCAG and RGAA standards for maximum accessibility
- **Performance**: Optimized and tree-shakable components
- **Flexibility**: Support for multiple themes (DSFR, ANCT, White Label)
- **Developer-friendly**: Native TypeScript, comprehensive documentation, easy integration

---

## Features

- **25+ components** ready to use
- **Multiple themes**: DSFR, ANCT, White Label (light/dark)
- **Accessibility**: Keyboard navigation, screen readers, ARIA
- **Internationalization**: Built-in French and English support
- **Responsive**: Adaptive components with dedicated hooks
- **Layouts**: Page layout system with resizable panels
- **La Gaufre Integration**: Component for La Suite numérique services integration
- **TypeScript**: Full typing for better DX
- **Design tokens**: Customizable CSS/SCSS/TS token system

---

## Technologies

| Technology | Version | Usage |
|------------|---------|-------|
| React | 19.x | UI Framework |
| TypeScript | 5.6 | Static typing |
| Vite | 6.x | Bundler / Dev server |
| Cunningham | 4.1 | Base design system |
| Storybook | 8.5 | Documentation / Playground |
| Sass | 1.83 | CSS preprocessor |
| Vitest | 2.1 | Unit testing |
| react-aria-components | 1.8 | Accessible primitives |
| react-resizable-panels | 2.1 | Resizable panels |
| dnd-kit | 6.3 | Drag and Drop |

---

## Prerequisites

- **Node.js**: >= 20.x
- **Package manager**: yarn (recommended) or npm
- **React**: 19.x

---

## Installation

### Via Yarn (recommended)

```bash
yarn add @gouvfr-lasuite/ui-kit
```

### Via npm

```bash
npm install @gouvfr-lasuite/ui-kit
```

### Peer dependencies

Make sure you have the peer dependencies installed:

```bash
yarn add react react-dom
```

---

## Quick Start

### 1. Import styles

In your entry file (e.g., `main.tsx` or `App.tsx`):

```tsx
// UI Kit styles (includes Cunningham)
import "@gouvfr-lasuite/ui-kit/style";

// Optional: Marianne font
import "@gouvfr-lasuite/ui-kit/fonts/Marianne";
```

### 2. Configure the Provider

Wrap your application with the `CunninghamProvider`:

```tsx
import { CunninghamProvider } from "@gouvfr-lasuite/ui-kit";

function App() {
  return (
    <CunninghamProvider>
      <YourApp />
    </CunninghamProvider>
  );
}
```

### 3. Use components

```tsx
import { MainLayout, QuickSearch, TreeView } from "@gouvfr-lasuite/ui-kit";

function MyPage() {
  return (
    <MainLayout
      leftPanelContent={<TreeView data={treeData} />}
    >
      <QuickSearch placeholder="Search..." />
      {/* Your content */}
    </MainLayout>
  );
}
```

---

## Project Structure

```
ui-kit/
├── src/
│   ├── components/           # React components
│   │   ├── badge/           # Badge
│   │   ├── button/          # Buttons (ProConnect)
│   │   ├── datagrid/        # Data grid
│   │   ├── dnd/             # Drag and Drop
│   │   ├── dropdown-menu/   # Dropdown menu
│   │   ├── filter/          # Filters
│   │   ├── footer/          # Footer
│   │   ├── form/            # Form fields
│   │   ├── hero/            # Hero section
│   │   ├── icon/            # Icons
│   │   ├── la-gaufre/       # La Suite integration
│   │   ├── language/        # Language selector
│   │   ├── layout/          # Layouts and panels
│   │   ├── loader/          # Loading indicators
│   │   ├── modal/           # Modals
│   │   ├── Provider/        # Cunningham Provider
│   │   ├── quick-search/    # Quick search
│   │   ├── separator/       # Separators
│   │   ├── share/           # Sharing and permissions
│   │   ├── tabs/            # Tabs
│   │   ├── tooltip/         # Tooltips
│   │   ├── tree-view/       # Tree view
│   │   └── users/           # User avatars and menus
│   ├── hooks/               # Custom React hooks
│   ├── locales/             # Translation files
│   ├── styles/              # Global styles and variables
│   ├── assets/              # Resources (fonts, images)
│   └── utils/               # Utilities
├── .storybook/              # Storybook configuration
├── cunningham.ts            # Design tokens configuration
└── dist/                    # Production build
```

---

## Available Components

### Layout & Navigation

| Component | Description |
|-----------|-------------|
| `MainLayout` | Main layout with header and resizable panels |
| `Header` | Application header |
| `LeftPanel` | Left side panel (navigation) |
| `RightPanel` | Right side panel (details) |
| `Footer` | Official footer |
| `Tabs` | Tab navigation |
| `DropdownMenu` | Contextual dropdown menu |

### Forms

| Component | Description |
|-----------|-------------|
| `Input` | Text input field |
| `Textarea` | Multi-line text area |
| `Select` | Selection list |
| `Checkbox` | Checkbox |
| `Radio` | Radio button |
| `Switch` | Toggle switch |
| `Label` | Field label |

### Data & Display

| Component | Description |
|-----------|-------------|
| `TreeView` | Interactive tree view with pagination |
| `Datagrid` | Data grid |
| `QuickSearch` | Quick search bar (cmd+k) |
| `Badge` | Status badge |
| `Icon` | Material icons |
| `Loader` | Loading indicator |
| `Tooltip` | Tooltip |

### Sharing & Collaboration

| Component | Description |
|-----------|-------------|
| `ShareModal` | Share modal with access management |
| `UserAvatar` | User avatar |
| `UserMenu` | User menu with logout |
| `UsersInvitation` | User invitation |

### Integration

| Component | Description |
|-----------|-------------|
| `LaGaufre` | La Suite numérique services menu |
| `LaGaufreV2` | Enhanced version of La Gaufre |
| `ProConnectButton` | ProConnect login button |

### Utilities

| Component | Description |
|-----------|-------------|
| `Modal` | Generic modal |
| `Separator` | Visual separator |
| `Hero` | Hero section |
| `Filter` | Filter component |
| `LanguageSelector` | Language selector |

---

## Themes

The UI Kit supports multiple predefined themes:

### Available Themes

| Theme | Description |
|-------|-------------|
| `default` | White Label - Light mode |
| `dark` | White Label - Dark mode |
| `dsfr-light` | French State Design System - Light mode |
| `dsfr-dark` | French State Design System - Dark mode |
| `anct-light` | ANCT - Light mode |
| `anct-dark` | ANCT - Dark mode |

### Using Themes

```tsx
import { CunninghamProvider, cunninghamConfig } from "@gouvfr-lasuite/ui-kit";

// Use a predefined theme
<CunninghamProvider theme="dsfr-light">
  <App />
</CunninghamProvider>
```

### Creating a Custom Theme

see [Cunningham docs](https://suitenumerique.github.io/cunningham/storybook/?path=/docs/getting-started-customization--docs) for more information



## Hooks

### useResponsive

Detects responsive breakpoints:

```tsx
import { useResponsive } from "@gouvfr-lasuite/ui-kit";

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return isDesktop ? <DesktopView /> : <MobileView />;
}
```



### useCustomTranslations

Override default translations:

```tsx
import { useCustomTranslations } from "@gouvfr-lasuite/ui-kit";

// In your Provider
const customTranslations = {
  "en-US": {
    components: {
      share: {
        modalTitle: "Share this document",
      },
    },
  },
};
```

---

## Internationalization

The UI Kit natively supports French and English.

### Supported Languages

- `fr-FR` - French (default)
- `en-US` - English

### Changing Language

```tsx
<CunninghamProvider currentLanguage="en-US">
  <App />
</CunninghamProvider>
```

### Contribute to add a language with a new PR

- Create a new translation file in `src/locales`
- Add all translations
- Create a PR 

### Adding Custom Translations dynamically

```tsx
import { locales } from "@gouvfr-lasuite/ui-kit";

const customLocales = {
  ...locales,
  "de-DE": {
    components: {
      share: {
        modalTitle: "Teilen",
        // ...
      },
    },
  },
};

<CunninghamProvider customLocales={customLocales}>
  <App />
</CunninghamProvider>
```



---

## Storybook Documentation

Interactive documentation is available via Storybook.

### Run Storybook Locally

```bash
yarn storybook
```

Then access [http://localhost:6006](http://localhost:6006)



---

## Development

### Install Dependencies

```bash
yarn install
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start Vite development server |
| `yarn build` | Build library for production |
| `yarn lint` | Check code with ESLint |
| `yarn test` | Run tests with Vitest |
| `yarn storybook` | Start Storybook (port 6006) |
| `yarn build-storybook` | Build Storybook for deployment |
| `yarn build-theme` | Generate CSS/SCSS/TS token files |

### Running Tests

```bash
# Tests in watch mode
yarn test

# Tests with coverage
yarn test --coverage
```

### Component Structure

```
src/components/my-component/
├── index.tsx           # Main export
├── index.scss          # Component styles
├── MyComponent.tsx     # React component
├── types.ts            # TypeScript types
└── my-component.stories.tsx  # Storybook stories
```

---

## Customization

### Design Tokens

Design tokens are defined in `cunningham.ts` and can be overridden:

```tsx
// Available tokens
{
  globals: {
    font: { sizes, weights, families },
    spacings: { xs, sm, md, lg, xl, ... },
    colors: { brand-*, gray-*, info-*, success-*, warning-*, error-* },
    breakpoints: { xxs, xs, mobile, tablet },
  },
  contextutals: {
    background: {
        semantic: {
            brand: {
                primary: '..'
            }
        }
    }
  }
 
}
```

### CSS Variables

Tokens are exposed as CSS variables:

```css
.my-custom-element {
  color: var(--c--globals--colors--brand-500);
  padding: var(--c--globals--spacings--md);
  font-size: var(--c--globals--font--sizes--lg);
  background: var(--c--contextuals--background--semantic--brand--primary);
}
```

### Utility Classes

```html
<!-- Colors -->
<div class="clr-green-500">Primary text</div>
<div class="bg-success-500">Secondary background</div>

<!-- Spacing -->
<div class="p-md">Medium padding</div>
<div class="m-lg">Large margin</div>
```

---

## Usage Examples

### Layout with TreeView and Search

```tsx
import {
  CunninghamProvider,
  MainLayout,
  TreeView,
  QuickSearch,
  UserMenu,
} from "@gouvfr-lasuite/ui-kit";
import "@gouvfr-lasuite/ui-kit/style";

const treeData = [
  {
    id: "1",
    name: "Documents",
    children: [
      { id: "1-1", name: "Report.pdf" },
      { id: "1-2", name: "Notes.md" },
    ],
  },
];

function App() {
  return (
    <CunninghamProvider>
      <MainLayout
        icon={<Logo />}
        leftPanelContent={
          <TreeView
            data={treeData}
            onSelect={(node) => console.log(node)}
          />
        }
        rightHeaderContent={
          <UserMenu
            user={{ name: "John Doe", email: "john@example.com" }}
            onLogout={() => {}}
          />
        }
      >
        <QuickSearch
          onSearch={(query) => console.log(query)}
          groups={[
            {
              title: "Recent documents",
              items: [
                { id: "1", label: "Q4 Report" },
                { id: "2", label: "Budget 2024" },
              ],
            },
          ]}
        />
        <main>Main content</main>
      </MainLayout>
    </CunninghamProvider>
  );
}
```

### Share Modal

```tsx
import { ShareModal } from "@gouvfr-lasuite/ui-kit";

function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Share</button>
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        members={[
          { id: "1", name: "Marie", email: "marie@example.com", role: "editor" },
        ]}
        onAddMember={(user, role) => {}}
        onRemoveMember={(userId) => {}}
        onCopyLink={() => navigator.clipboard.writeText(window.location.href)}
      />
    </>
  );
}
```

### Form with Validation

```tsx
import { Input, Select, Switch, Label } from "@gouvfr-lasuite/ui-kit";

function ContactForm() {
  return (
    <form>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" required />
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          id="department"
          options={[
            { value: "hr", label: "Human Resources" },
            { value: "tech", label: "Technology" },
            { value: "admin", label: "Administration" },
          ]}
        />
      </div>

      <div>
        <Switch id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
    </form>
  );
}
```

---

## Compatibility

### Supported Browsers

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

### Compatible Frameworks

- **React**: 19.x (peer dependency)
- **Next.js**: 14+ (with appropriate configuration)
- **Remix**: Compatible
- **Vite**: Optimized

### Accessibility

- WCAG 2.1 Level AA compliant
- RGAA 4.1 compliant
- Full keyboard navigation
- Screen reader support (NVDA, VoiceOver, JAWS)

---

## Contributing

Contributions are welcome! See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for details.

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (follow commit conventions)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Commit Conventions

This project follows conventional commit conventions:

```
type(scope): description

# Examples
feat(tree-view): add pagination support
fix(modal): resolve focus trap issue
docs(readme): update installation section
```

### Release

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release process.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/suitenumerique/ui-kit/issues)
- **Documentation**: [Storybook](#storybook-documentation)
- **Cunningham**: [Cunningham Documentation](https://github.com/openfun/cunningham)

---

<p align="center">
  <strong>Made with care for La Suite numérique</strong><br>
  <sub>A French government initiative</sub>
</p>
