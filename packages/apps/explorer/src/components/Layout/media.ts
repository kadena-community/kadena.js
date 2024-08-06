import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
  breakpoints: {
    none: 0,
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
  },
});

export const { Media, MediaContextProvider } = AppMedia;
