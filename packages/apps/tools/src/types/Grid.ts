export type IGridColMediaType = string | number | IGridColMediaProps;

export interface IGridColMediaProps {
  size?: number | string;
  span?: number | string;
  offset?: number | string;
  pull?: number | string;
  push?: number | string;
  hidden?: boolean;
}
export interface IGridColMediaStyles {
  width?: string;
  flex?: string;
  marginLeft?: string;
  marginRight?: string;
  order?: string;
  display?: string;
}
