---
'@kadena/graph-client': minor
---

Prepare `type Guard` for `interface InterfaceGuard` to support all guard types

Instead of using a `union Guard = { ... } | { ... }` we've opted to use an
interface that dictates that every Guard has to provide a
`keys: string[], predicate: string` property. For all guards except
`KeysetGuard` this will be an empty array `keys = []` or empty string
`predicate = ""`.

This way we don't break the current signature. The `Guard`s properties `keys`
and `predicate` are now `@deprecated` and will be removed in the next major
version.

DEPRECATION NOTICE: The `keys` and `predicate` properties of the generic `Guard`
type. Use `guard { ... on KeysetGuard { keys predicate } }` instead.
