---
'@kadena/react-ui': minor
---

New aria complete button without new tokens
  1. Use react aria which come with one major change is `onPress` instead of `onClick` read more about why https://react-spectrum.adobe.com/blog/building-a-button-part-1.html. we added `onClick` to allow easy migration but it is deprecated and we should not use it for new code.
  2. Unify the `IconButton` and `Button` components using `<Button icon={<SomeIcon/>} />` instead of `IconButton`.
  3. Change some props names to be consistent with react-aria naming `compact` -> `isCompact`.
  4. `Button` is not a polymorphic component anymore we will have a separate link component.
  5. `iconAlign` is replaced by specific icon renders props `startIcon` and `endIcon`, and `icon` is repurposed for icon-only buttons aka `IconButton`.
  6. Use `recipe` instead of individual `styleVariants`. 
  7. `color` and `variant` are now one prop `variant` and all `alternative` variants are added as a standalone variant eg `<Button color="primary" variant="alternative" />` is now `<Button variant="primaryInverted" />` we use `inverted` postfix is used instead of  `alternative` to match the intended color inversion behavior.
  8. The `isCompact` variant now works for all button variations before it only worked for some color variants.
