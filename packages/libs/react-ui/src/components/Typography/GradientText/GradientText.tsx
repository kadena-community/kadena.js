import type { FC } from 'react';
import React from 'react';
import { gradientTextClass } from './GradientText.css';

export interface IGradientTextProps {
  children: React.ReactNode;
}

export const GradientText: FC<IGradientTextProps> = ({ children }) => {
  return <span className={gradientTextClass}>{children}</span>;
};
