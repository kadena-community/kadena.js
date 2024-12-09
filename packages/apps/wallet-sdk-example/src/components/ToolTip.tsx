import { createPopper, Instance as PopperInstance } from '@popperjs/core';
import React, { useEffect, useRef, useState } from 'react';
import { tooltipContent } from './tooltip.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const referenceRef = useRef<HTMLSpanElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const popperInstanceRef = useRef<PopperInstance | null>(null);
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const showTooltip = () => {
    if (!hasShown) {
      setVisible(true);
      setHasShown(true);
    }
    if (popperInstanceRef.current) {
      popperInstanceRef.current.update();
    }
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (referenceRef.current && popperRef.current) {
      popperInstanceRef.current = createPopper(
        referenceRef.current,
        popperRef.current,
        {
          placement: 'auto',
          strategy: 'fixed',
          modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            {
              name: 'preventOverflow',
              options: { boundary: 'clippingParents' },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'right', 'bottom', 'left'],
              },
            },
          ],
        },
      );
    }

    return () => {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (visible && popperInstanceRef.current) {
      popperInstanceRef.current.update();
    }
  }, [visible]);

  return (
    <>
      <span
        ref={referenceRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      <div
        ref={popperRef}
        className={tooltipContent}
        style={{
          visibility: visible ? 'visible' : 'hidden',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
        role="tooltip"
      >
        {text}
      </div>
    </>
  );
};

export default Tooltip;
