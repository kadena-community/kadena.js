import { tagClass } from './Tag.css';

import React, { FC } from 'react';

export interface ITagProps {
  children: React.ReactNode;
}

// TODO: Update to accept a color prop
export const Tag: FC<ITagProps> = ({ children }) => {
  return <span className={tagClass}>{children}</span>;
};
