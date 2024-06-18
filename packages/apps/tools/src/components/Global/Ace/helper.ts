export const keyboards = ['vim', 'emacs', 'ace'] as const;
export type KeyboardHandler = (typeof keyboards)[number];

export const themes = ['monokai', 'one_dark', 'github', 'github_dark'] as const;
export type Theme = (typeof themes)[number];

export const modes = ['lisp', 'clojure'] as const;
export type Mode = (typeof modes)[number];

export const editingModes = ['disabled', 'enabled'] as const;
export type EditingMode = (typeof editingModes)[number];
