# @kadena/react-ui

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
