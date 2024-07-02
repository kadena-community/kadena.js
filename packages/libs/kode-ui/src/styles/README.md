# Utils within React UI

In order to make our lives easier we have created a few utilities within UI to
make styling, accessing tokens easier or just reducing boilerplate

## Functions

### style, styleVariants, recipe, globalStyles

To make sure that the components are expandable with custom styling, we applied
all styles onto a css layer. To reduce boilerplate and make sure that all styles
are being applied to the same layer we created wrapper functions to apply the
styles onto a layer without the need to manually add the layer. To make use of
these functions you can import the function from the styles folder. They have
the same names as the vanilla extract functions to keep a familiar API.

```ts
import { globalStyles, recipe, style, styleVariants } from '../styles';
```

### token(...)

```ts
token(path: TokenPath, fallback?: string): string
```

This functions helps with accessing the token path making it shorter and allows
you to pass a fallback in case the path is not matching.

The following example shows how the two would look if you wanted to do the same,
but the upside for the token method resides in the possibility of a second
parameter as fallback

```ts
boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
// vs
boxShadow: `0px 1px 0 0 ${tokens.kda.foundation.color.border.base.default}`,
```

### useAsyncFn(...)

```ts
useAsyncFn<T extends AsyncFn>(
  fn: T,
  deps: DependencyList = [],
  initialState: AsyncFnState<T> = { isLoading: false },
): AsyncFnReturn<T>
```

Just reduces the boilerplate when using async functions. Example can be found in
CopyButton.tsx

## Styling utils

### responsiveStyle(...)

We have the following list of breakpoints

```ts
breakpoints = {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
};
```

This functions enables to add specific styles specifiying a breakpoint, its best
illustrated in with an example

The usage is straight forward, but should be outside the atoms

```ts
style([
  atoms(...),
  {
    // maybe some more outside-atoms styles
    ...responsiveStyle({
      xs: {
        flex: '1',
        selectors: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      }
      md: {
        flexDirection: 'row',
      },
    }),
  }
]);
```

A few other useful functions that allow us to skip some boilerplate are:

## Animation utils

### useEnterAnimation(...)

```ts
useEnterAnimation(
  ref: RefObject<HTMLElement>,
  isReady: boolean = true,
): boolean
```

This function will help with detecting if the ref is entering an animation.
Example can be found in Popover.tsx

### useExitAnimation(...)

```ts
useExitAnimation(ref: RefObject<HTMLElement>, isOpen: boolean): boolean
```

This function will help with detecting if the ref is exiting an animation.
Example can be found in Popover.tsx

### useTheme(...)

```ts
useTheme(IUseThemeProps): IUseThemeReturnProps
```

A hook that will help setting the theme of a React application without the need
of a provider.  
It will keep the state in `localStorage`. A listener will keep of track of the
`localStorage`, so that if the theme changes, other browser instances will
change the theme as well.

As default it will look at the system theme.  
Available themes:

```ts
export enum Themes {
  system = 'system',
  light = 'light',
  dark = 'dark',
}
```

#### Lock Theme

Some applications just want to use 1 particular theme and not have the ability
to switch themes.

```ts
useTheme({ lockedTheme: Themes.light });
```

`lockedTheme` will lock the theme for the whole application. It will overwrite
the localstorage and even the switching of themes in your system will not update
the theme.  
**IMPORTANT:** using the `useTheme` twice in a application can lead to
unexpected race conditions.  
You would need to lock the theme on all the uses of this hook with the same
`ITheme`.

#### Overwrite theme

Sometimes it is needed to overwrite the theme for a particular component. You
can do this by setting the `overwriteTheme` prop.

```ts
useTheme({ overwriteTheme: Themes.light });
```

**IMPORTANT:** this will also overwrite the lockedTheme for that component. So
If you have set the `lockedTheme` to `dark`, this particular component will
still be `light` theme.
