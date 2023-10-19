import { getItem, setItem } from '@/utils/persist';
import { useEffect, useState } from 'react';

export const usePersistentState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const cookie = getItem(key);
    if (typeof cookie !== 'undefined') {
      setState(cookie as T);
    }
  }, [key]);

  const setPersistentState = (value: T) => {
    setItem(key, value);
    setState(getItem(key) as T);
  };

  return [state, setPersistentState] as const;
};
