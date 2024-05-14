import {
  MonoArrowBackIosNew,
  MonoArrowForwardIos,
} from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { ReactElement, RefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
import { hiddenClass, paginationButton, tabListControls } from './Tabs.css';
import { calculateScroll } from './utils/calculateScroll';

interface ITabsPaginationProps {
  children: ReactElement;
  wrapperContainerRef: RefObject<HTMLDivElement>;
  scrollContainerRef: RefObject<HTMLDivElement>;
}

export const TabsPagination = ({
  children,
  wrapperContainerRef,
  scrollContainerRef,
}: ITabsPaginationProps) => {
  const [visibleButtons, setVisibleButtons] = useState({
    left: false,
    right: false,
  });

  const determineButtonVisibility = () => {
    if (!scrollContainerRef.current || !wrapperContainerRef.current) return;

    const viewWidth = wrapperContainerRef.current.offsetWidth;
    const maxWidth = wrapperContainerRef.current.scrollWidth;
    const scrollPosition = scrollContainerRef.current.scrollLeft;

    if (scrollPosition === 0) {
      setVisibleButtons((prev) => ({ ...prev, left: false }));
    }
    if (scrollPosition > 0) {
      setVisibleButtons((prev) => ({ ...prev, left: true }));
    }
    // 20 is a margin to prevent having a very small last bit to scroll
    if (viewWidth + scrollPosition >= maxWidth - 20) {
      setVisibleButtons((prev) => ({ ...prev, right: false }));
    } else {
      setVisibleButtons((prev) => ({ ...prev, right: true }));
    }
  };

  const handlePagination = (direction: 'back' | 'forward') => {
    if (!wrapperContainerRef.current || !scrollContainerRef.current) return;

    const nextValue = calculateScroll(
      direction,
      wrapperContainerRef,
      scrollContainerRef,
    );

    scrollContainerRef.current.scrollLeft = nextValue;
    determineButtonVisibility();
  };

  useEffect(() => {
    // Initial check
    determineButtonVisibility();

    window.addEventListener('resize', () => determineButtonVisibility());

    return () =>
      window.removeEventListener('resize', () => determineButtonVisibility());
  }, []);

  useEffect(() => {
    determineButtonVisibility();
  }, [scrollContainerRef.current?.scrollLeft]);

  return (
    <div className={tabListControls}>
      <Button
        aria-label="Scroll left"
        variant="transparent"
        className={classNames(paginationButton, {
          [hiddenClass]: !visibleButtons.left,
        })}
        onPress={() => handlePagination('back')}
      >
        <MonoArrowBackIosNew />
      </Button>
      {children}
      <Button
        aria-label="Scroll right"
        variant="transparent"
        className={classNames(paginationButton, {
          [hiddenClass]: !visibleButtons.right,
        })}
        onPress={() => handlePagination('forward')}
      >
        <MonoArrowForwardIos />
      </Button>
    </div>
  );
};
