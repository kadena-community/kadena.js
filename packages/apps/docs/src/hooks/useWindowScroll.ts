import React from 'react';

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

  React.useLayoutEffect((): (() => void) => {
    const handleScroll = (): void => {
      setState({ x: window.scrollX, y: window.scrollY });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return [state];
}
