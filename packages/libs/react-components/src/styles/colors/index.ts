// TODO: Update to match design system
// eslint-disable-next-line @kadena-dev/typedef-var
export const colors = {
  background: 'Gainsboro',
  fontColor: 'Gainsboro',
  gray500: 'DarkSlateGray',
  blue500: 'SteelBlue',
  purple500: 'RebeccaPurple',
  green500: 'DarkGreen',
  red500: 'DarkRed',
} as const;

export type IThemeColors = `$${keyof typeof colors}`;

export const colorsDark: Record<string, string> = {
  background: 'DarkSlateGray',
  fontColor: 'DarkSlateGray',
  gray500: 'Gainsboro',
  blue500: 'PaleTurquoise',
  purple500: 'Lavender',
  green500: 'PaleGreen',
  red500: 'LightCoral',
};
