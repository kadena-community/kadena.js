## Conventions

### Component Structure

Component.Root etc.

- avoiding external elements (current exception is Next/Link)
- [Composition over configuration](https://dev.to/anuradha9712/configuration-vs-composition-design-reusable-components-5h1f):
  aim for composition over configuration, but support configuration where it
  makes (more) sense

### Component Typing

- Be as strict as possible, within the limits of the component's intended use.
- Never use `any` or `unknown` unless absolutely necessary.
- Use `unknown` over `any` if you're not sure what type something is.
- Only type the children prop as `ReactNode` if you don't know what type it will
  be or you wish to explicitly allow any children (e.g. it's up to the consumer
  to decide what to render).
- Use `FunctionComponentElement` otherwise with the applicable type.

### Component Property Naming Convention

### Standards regarding storybook and when we should write unit tests

### File structure and naming naming conventions

- always having a barrel file (index.ts)
- CSS files should be named after the component (e.g. `Button.css.ts`)

### Exports

- we always export component props
- never export default

### Type naming convention

- use interface for props and any objects (there are exceptions) - naming
  convention is to always prefix with I (for interface) and props always have a
  prop suffix
- use types for others

### How to handle components that may use Next/Link

- Use a wrapper component that handles the link (see e.g. `NavHeader`,
  `Breadcrumbs`)

## Vanilla Extract

### Classname naming convention

### Using sprinkles as much as possible

### Using recipes when you want to create variants

### Selectors

https://vanilla-extract.style/documentation/styling#complex-selectors

- when to use globalStyle
