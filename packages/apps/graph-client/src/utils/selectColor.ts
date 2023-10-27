import { theme } from '@styles/stitches.config';

export function selectColor(chainId: number, level: number = 11): string {
  return theme.colors[
    `${selectScale(chainId)}${level || 7}` as keyof typeof theme.colors
  ].value;
}

function selectScale(chainId: number): string {
  switch (chainId) {
    case 0:
    case 1:
      return 'crimson';
    case 2:
    case 3:
      return 'pink';
    case 4:
    case 5:
      return 'plum';
    case 6:
    case 7:
      return 'purple';
    case 8:
    case 9:
      return 'violet';
    case 10:
    case 11:
      return 'indigo';
    case 12:
    case 13:
      return 'blue';
    case 14:
    case 15:
      return 'cyan';
    case 16:
    case 17:
      return 'teal';
    case 18:
    case 19:
      return 'green';
    default:
      return 'mauve';
  }
}
