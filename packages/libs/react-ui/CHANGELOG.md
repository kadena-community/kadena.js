# @kadena/react-ui

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
