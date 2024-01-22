import { useLayoutEffect } from '@react-aria/utils';
import type { RefObject } from 'react';
import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export function useEnterAnimation(
  ref: RefObject<HTMLElement>,
  isReady: boolean = true,
) {
  let [isEntering, setEntering] = useState(true);
  useAnimation(
    ref,
    isEntering && isReady,
    useCallback(() => setEntering(false), []),
  );
  return isEntering && isReady;
}

export function useExitAnimation(ref: RefObject<HTMLElement>, isOpen: boolean) {
  // State to trigger a re-render after animation is complete, which causes the element to be removed from the DOM.
  // Ref to track the state we're in, so we don't immediately reset isExiting to true after the animation.
  let [isExiting, setExiting] = useState(false);
  let [exitState, setExitState] = useState('idle');

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

function useAnimation(
  ref: RefObject<HTMLElement>,
  isActive: boolean,
  onEnd: () => void,
) {
  let prevAnimation = useRef<string | null>(null);
  if (isActive && ref.current) {
    // This is ok because we only read it in the layout effect below, immediately after the commit phase.
    // We could move this to another effect that runs every render, but this would be unnecessarily slow.
    // We only need the computed style right before the animation becomes active.
    prevAnimation.current = window.getComputedStyle(ref.current).animation;
  }

  useLayoutEffect(() => {
    if (isActive && ref.current) {
      // Make sure there's actually an animation, and it wasn't there before we triggered the update.
      let computedStyle = window.getComputedStyle(ref.current);
      if (
        computedStyle.animationName &&
        computedStyle.animationName !== 'none' &&
        computedStyle.animation !== prevAnimation.current
      ) {
        let element = ref.current;
        let onAnimationEnd = (e: AnimationEvent) => {
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

// React doesn't understand the <template> element, which doesn't have children like a normal element.
// It will throw an error during hydration when it expects the firstChild to contain content rendered
// on the server, when in reality, the browser will have placed this inside the `content` document fragment.
// This monkey patches the firstChild property for our special hidden template elements to work around this error.
// See https://github.com/facebook/react/issues/19932
if (typeof HTMLTemplateElement !== 'undefined') {
  const getFirstChild = Object.getOwnPropertyDescriptor(
    Node.prototype,
    'firstChild',
  )!.get!;
  Object.defineProperty(HTMLTemplateElement.prototype, 'firstChild', {
    configurable: true,
    enumerable: true,
    get: function () {
      if (this.dataset.reactAriaHidden) {
        return this.content.firstChild;
      } else {
        return getFirstChild.call(this);
      }
    },
  });
}
