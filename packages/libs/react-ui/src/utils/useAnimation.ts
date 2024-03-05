import { useLayoutEffect } from '@react-aria/utils';
import type { RefObject } from 'react';
import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// those utils are adopted from https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L240

/**
 * check if the element "ref" is entering an animation
 */
export function useEnterAnimation(
  ref: RefObject<HTMLElement>,
  isReady: boolean = true,
) {
  const [isEntering, setEntering] = useState(true);
  useAnimation(
    ref,
    isEntering && isReady,
    useCallback(() => setEntering(false), []),
  );
  return isEntering && isReady;
}

/**
 * check if the element "ref" is exiting an animation
 */
export function useExitAnimation(ref: RefObject<HTMLElement>, isOpen: boolean) {
  // State to trigger a re-render after animation is complete, which causes the element to be removed from the DOM.
  // Ref to track the state we're in, so we don't immediately reset isExiting to true after the animation.
  let [isExiting, setExiting] = useState(false);
  const [exitState, setExitState] = useState('idle');

  // If isOpen becomes false, set isExiting to true.
  if (!isOpen && ref.current && exitState === 'idle') {
    isExiting = true;
    setExiting(true);
    setExitState('exiting');
  }

  // If we exited, and the element has been removed, reset exit state to idle.
  if (!ref.current && exitState === 'exited') {
    setExitState('idle');
  }

  useAnimation(
    ref,
    isExiting,
    useCallback(() => {
      setExitState('exited');
      setExiting(false);
    }, []),
  );

  return isExiting;
}

/**
 * This hook is used to detect when an animation ends.
 */
function useAnimation(
  ref: RefObject<HTMLElement>,
  isActive: boolean,
  onEnd: () => void,
) {
  const prevAnimation = useRef<string | null>(null);
  if (isActive && ref.current) {
    // This is ok because we only read it in the layout effect below, immediately after the commit phase.
    // We could move this to another effect that runs every render, but this would be unnecessarily slow.
    // We only need the computed style right before the animation becomes active.
    prevAnimation.current = window.getComputedStyle(ref.current).animation;
  }

  useLayoutEffect(() => {
    if (isActive && ref.current) {
      // Make sure there's actually an animation, and it wasn't there before we triggered the update.
      const computedStyle = window.getComputedStyle(ref.current);
      if (
        computedStyle.animationName &&
        computedStyle.animationName !== 'none' &&
        computedStyle.animation !== prevAnimation.current
      ) {
        const element = ref.current;
        const onAnimationEnd = (e: AnimationEvent) => {
          if (e.target === ref.current) {
            element.removeEventListener('animationend', onAnimationEnd);
            flushSync(() => {
              onEnd();
            });
          }
        };

        element.addEventListener('animationend', onAnimationEnd);
        return () => {
          element.removeEventListener('animationend', onAnimationEnd);
        };
      } else {
        onEnd();
      }
    }
  }, [ref, isActive, onEnd]);
}
