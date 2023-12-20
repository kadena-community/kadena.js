# @kadena/react-ui

## 0.6.0

### Minor Changes

- 269e3bd66: Added changes in the NavHeader component to improve visibility on
  mobile
- f2312a16c: Updated the Notification, Card, Divider, Tooltip, Dialog, Modal,
  and GradientText components to use the updated design tokens
- 52664959c: New aria complete button without new tokens
  1. Use react aria which come with one major change is `onPress` instead of
     `onClick` read more about why
     https://react-spectrum.adobe.com/blog/building-a-button-part-1.html. we
     added `onClick` to allow easy migration but it is deprecated and we should
     not use it for new code.
  2. Unify the `IconButton` and `Button` components using
     `<Button icon={<SomeIcon/>} />` instead of `IconButton`.
  3. Change some props names to be consistent with react-aria naming `compact`
     -> `isCompact`.
  4. `Button` is not a polymorphic component anymore we will have a separate
     link component.
  5. `iconAlign` is replaced by specific icon renders props `startIcon` and
     `endIcon`, and `icon` is repurposed for icon-only buttons aka `IconButton`.
  6. Use `recipe` instead of individual `styleVariants`.
  7. `color` and `variant` are now one prop `variant` and all `alternative`
     variants are added as a standalone variant eg
     `<Button color="primary" variant="alternative" />` is now
     `<Button variant="primaryInverted" />` we use `inverted` postfix is used
     instead of `alternative` to match the intended color inversion behavior.
  8. The `isCompact` variant now works for all button variations before it only
     worked for some color variants.
- 5a71173a8: Update design tokens
- d1f705b4d: Added atoms which are utility css classes based on the new design
  tokens

### Patch Changes

- 5cf64e17c: Changed icon to startIcon for form components
- 6d30efacd: Update `Text` and `Heading` components to use new design tokens

## 0.5.0

### Minor Changes

- a7bb78d8b: Updated the Notification component API
- 957af9922: Used react-aria to recreate the `Dialog` and `Modal` components
- bf490445c: Setup design tokens sync
- 854604595: Updated the Tooltip component API and styles
- a30106c85: Refactored Tabs component
- 5250be30b: Added TextareaCopy and InputCopy
- d9109f3ba: Removing the Label component
- 4b8b728dd: Updated the Card component's styles and removed the `stacked` prop.
  Users can add the Divider component within a Card to achieve the same result
  as using the deprecated `stacked` prop.

### Patch Changes

- 6992a2b58: Added Icons for C: & W: accounts

## 0.4.0

### Minor Changes

- 49d8366c7: Refactor InputFieldWrapper for the new FormFieldWrapper component
  with stacked items

## 0.3.1

### Patch Changes

- 6f79f73dd: Added overflow prop to the Box, Stack, and Grid components
- 6f79f73dd: Added focus state and improved visuals for inputs

## 0.3.0

### Minor Changes

- 11747cde4: Exported the Textarea and TextareaField components
- 8a719c647: Add new width, height, and className properties to sprinkles and
  update Box, Stack and Grid components to use them
- df7044cac: Corrected `Tag` background color Extracted `maskValue` string
  utility function from `MaskedValue` component Accept ReactNode as `children`
  prop for `Tag` component

### Patch Changes

- 6491589b5: Exported MaskOptions type

## 0.2.1

### Patch Changes

- fa98adaa8: Fixed the KodeMono font
- fa6b84e22: No auto-globals for vitest specs

## 0.2.0

### Minor Changes

- 97f19a48b: Cleanup of duplicates, unused code and exports etc
- c0e9f781c: New Button component variants and colours
- 3572d7cdd: Add ThumbUp and Thumbdown Icon Add close callback event for Modal
  component Add active state variant and ui for IconButton component Update
  Button default style as inline and added block props for full width
- b4547a5ab: Introduced Accordion variant for navigational purposes
- 8374fc752: Renamed the ProfileCard component to ProfileSummary and refactored
  it to use a subcomponent structure
- 27a0996a0: Updated the NavHeader component to accept an activeHref instead of
  index and refactored the implementation to use context instead of cloneElement
- 66981b4f2: Added outline prop to select input
- 6cf0c27e5: Added variant and inline props to Notification component
- cf3b8aa86: Updated leftIcon prop to icon
- f31e96dbf: Added exports for the SelectField component
- c371666c4: Aligned Button and IconButton components to have variants and
  active prop
- aae405956: Added responsiveStyle and mapToProperty styling utility functions
- 659fff8c5: change the twitter icon to X
- 80c680d2c: Add max-width to notification content
- 251e5165c: Added the TextArea and TextAreaField components

### Patch Changes

- 5b8161d66: Minor fixes to Modal, Notification component
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- 49a9956fa: Migrate from jest to vitest

## 0.1.0

### Minor Changes

- e8780f4c: Updated all components to consistently accept a string for icon
  props
- 17230731: Initial package setup
- 9ef42410: Updated the NavHeader and NavFooter Link components to accept an
  asChild prop so that they can be used with external links
- a0bdef5c: Refactor Accordion component to use a subcomponent structure
- 14b81501: Updated the Link and Breadcrumb components to have the option to
  pass props and styles to a child component via an asChild prop. This is the
  new convention we are using for cases when we need to support external links
  like next/link
- 3e53006e: Added SelectField component
