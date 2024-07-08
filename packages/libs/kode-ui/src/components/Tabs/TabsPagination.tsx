'use client';
import {
  MonoArrowBackIosNew,
  MonoArrowForwardIos,
} from '@kadena/kode-icons/system';
import classNames from 'classnames';
import type { ReactElement, RefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { debounce } from '../../utils';
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
      scrollContainerRef.current.classList.remove('paginationLeft');

      setVisibleButtons((prev) => ({ ...prev, left: false }));
    } else {
      scrollContainerRef.current.classList.add('paginationLeft');

      setVisibleButtons((prev) => ({ ...prev, left: true }));
    }
    // 20 is a margin to prevent having a very small last bit to scroll
    if (viewWidth + scrollPosition >= maxWidth - 20) {
      scrollContainerRef.current.classList.remove('paginationRight');

      setVisibleButtons((prev) => ({ ...prev, right: false }));
    } else {
      scrollContainerRef.current.classList.add('paginationRight');

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
  };

  useEffect(() => {
    // Initial check
    determineButtonVisibility();

    window.addEventListener('resize', () => determineButtonVisibility());
    scrollContainerRef.current?.addEventListener(
      'scroll',
      debounce(() => determineButtonVisibility(), 100),
    );

    return () => {
      window.removeEventListener('resize', () => determineButtonVisibility());
      scrollContainerRef.current?.removeEventListener('scroll', () =>
        determineButtonVisibility(),
      );
    };
  }, []);

  return (
    <div className={tabListControls}>
      <Button
        aria-label="Scroll left"
        variant="transparent"
        isDisabled={!visibleButtons.left}
        className={classNames(paginationButton.left, {
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
        isDisabled={!visibleButtons.right}
        className={classNames(paginationButton.right, {
          [hiddenClass]: !visibleButtons.right,
        })}
        onPress={() => handlePagination('forward')}
      >
        <MonoArrowForwardIos />
      </Button>
    </div>
  );
};
