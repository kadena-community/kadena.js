import { useEffect, useState } from 'react';

export const useTopScroll = () => {
  const [topScroll, setTopScroll] = useState<number>(0);

  useEffect(() => {
    const onScroll = (e: any) => {
      setTopScroll(e.target.documentElement.scrollTop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [topScroll]);

  return topScroll;
};
