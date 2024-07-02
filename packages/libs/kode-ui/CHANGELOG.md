# @kadena/kode-ui

## 0.12.2

### Patch Changes

- df0a2e823: Minimal width Form field elements fixed and Form field label
  orientation enhanced with the direction to flow horizontally or vertically
- 311d0bf44: fix the width issue from tables

## 0.12.1

### Patch Changes

- 16f0b17ed: fix the grid styles which were being applied to a layer while the
  base styling was being applied via atoms, all styles aren't applied on a layer
  for layout components
- 4dc02eec8: Added documentation for useTheme hook
- db77beba0: fix: make the icon on the text link component optional
- c0a6ffde5: fix: prevent icons from scaling down in size when their parent
  container shrinks in size
- 7ee91269f: fix: make custom styling functions to add the default layer and
  remove usage of the atoms function to style components
- 5b95decb2: fix styling errors caused by missing tokens references from the
  styling refactor
- 6d9900ef8: add contained prop to tabs component, this will make the content
  the same color as the tab

## 0.12.0

### Minor Changes

- 63bdbcb: Add: rebranded table and card components

### Patch Changes

- 15a492c: Icon token set

## 0.11.0

### Minor Changes

- 6a969ebdc: Add radiogroup component
- e648c32fa: - Reintroduced `items` prop for Tabs component to offer Dynamic
  collection support.
  - Added `tabPanelClassName` prop to Tabs component to forward styles to
    TabPanel component.
  - Added export of ITabNode type.

### Patch Changes

- b541021f4: Readme update

## 0.10.0

### Minor Changes

- cfb7c5bab: Added a hook to toggle and keep theme state, removing the necessity
  of a theme provider context
- a415d7995: Added a new variant to apply different colors to the Divider
  component

### Patch Changes

- 020be02d7: Add checkboxgroup component
- 9d7545ae0: Add indication arrow and add an compact version of the tooltip
- f045afe82: Update border and radius based on layout
- dac1b28ca: Update border styles for the Notification component
- 3805b414e: Added stable status to ui components
- 8e2a29721: Token sync
- 864329d3e: Adds story for new System icons
- 076f0980f: Fixed the accessibility issues (font-weight and color) related to
  the badge
- 9cb50ea42: added the high contrast variant and fixed the inline spacing for
  the large variant
- 49fb38853: Add new checkbox component
- 07ec9691c: Add new tabs component style and added the pagination option
- b0b05ca86: Updated sync plugin and tokens

## 0.9.0

### Minor Changes

- 07c2e666c: Adds base text link component
- 0d18ab81c: Replace old icons for new branding

### Patch Changes

- b06929dcc: Added proper sizes for the dialog
- f3b72d63d: Update the textfield and numberfield components to the new branding
- 93bf55b07: Package updates
- 2be7eaedc: Use new brand icons
- eafc7b0b1: feat: update textarea component to new styling
- 1cd747fdd: Refactor button component to match new styles and replace component
  throughout the mono repo
- 134666df3: update style notification
- 9865ea759: In this PR the combobox is using the internal field component which
  will update the styles to the new standard
- 145268647: added extra color variants to the badge'
- 5cf752eed: feat: updated the select component with the new styling updates.
  These include new size variants, font variants and consistent states like the
  other form elements. Breaking change: startIcon has been renamed to
  startVisual to be consistent with other components.
- Updated dependencies \[93bf55b07]
  - @kadena/kode-icons\@0.0.3

## 0.8.4

### Patch Changes

- b316674811: Added Avatar component waiting for final tokens
- fa60f7fd9: Fixed Popover not rendering when element was bigger than viewport
- 6aac4b623: Upgrading deps
- 5a304c326: Update input for icons to reactElement
- 8bb3168818: fix: use new text and header components from react-ui package
- 5c5937eef6: Update tokens

## 0.8.3

### Patch Changes

- 25de564cd: Add expand animation to accordion component

## 0.8.2

### Patch Changes

- 550e6d9e4: Extended clickable area for the numberField buttons

## 0.8.1

### Patch Changes

- cce6c38de: Added more masking options to the MaskedValue component
- 1aa8bfa8d: Remove accordion animation

## 0.8.0

### Minor Changes

- 52200486f: Adds NumberField component to the form section

### Patch Changes

- bc5ff9ab1: Updated the Pagination component to use the new Button component
  styles and new tokens
- 817eff027: Export progressCircle
- 5a52cd69b: Updated the NavHeader component export structure, components, and
  styles
- eb12b600e: Aria accordion component

## 0.7.1

### Patch Changes

- b6a44c813: Update Repository information to enable provenance

## 0.7.0

### Minor Changes

- a4b469d49: Updated the `Tag` component to use new design tokens and
  incorporated `useTagGroup` from react-aria

  - Added the `TagGroup` component which only implements the onRemove and
    disabledKeys config options from `useTagGroup`.
  - Added the `TagItem` component which wraps `Item` from react-stately
  - Removed onClose prop from the `Tag` component so its primary purpose is for
    applying the tag styles
  - Added the `tagAsChild` prop to allow consumers to place all accessibility
    attributes from `TagItem` to it's child component. An example use case would
    be when consumers need to use next/link as a tag

  In most cases moving forward, consumers should use the `TagGroup` and
  `TagItem` components to compose their tags, however the `Tag` component is
  still exposed for when consumers need to compose their own custom component
  using the `Tag` styles

- 803668c21: Updated the Breadcrumbs component to use `useBreadcrumbs` from
  react-aria

- 3e940f62e: New form fields

- b8f8fb55e: Fix logo sizes

- bc071367c: Cleanup old Button and Link components

- fc92629b5: Updated the Box, Stack, and Grid components props to map to the new
  atom utility classes

- 5516b2467: New brand logos

- 0dc7a52b7: Updated the Box, Stack, and Grid components to accept refs

- 5e63b76a6: Updated input props for SelectField, TextareaField and TextField
  components and deprecated Input Select and Textarea in favour of the updated
  ones

- db097d39b: Breadcrumbs accepts an icon element to be rendered and exposed the
  components in order to compose.

- 90227d348: Use new button tokens and add small tokens utils

- e10423358: updated NavHeader glow initial position and scroll

- 9d3aab7c8: Add LinkButton component

- 58ed2adfa: Improve react ui build system and remove ts path aliases

### Patch Changes

- 940891ac6: Used new token system
- 13e2cc6a3: Add zIndex to Tooltip component
- 1ed317352: Updat turbo file to cache new build artifacts
- bd357be45: Update Select and Combobox styles
- 47e3ac2a9: Allow className on Table components

## 0.6.0

### Minor Changes

- 269e3bd66: Added changes in the NavHeader component to improve visibility on
  mobile
- f2312a16c: Updated the Notification, Card, Divider, Tooltip, Dialog, Modal,
  and GradientText components to use the updated design tokens
- 52664959c: New aria complete button without new tokens
  1. Use react aria which come with one major change is `onPress` instead of
     `onClick` read more about why
     [https://react-spectrum.adobe.com/blog/building-a-button-part-1.html][1].
     we added `onClick` to allow easy migration but it is deprecated and we
     should not use it for new code.
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

[1]: https://react-spectrum.adobe.com/blog/building-a-button-part-1.html
