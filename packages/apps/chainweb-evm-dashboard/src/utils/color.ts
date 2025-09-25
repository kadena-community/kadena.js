import Color from 'colorjs.io'

export const convertColorToBackgroundSubtleColor = (colorString: string, amount = 0.3, isDarkMode: boolean) => {
  const color = new Color(colorString).to("oklch");

  if (isDarkMode) {
    color.l = Math.max(0, color.l - amount);

    if (color.l === 0) {
      color.l = Math.min(1, color.l + (amount - 0.28));
    }

    return color.to("srgb").toString({ format: "hex" });
  }

  color.l = Math.min(1, color.l + amount);

  if (color.l === 1) {
    color.l = Math.max(0, color.l - (amount - 0.28));
  }

  return color.to("srgb").toString({ format: "hex" });
}

export const createGradient = ({
  color,
  from,
  to,
  direction = 'to bottom'
}: {
  color?: string;
  from?: string;
  to?: string;
  direction?: string;
}) => {
  if (color) return color;
  if (!from || !to) return '';
  if (from === to) return from;
  if (from === 'color') from = color;
  if (to === 'color') to = color;

  return `linear-gradient(${direction}, ${from}, ${to})`;
}
