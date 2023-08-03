import { useState, useRef, useEffect } from 'react';

interface IUseGlowReturn {
  glowX: number;
  prevGlowX: number;
  activeNav: number;
  setActiveNav: React.Dispatch<React.SetStateAction<number>>;
  glowRef: React.RefObject<HTMLDivElement>;
  headerRef: React.RefObject<HTMLHeadElement>;
  navRef: React.RefObject<HTMLDivElement>;
}

const useGlow = (): IUseGlowReturn => {
  const glowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const [glowX, setGlowX] = useState(0);
  const [activeNav, setActiveNav] = useState(0);
  const prevGlowX = useRef<number>(glowX);

  useEffect(() => {
    const activeNavElement = navRef.current?.querySelector(
      `li:nth-child(${activeNav}) a`,
    );
    const activeNavBounds = activeNavElement?.getBoundingClientRect();
    const glowBounds = glowRef.current?.getBoundingClientRect();
    const headerBounds = headerRef.current?.getBoundingClientRect();

    const noActiveNav = activeNav === 0;

    if (noActiveNav && glowBounds) setGlowX(-glowBounds.width / 2);
    else if (activeNavBounds && glowBounds && headerBounds)
      setGlowX(
        activeNavBounds.x -
          headerBounds.x -
          glowBounds.width / 2 +
          activeNavBounds.width / 2,
      );
  }, [glowX, activeNav]);

  useEffect(() => {
    prevGlowX.current = glowX;
  }, [glowX]);

  return {
    glowX,
    prevGlowX: prevGlowX.current,
    activeNav,
    setActiveNav,
    glowRef,
    headerRef,
    navRef,
  };
};

export default useGlow;
