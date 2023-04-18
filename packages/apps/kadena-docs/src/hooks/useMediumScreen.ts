import useMediaQuery from './useMediaQuery';

export const useMediumScreen = () => {
  return { hasMediumScreen: useMediaQuery('md') };
};
