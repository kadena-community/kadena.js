import { toCanvas } from 'html-to-image';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { wrapperClass } from './style.css';

interface IProps {
  play: boolean;
  onEnd: () => void;
}

export const ScanAnimation: FC<IProps> = ({ play, onEnd }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const startAnimation = async () => {
    if (!canvasRef.current) return;
    const createdCanvas = await toCanvas(document.body);

    canvasRef.current.replaceChildren(createdCanvas);
    setIsMounted(true);

    //TODO: after the animation
    setTimeout(() => {
      onEnd();
    }, 2000);
  };
  useEffect(() => {
    if (!play) {
      console.log(111111111);
      setIsMounted(false);
      canvasRef.current?.replaceChildren();
      return;
    }
    startAnimation();
  }, [play]);

  return <div className={isMounted ? wrapperClass : ''} ref={canvasRef}></div>;
};
