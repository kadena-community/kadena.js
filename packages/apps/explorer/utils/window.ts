import { useEffect, useState } from 'react';

export const hasWindow = typeof window !== 'undefined';

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize, {
      passive: true,
    });
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
