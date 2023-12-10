import { useEffect, useState } from 'react';
export const useIsMatchingMediaQuery = (query: string) => {
  const [isMatchingMedia, setIsMatchingMedia] = useState(false);

  useEffect(() => {
    setIsMatchingMedia(window.matchMedia(query).matches);

    const handleResize = (e: {
      matches: boolean | ((prevState: boolean) => boolean);
    }) => {
      setIsMatchingMedia(e.matches);
    };

    const mediaQuery = window.matchMedia(query);

    mediaQuery.addEventListener('change', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return {
    isMatchingMedia,
  };
};
