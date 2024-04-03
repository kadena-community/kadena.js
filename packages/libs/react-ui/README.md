# React UI

**@kadena/react-ui** is a library used to provide a styling environment and
basic React components for reuse in Kadena applications. It uses
[vanilla-extract/css][1] (will be referred to as VE) to establish a system of
utility classes (defined as [sprinkles][2]) and CSS variables (defined in the
theme) that align with [Kadena's Design System][3] and exposes them so that they
can be used with any project or framework. A basic [Storybook][4] integration
has been implemented so that users can preview components visually and interact
with their configuration options.

> Warning: This library is in its early development stage so elements in the
> styling environment may change as well as the API for components.
> Additionally, installation and compatibility has only been tested with Next.js
> projects within the Kadena.js monorepo.

## Getting Started

### Install

```sh
pnpm install @kadena/react-ui
```

Since this library uses VE and is not pre-bundled, the consuming project will
need to setup integration with VE. You can find integration instructions in the
[VE docs][5].

### Integration with Next.js projects within Kadena.js

Run the following commands to install dependencies and build the library from
this repo:

```sh
pnpm install --filter @kadena/react-ui
pnpm build --filter @kadena/react-ui
```

Add **@kadena/react-ui** as a dependency in your `package.json`:

```json
{
  ...
  "dependencies": {
    "@kadena/react-ui": "workspace:*",
    ...
  }
}
```

Then run the following commands from your project directory to install the
package and update the monorepo's state:

```sh
pnpm install
```

VE requires bundler configuration to handle CSS. To set this up in Next.js you
will need to install the following plugin:

```sh
pnpm add @vanilla-extract/next-plugin --dev
```

_If you don’t have a next.config.js file in the root of your project, you'll
need to create one first._ Add the plugin to your next.config.js file and add
**@kadena/react-ui** to transpilePackages:

```ts
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/react-ui'],
};

module.exports = withVanillaExtract(nextConfig);
```

If required, this plugin can be composed with other plugins. See [VE Next.js
integration docs][6].

After the plugin is setup, you should be able to use styling utilities exported
from **@kadena/react-ui** and components within your application.

### Usage

As mentioned earlier, **@kadena/react-ui** provides components and styling
utilities that align with the [Kadena Design System][3].

Example for importing and using components:

```tsx
import { Text } from '@kadena/react-ui';

export const Component = () => {
  return <Text>Hello World!</Text>;
};
```

We are using [vanilla-extract/css][1] to define our design system and style our
components. To utilize the same theme variables and utility classes in
conjunction with [vanilla-extract/css][1] in your own project, you can import
them via `@kadena/react-ui/styles`:

```ts
import { atoms, vars } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const exampleClass = style([
  atoms({
    backgroundColor: 'base.default',
    color: 'text.base.default',
    margin: 'sm',
  }),
]);
```

### Global styles

We are overriding some global styles and adding fonts in this library. To make
sure fonts are loaded and global styles are applied, you will need to add the
`import '@kadena/react-ui/global'` to your app's entry point.

### Dark Theme

We are utilizing the [theming][7] feature from VE to create CSS color variables
that invert depending on the selected theme (light/dark). By default, the theme
will have colors suitable for light mode, but to add dark theme integration you
can export `darkThemeClass` from **@kadena/react-ui** and use it with your theme
provider.

You can use "next-themes" to set this up in Next.js projects by wrapping
`Component` with the `ThemeProvider` in `__app.tsx`

```tsx
import { darkThemeClass } from '@kadena/react-ui/styles';
import { ThemeProvider } from 'next-themes';

export const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
```

> Note: We understand that just inverting colors is not enough to achieve good
> UX in dark mode. We are using this color inversion in conjunction with custom
> color selection to style dark mode within our applications.

### Running Storybook

After installing dependencies, you can start Storybook with the following
command:

```sh
pnpm storybook
```

## UI Library Guidelines

We would like to maintain a strict component library with opinionated styles and
isolated components that rely on wrapper or layout components for positioning.
The following is some information about how we have approached building our
components to maintain this goal.

### Styling

We are currently using [vanilla-extract/css][8] as it is a zero-runtime
CSS-in-JS library that is framework agnostic.

_Theming_

We have defined a theme using elements of the [Kadena Design System][3] and
these tokens should be used as property values in most cases to ensure
consistency and alignment with the design. With VE, we are also able to override
this theme within projects to add additional CSS variables or update colors for
a dark theme, for example.

_Atoms_

Sprinkles is an optional package built on top of VE that allows users to
generate a set of custom utility classes (similar to Tailwind). @kadena/react-ui
has setup `atoms` using the defined theme based on the [Kadena Design
System][3]. Whenever possible it is preferrable to use these utility classes and
avoid creating unnecessary custom classes using the `style` function to keep the
bundle size smaller and UI more consistent.

_Colors_

In our tokens we have color scales that represent a set of different shades for
a color as well as theme specific tokens that return different colors depending
on whether we are in light/dark theme.

The [Kadena Design System][3] setup the color tokens to have naming based on
application rather than the underlying color. Since not all colors are
applicable for different CSS properties, the `atoms` utility only provides a
subset of color options that would most commonly be used with the associated
property. In cases where consumers need access to other colors, the can still
access them through the exported `tokens`.

_Spacing_

The component library is composed of layout, primitive, and compound components.
Currently we have decided to only rely on layout components for positioning.
This means that we will not be exposing any display/spacing related props from
our primitive and compound components. All finalized components will accept a
className prop in case consumers need to add custom styling.

### Conclusion

Since we are still in early development stages, things are still in flux and
flexible to change. This is just a guideline that the team has discussed
together as a starting point, but any suggestions for change are welcome!

[1]: https://vanilla-extract.style
[2]: https://vanilla-extract.style/documentation/packages/sprinkles/
[3]: https://github.com/kadena-community/design-system
[4]: https://storybook.js.org/
[5]: https://vanilla-extract.style/documentation/integrations/next/
[6]: https://vanilla-extract.style/documentation/integrations/next/#setup
[7]: https://vanilla-extract.style/documentation/global-api/create-global-theme/
[8]: https://vanilla-extract.style/
