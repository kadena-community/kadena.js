---
'@kadena/react-ui': minor
---

Updated the `Tag` component to use new design tokens and incorporated `useTagGroup` from react-aria
- Added the `TagGroup` component which only implements the onRemove and disabledKeys config options from `useTagGroup`. 
- Added the `TagItem` component which wraps `Item` from react-stately
- Removed onClose prop from the `Tag` component so its primary purpose is for applying the tag styles
- Added the `tagAsChild` prop to allow consumers to place all accessibility attributes from `TagItem` to it's child component. An example use case would be when consumers need to use next/link as a tag

In most cases moving forward, consumers should use the `TagGroup` and `TagItem` components to compose their tags, however the `Tag` component is still exposed for when consumers need to compose their own custom component using the `Tag` styles
