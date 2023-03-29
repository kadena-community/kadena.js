import { IThemeBreakpointProps } from '../styles';

export type Primitive = number | string | boolean;
export type ICSSPropType =
  | Primitive
  | Partial<Record<IThemeBreakpointProps, Primitive>>;
