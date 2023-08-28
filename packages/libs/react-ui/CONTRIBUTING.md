# Contributing to @kadena/react-ui

This is an aggregation of the conventions that we have picked up while
developing this component library. This library is still in its early stages of
development so please make any suggestions if you see ways it can be improved!

## Component Conventions

### Component Structure

We have had discussions around whether we want to use composition or
configuration as the pattern for developing components and have decided that
**in most cases we want to use composition, but it differs on a case by case
basis**. [Composition over Configuration][1]

#### Composition - Subcomponent structure

Composition makes sense if the component is more complex and needs a bit more
flexibility in regards to data, children, or layout. Components using this
pattern will export one object of subcomponents that will make up the building
blocks for the entire component. These subcomponents will always export one
`Root` component as the containing component. This is inspired by [Radix
Primitives][2].

A simple example of a component that should use this pattern is the Grid
component.

```jsx
<Grid.Root>
  <Grid.Item>{item1}</Grid.Item>
  <Grid.Item>{item2}</Grid.Item>
  <Grid.Item>{item3}</Grid.Item>
</Grid.Root>
```

The reason we opted for this approach when it comes to more complex components
is because this allows us to keep our components more flexible by providing
styled building blocks that users can freely position based on their own unique
logic. It allows us to keep complexity outside of our component logic so we
don't need to make exceptions or combinations based on prop configuration.

#### Configuration - Configuring via props

This approach makes sense when developing simpler components. So in cases of any
`atom` or `molecule`<sup>\*</sup> sized components (ex. Box, Text, Button),
often times using the subcomponent approach isn't necessary because the
different iterations of how that component will look are limited and introducing
more subcomponents would negatively affect DX.

> <sup>\*</sup> These terms come from the Atomic Design methodology. If you're
> unfamiliar with this, you can read more about it
> [here](https://bradfrost.com/blog/post/atomic-web-design/) and
> [here](https://atomicdesign.bradfrost.com/chapter-2/).

One example of a component that we updated from the Composition to Configuration
approach was the `Button` component.

Previously when the `Button` was used with an icon, it needed to be composed
like this:

```jsx
<Button.Root>
  Label
  <Button.Icon />
</Button.Root>
```

The reason we went for this approach originally was because it matched the
pattern of the other components, however in usage it caused confusion becuase:

- It often didn't have an icon, but we still needed to use the `Root` export
- Users didn't realize the `Button` component exported it's own `Button.Icon` so
  they would use other Icon components
- It also allows for too much flexibility in terms of what can be placed within
  the button when it should only ever have text and optionally, an icon or
  loading state.

Now, it has been updated with the configuration approach and can be used in the
following way:

```jsonc
<Button icon="someIcon" iconAlign="right" loading={false}>Label</Button>
```

This keeps the `Button` API cleaner, especially when only a label is provided,
and allows us to maintain control of the layout of items within the button while
not introducing too much complexity that is hard to maintain becuase there are a
fixed number of variations.

### External Elements/Components

This library exports prestyled components that are meant to make building UIs at
Kadena easier, but they will often be used in conjunction with native html
elements or components that are unique to the consuming project. In cases when
using layout components we offer full flexiblity in what can be passed as child
components, however, with most other components we try to provide all
subcomponents necessary to compose an entire `organism` and **avoid using
external elements in our component compositions**.

For example, the `NavHeader` component exports all of the subcomponents
necessary to create the whole Navigation Header. This includes elements like
links and buttons because we want to provide a styled version of these elements
that is specific to the `organism` it is composing. This also helps to improve
maintainibility of component styling which is enforced via
[vanilla-extract/css][3] and will be explained in more detail in the Styling
section.

> NOTE: One exception to this is the usage of Next/Link. We are looking into
> finding a consitent way to handle links that need to use the Next/Link
> component and other such cases.

### Typing

Guidlines for defining types:

- Be as strict as possible, within the limits of the component's intended use.
- Never use `any` or `unknown` unless absolutely necessary.
- Use `unknown` over `any` if you're not sure what type something is.
- Only type the children prop as `ReactNode` if you don't know what type it will
  be or you wish to explicitly allow any children (e.g. it's up to the consumer
  to decide what to render).
- Use `FunctionComponentElement` or whatever type is applicable when you want to
  restrict what children can be passed to component.
- In most cases you should use interfaces to type component props and objects.
- All interfaces should be prefixed with I - e.g. `IObject`
- In other cases you can use type which should be suffixed with `Type` - e.g.
  `SomethingType`
- All component proptypes should be implemented as interfaces and be prefixed
  with `I` and suffixed with `Props` - e.g. `IComponentProps`.

### Property Naming Convention

- Actions should be prefixed with `on` - e.g. `onClick` or `onHover`
- All boolean props should be named like an adjective to describe the
  Component - `disabled`, `stacked`, `fullWidth` Card

### Controlled - Components with state

Some components will require state to be able to function, in these cases we
should **offer a controlled and uncontrolled version**. For example, the
`Pagination` component can be uncontrolled in the sense that it handles it's own
state (which page you are on) when clicking arrows, but it also accepts an
optional `currentPage` prop which allows the user to control it's state.

This means these components should always have two optional props:

- Value that is being controlled
- Initial value (for when it is not controlled). This prop should always be
  prefixed with `default` - e.g. `initialPage`

### Custom Styling

Since this component library was created for usage within Kadena, the components
are very opinionated in terms of functionality and style. For this reason, we
wanted to be very strict with props and styling so **components currently do not
accept a classname prop to alter styles**. Layout components (Box, Stack, Grid)
should be used when positioning the components and any additional style changes
cannot be applied for the sake of visual consistency. If a new style/iteration
is needed, we can discuss adding this with a designer.

> NOTE: We are starting off strict, but if necessary, we can reassess whether or
> not we want to start accepting additional styles

### Storybook, Chromatic, & Testing

We are required to create a story in storybook that showcases all functionality
for each component. We would also like to include a description for the
component and it's props. This automatically gets synced with chromatic so that
we have also have regression testing. For visual related testing, this is going
to be sufficient for most components.

> TIP: import component from @components/... in stories to check that you are
> adding new components to the components barrel file

#### Unit Tests

In some cases, there will be utility functions or additional complex logic that
you may want to test without chromatic. In these cases you can use unit tests
with Jest.

### File structure and naming naming conventions

- Always have a barrel file for every directory (every component should have an
  index.ts file)
- CSS files should be named after the component that consumes them (e.g.
  `Button.css.ts`)

### Exports

- Never export default from a file (storybook files are an exception)
- Always export component props with every component
- Always have a barrel file to export the component and props

### React Client/Server components

React has the concept of [client and server components][4] which give you the
ability to chose where to render components based on their purpose. In essence,
server components allow you to move server related tasks like data fetching and
large dependencies into components that are only rendered on the server. Client
components can then be used to add interactivity to the client. This reduces the
client-side bundle size and improves overall performance.

In [Next.js][5], which is the framework most commonly used at Kadena, components
are considered server components by default. This means that **we have to
indicate when components need to be rendered client-side and should be treated
as client components**. To do this we need to add the following to the top of
any client component files:

```jsx
'use client';
```

> NOTE: Next.js provides a [table that summarizes the use cases for server and
> client components.][6]

## Styling with Vanilla Extract

Guidlines when styling with VE:

- Classnames should use camel-casing and always have `Class` suffix -
  `containerClass`
- You should use sprinkles whenever possible since these are predefined utility
  class. If a style value that you think is commonly used is not available as a
  sprinkle, feel free to add it.
- If you want to create multiple variations of a components style, use variants.
  Variants should have a `Variant` suffix - `colorVariant`

### Selectors

Simple Pseudo Selectors and complex selectors can be used on components, but
**styles can only be applied to the element that the class is applied to**. This
is a deliberate restriction set by VE to help with maintainability. If you need
to apply a style to a child element depending on the state of a parent element,
you can target a class on the parent element from the child and apply styles via
a [complex selector][7]

It should be avoided when possible, but if you need to target child nodes within
the current element, you can use `globalStyle`. In some cases it isn't
necessary, but it does improve code quality/maintainability, so use your
discretion when deciding what methods to use.

[1]:
  https://dev.to/anuradha9712/configuration-vs-composition-design-reusable-components-5h1f
[2]: https://www.radix-ui.com/primitives
[3]: https://vanilla-extract.style/
[4]: https://nextjs.org/docs/getting-started/react-essentials#server-components
[5]: https://nextjs.org/
[6]:
  https://nextjs.org/docs/getting-started/react-essentials#when-to-use-server-and-client-components
[7]: https://vanilla-extract.style/documentation/styling#complex-selectors
