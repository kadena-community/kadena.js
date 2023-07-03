import { useEffect, useRef } from 'react';

export default (fn: () => void, inputs: unknown[]): boolean => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);

  return true;
};
