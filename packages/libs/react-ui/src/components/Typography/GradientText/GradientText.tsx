import { gradientTextClass } from './GradientText.css';

import React, { type FC } from 'react';

export interface IGradientTextProps {
  children: React.ReactNode;
}

export const GradientText: FC<IGradientTextProps> = ({ children }) => {
  return <span className={gradientTextClass}>{children}</span>;
};
