import { useState, useEffect } from 'react';

export const useDebounce = (value: any, wait = 300) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, wait);
    return () => clearTimeout(timer);
  }, [value, wait]);
  return debounceValue;
};
