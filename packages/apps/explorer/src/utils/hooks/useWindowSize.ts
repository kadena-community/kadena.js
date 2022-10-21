import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize, {
      passive: true,
    });
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
