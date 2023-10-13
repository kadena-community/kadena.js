export const keyboards = [
  'vim',
  'emacs',
  'sublime', // TODO: Not sure if this works
  'vscode', // TODO: Not sure if this works
  'ace',
] as const;
export type KeyboardHandler = (typeof keyboards)[number];
