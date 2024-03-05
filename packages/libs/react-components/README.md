# React Components

Component library of Kadena.

## Getting started

### Install

The component library is not yet published, to use it in an app outside of this
mono repo you first clone this repo and then reference this library from your
app.

```sh
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
pnpm install
cd libs/react-components
pnpm build
cd ~/your-app-root
```

Then in your package.json add:

```json
{
  "dependencies": {
    "@kadena/react-components": "link:../kadena.js/packages/libs/react-components"
  }
}
```

Then in your app init `stitches` with:

```tsx
import {
  getCssText,
  globalCss,
  baseGlobalStyles,
} from "@kadena/react-components";

const globalStyles = globalCss(baseGlobalStyles as Record<string, any>);

globalStyles();

...

export default function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html >
      <head>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Running storybook

You can start storybook after installing:

```
rushx storybook
```

## Component Library Guidelines

We would like to maintain a strict component library with opinionated styles and
isolated components that rely on wrapper or layout components for positioning.
The following is some information about how we have approached building our
components to maintain this goal.

### Styling

We are currently using Stitches as our CSS solution although we are looking into
other zero-runtime options like [vanilla-extract][1] and [Tailwind CSS][2].

_Theming_

We have defined a theme using elements of the Kadena Design System and these
tokens should be used as property values in most cases to ensure consistency and
alignment with the design. With stitches, we are also able to override this
theme within projects to add additional tokens or update colors for a dark
theme, for example.

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
ideal since visual cues can be lost. We have a task open for looking for a way
to create localized theme tokens to allow for more customization in these
circumstances

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

[1]: https://vanilla-extract.style/
[2]: https://tailwindcss.com/
