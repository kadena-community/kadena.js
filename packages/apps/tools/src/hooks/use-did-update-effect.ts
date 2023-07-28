import { useEffect, useRef } from 'react';

const useDidUpdateEffect = (fn: () => void, inputs: unknown[]): boolean => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);

  return true;
};

export default useDidUpdateEffect;
