import type { FC } from 'react';
import { useEffect } from 'react';
import { useLayout } from '../LayoutProvider';

export interface iRightAsideHeader {
  label?: string;
}

export const RightAsideHeader: FC<iRightAsideHeader> = ({ label }) => {
  const { setRightAsideTitle } = useLayout();

  useEffect(() => {
    setRightAsideTitle(label);
  }, [label]);

  return null;
};
