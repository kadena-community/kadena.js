export const keyboards = ['vim', 'emacs', 'ace'] as const;
export type KeyboardHandler = (typeof keyboards)[number];

export const themes = ['monokai', 'one_dark'] as const;
export type Theme = (typeof themes)[number];

export const modes = ['lisp', 'clojure'] as const;
export type Mode = (typeof modes)[number];
