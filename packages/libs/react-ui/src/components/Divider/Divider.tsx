import type { FC } from 'react';
import React from 'react';
import { dividerClass } from './Divider.css';

export const Divider: FC = () => {
  return <hr className={dividerClass} />;
};
