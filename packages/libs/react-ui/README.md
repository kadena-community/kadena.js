# React UI

@kadena/react-ui is a library used to provide a styling environment and basic
React components for reuse in Kadena applications. It uses
[vanilla-extract/css](https://vanilla-extract.style) (will be referred to as VE)
to establish a system of utility classes (defined as sprinkles) and css
variables (defined in the theme) that align with Kadena's Design System and
exposes them so that they can be used with any project or framework. A basic
[Storybook](https://storybook.js.org/) integration has been implemented so that
users can preview components visually and interact with their configuration
options.

> Warning: This library is in its early development stage so elements in the
> styling environment may change as well as the API for components.
> Additionally, installation and compatibility has only been tested with Next.js
> projects within the Kadena.js monorepo.

## Getting started

Run the following commands to install dependencies and build the library:

```
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
cd packages/libs/react-ui
rush install
rushx build
```

Since this library uses VE and is not pre-bundled, the consuming project will
need to setup integration with VE. You can find integration instructions in the
[VE docs](https://vanilla-extract.style/documentation/integrations/next/).

### Integration with Next.js projects within Kadena.js

Add @kadena/react-ui as a dependency in your `package.json`:

```
{
  ...
  "dependencies": {
    "@kadena/react-ui": "workspace:*",
    ...
  }
}
```

Then run the following commands to install the package and update the monorepo's
state:

```
rush update
```

VE requires bundler configuration to handle CSS. To set this up in Next.js you
will need to install the following plugin:

```
rush add -p @vanilla-extract/next-plugin --dev
```

If you don’t have a next.config.js file in the root of your project, create one.
Add the plugin to your next.config.js file and add @kadena/react-ui to
transpilePackages:

```
const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/react-ui'],
};

module.exports = withVanillaExtract(nextConfig);
```

If required, this plugin can be composed with other plugins:

```
const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kadena/react-ui'],
};

module.exports = withVanillaExtract(withMDX(nextConfig));
```

After the plugin is setup, you should be able to use styling utilities exported
from @kadena/react-ui and components within your application.

### Dark Theme

We are utilizing the
[theming](https://vanilla-extract.style/documentation/global-api/create-global-theme/)
feature from VE to create CSS color variables that invert depending on the
selected theme. By default the theme will have colors suitable for light mode,
but to add dark theme integration you can export `darkThemeClass` from
@kadena/react-ui and use it with your theme provider.

You can use "next-themes" to set this up in Next.js projects by wrapping
`Component` with the `ThemeProvider` in `__app.tsx`

```
import { darkThemeClass } from '@kadena/react-ui';
import { ThemeProvider } from 'next-themes';

export const MyApp = ({ Component, pageProps }) {
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
> color selection to style dark mode within our applications

### Running Storybook

After installing dependencies, you can start Storybook with the following
command:

```
rushx storybook
```

### Installation outside of the Kadena.js monorepo

The component library is not yet published, to use it in an app outside of this
mono repo you first clone this repo and then reference this library from your
app.

```
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
cd packages/libs/react-ui
rush install
rushx build
cd ~/your-app-root
```

Add @kadena/react-ui as a dependency in your package.json:

```
{
  ...
  "dependencies": {
    "@kadena/react-ui": "link:../kadena.js/packages/libs/react-ui"
    ...
  }
}
```

Then, like other installations, you will need to follow the applicable
integration instructions for VE.

## UI Library Guidelines

We would like to maintain a strict component library with opinionated styles and
isolated components that rely on wrapper or layout components for positioning.
The following is some information about how we have approached building our
components to maintain this goal.

### Styling

We are currently using [vanilla-extract/css](https://vanilla-extract.style/) as
it is a zero-runtime CSS-in-JS library that is framework agnostic.

_Theming_

We have defined a theme using elements of the Kadena Design System and these
tokens should be used as property values in most cases to ensure consistency and
alignment with the design. With VE, we are also able to override this theme
within projects to add additional CSS variables or update colors for a dark
theme, for example.

_Sprinkles_

Sprinkles is an optional utility class built on top of VE that allows users to
generate a set of custom utility classes (similar to Tailwind). @kadena/react-ui
has setup sprinkles using the defined theme based on the Kadena Design System.
When possible it is preferrable to use these utility classes and avoid creating
unnecessary custom classes using the `style` function to keep the bundle
smaller.

_Colors_

In our theme we have color scales that represent a set of different shades for a
color as well as theme specific tokens that return different colors depending on
whether we are in light/dark theme.

Due to the strict nature of our component library, we should use our disgretion
to determine what subset of colors should be exposed for a certain component.
For example, a text component would likely only be used in a small subset of
colors on an interface - our approach to doing this would be to create a color
variant with named options that map to each of the colors options.

When it comes to dark theme, the default behavior when using theme specific
tokens will effectively be the inverse of the opposing theme. This is not always
ideal since visual cues can be lost. When using sprinkles, you can specify a
different color for dark vs light mode and when using the style function, you
can use a selector.

Since the development of this library is happening in parallel with the
development of our other products, the color sets are also still in flux. In
general you can expect each set of colors to have the following 4 options.
Example:

```
  primaryAccent: '#2997FF', // Vibrant
  primarySurface: '#C2E1FF', // Low contrast
  primaryContrast: '#00498F', // Contrast
  primaryHighContrast: '#002F5C', // High Contrast
```

If at any point you feel that you need more than these variations of a specific
color, reach out to Isa to discuss if it would be possible to simplify the
design to use these 4 colors before adding them to the color tokens.

_Spacing_

The component library is composed of layout, primitive, and composed components.
Currently we have decided to only rely on layout components for positioning.
This means that we will not be exposing any display/spacing related props from
our primitive and composed components.

### Conclusion

Since we are still in early development stages, things are still in flux and
flexible to change. This is just a guideline that the team has discussed
together as a starting point, but any suggestions for change are welcome!
