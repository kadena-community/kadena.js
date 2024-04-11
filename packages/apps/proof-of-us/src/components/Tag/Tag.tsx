import { deviceColors } from '@/styles/tokens.css';
import type { FC, PropsWithChildren } from 'react';
import { tagClass } from './style.css';

interface IProps extends PropsWithChildren {
  color?: 'blue' | 'red';
}

export const Tag: FC<IProps> = ({ children, color = 'blue' }) => {
  return (
    <span className={tagClass} style={{ backgroundColor: deviceColors[color] }}>
      {children}
    </span>
  );
};
