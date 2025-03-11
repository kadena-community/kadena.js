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

// this is a fix for the approuter nextjs
// https://github.com/artsy/fresnel/tree/main/examples/nextjs/app-router
export const mediaProviderStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
