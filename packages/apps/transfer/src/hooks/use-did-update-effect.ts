import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export default (fn: Function, inputs: unknown[]): boolean => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);

  return true;
};
