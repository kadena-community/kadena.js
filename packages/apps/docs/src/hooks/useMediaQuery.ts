import { media } from '@kadena/react-components';

import { useEffect, useState } from 'react';

export const useMediaQuery = (queryName: keyof typeof media): boolean => {
  const query = media[queryName];
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const handleChange = (): void => {
      setMatches(getMatches(query));
    };

    const matchMedia = window.matchMedia(query);
    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
