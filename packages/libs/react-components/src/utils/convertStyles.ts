import { Primitive } from '../typings';

export const convertStyles = (
  styles: Record<string, Primitive | Record<string, Primitive>>,
): Record<string, Primitive | Record<string, Primitive>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newStyles = {} as any;
  Object.entries(styles).forEach(([key, value]) => {
    if (value === undefined) return;

    if (typeof value === 'object') {
      return Object.keys(value).forEach((mediaQueryKey) => {
        if (newStyles['@' + mediaQueryKey] === undefined) {
          newStyles['@' + mediaQueryKey] = {};
        }

        const prop = styles[key];
        if (typeof prop === 'object') {
          newStyles['@' + mediaQueryKey][key] = prop[mediaQueryKey];
        }
      });
    }
    return (newStyles[key] = value);
  });

  return newStyles;
};
