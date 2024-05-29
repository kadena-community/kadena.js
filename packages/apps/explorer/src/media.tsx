import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
  breakpoints: {
    none: 0,
    xs: 480,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
});

// Make styles for injection into the header of the page
export const mediaStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
