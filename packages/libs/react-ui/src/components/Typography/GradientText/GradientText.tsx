import { gradientTextClass } from './GradientText.css';

import React, { FC } from 'react';

interface IGradientTextProps {
  children: React.ReactNode;
}

export const GradientText: FC<IGradientTextProps> = ({ children }) => {
  return <span className={gradientTextClass}>{children}</span>;
};
