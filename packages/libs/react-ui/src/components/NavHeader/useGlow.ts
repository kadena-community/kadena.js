'use client';

import { useRef, useState } from 'react';

interface IUseGlowReturn {
  animationDuration: number;
  glowRef: React.RefObject<HTMLDivElement>;
  navRef: React.RefObject<HTMLDivElement>;
  glowX: number;
  setGlowPosition: (targetBounds: DOMRect) => void;
}

const useGlow = (): IUseGlowReturn => {
  const glowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const [glowX, setGlowX] = useState(0);

  const prevGlowX = useRef<number>(glowX);

  const setGlowPosition = (targetBounds: DOMRect): void => {
    prevGlowX.current = glowX;

    const glowBounds = glowRef.current?.getBoundingClientRect();
    const headerBounds = navRef.current?.parentElement?.getBoundingClientRect();

    if (glowBounds && headerBounds) {
      const glowX =
        targetBounds.x -
        headerBounds.x -
        glowBounds.width / 2 +
        targetBounds.width / 2;
      setGlowX(glowX);
    }
  };

  return {
    animationDuration:
      glowX === 0 ? 0 : Math.abs(glowX - prevGlowX.current) * 2,
    glowRef,
    glowX,
    setGlowPosition,
    navRef,
  };
};

export default useGlow;
