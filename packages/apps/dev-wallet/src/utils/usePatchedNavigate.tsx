import { useCallback, useRef } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const usePatchedNavigate = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const fixedNavigate = useCallback(
    ((to, options) => navigateRef.current(to, options)) as NavigateFunction,
    [],
  );
  return fixedNavigate;
};
