import React, { useEffect } from 'react';

/**
 * Saves the scroll location of the document
 */
export function useWindowScroll(): [
  {
    x: number;
    y: number;
  },
] {
  const [state, setState] = React.useState({
    x: 0,
    y: 0,
  });

  useEffect((): (() => void) => {
    const handleScroll = (): void => {
      setState({ x: window.scrollX, y: window.scrollY });
      console.log(window.scrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return [state];
}
