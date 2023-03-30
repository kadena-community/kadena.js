import { Primitive } from '../typings';

export const convertStyles = (
  styles: Record<string, Primitive | Record<string, Primitive>>,
): Record<string, Primitive | Record<string, Primitive>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newStyles = {} as any;
  Object.keys(styles).forEach((key) => {
    const value = styles[key];
    if (value === undefined) return;

    if (typeof value === 'object') {
      return Object.keys(value).forEach((mediaQueryKey) => {
        if (newStyles['@' + mediaQueryKey] === undefined) {
          newStyles['@' + mediaQueryKey] = {};
        }
        newStyles['@' + mediaQueryKey][key] = value[mediaQueryKey];
      });
    }
    return (newStyles[key] = value);
  });

  return newStyles;
};
