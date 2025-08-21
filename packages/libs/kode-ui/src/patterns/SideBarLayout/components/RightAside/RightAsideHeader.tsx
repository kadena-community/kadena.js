import type { FC } from 'react';
import { useEffect } from 'react';
import { useLayout } from '../LayoutProvider';

export interface IRightAsideHeader {
  label?: string;
}

export const RightAsideHeader: FC<IRightAsideHeader> = ({ label }) => {
  const { setRightAsideTitle } = useLayout();

  useEffect(() => {
    setRightAsideTitle(label);
  }, [label]);

  return null;
};
