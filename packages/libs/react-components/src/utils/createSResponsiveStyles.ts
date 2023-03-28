import {
  IGridContainerStylesReturned,
  IStyleBreakpointProps,
  IThemeBreakpointProps,
} from '../typings';

const getMediaQueryKey = (
  key: IThemeBreakpointProps,
): IStyleBreakpointProps => {
  return `@${key}`;
};

const addResponsiveStyles = (
  styles: any,
  propStyles: any,
  key: any,
  mediaQueryKey: IThemeBreakpointProps,
) => {
  if (styles[getMediaQueryKey(mediaQueryKey)] === undefined) {
    styles[getMediaQueryKey(mediaQueryKey)] = {};
  }

  styles[getMediaQueryKey(mediaQueryKey)][key] = propStyles[key][mediaQueryKey];
};

export const createSResponsiveStyles = <T extends {}>(styles: T) => {
  const newStyles = {};

  //   Object.entries(styles).forEach(([key, value]) => {
  //     console.log({ key, value });

  //     if (value === undefined) return;

  //     if (typeof value === 'object') {
  //       console.log({ value });
  //       return Object.keys(value).forEach(
  //         (mediaQueryKey: IThemeBreakpointProps) => {
  //           addResponsiveStyles(newStyles, styles, key, mediaQueryKey);
  //         },
  //       );
  //     }
  //     return (newStyles[key] = value);
  //   });

  //   console.log({ newStyles });
  return newStyles;
};
