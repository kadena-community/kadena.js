import {IGridColMediaStyles, IGridColMediaType} from "@/types/Grid";

const getPropInPercentage = (prop: number | string): string => {
  const value = typeof prop === "string" ? parseInt(prop) : prop;
  return `${(value / 12) * 100}%`
};

export const getColumnStyles = (prop: IGridColMediaType): IGridColMediaStyles => {
  if (typeof prop === 'string') {
    return {
      width: getPropInPercentage(parseInt(prop)),
    };
  }

  if (typeof prop === 'number') {
    return {
      width: getPropInPercentage(prop),
    };
  }

  const { size, span, offset, pull, push, hidden } = prop;
  const styles: IGridColMediaStyles = {};

  if(size)  styles.width = getPropInPercentage(size).toString();
  if(span)  styles.flex = `0 0 ${getPropInPercentage(span)}`;
  if(offset)  styles.marginLeft = getPropInPercentage(offset).toString();
  if(push)  styles.marginRight = getPropInPercentage(push).toString();
  if(pull)  styles.order = pull.toString();
  if(hidden !== undefined)  styles.display = hidden ? 'none' : "unset";

  return styles
};
