'use client';

import { useRef, useState, useEffect } from 'react';

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
  const glowAnimationSpeed = useRef<number>(0);

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

  glowAnimationSpeed.current =
    glowX === 0 ? 0 : Math.abs(glowX - prevGlowX.current) * 2;

  return {
    animationDuration: glowAnimationSpeed.current,
    glowRef,
    glowX,
    setGlowPosition,
    navRef,
  };
};

export default useGlow;
