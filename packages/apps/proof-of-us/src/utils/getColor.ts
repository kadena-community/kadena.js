const TRANSPARENT = '6B';
const colors = [
  '#ff0000',
  '#ffc700',
  '#2898BD',
  '#5E4DB2',
  '#E56910',
  '#943D73',
  '#09326C',
  '#8F7EE7',
  '#50253F',
  '#A54800',
];
export const getColor = (idx: number) => {
  return colors[idx % colors.length] + TRANSPARENT;
};

export const getColorStyle = (idx: number) => {
  return {
    '--bulletColor': getColor(idx),
  } as any;
};
