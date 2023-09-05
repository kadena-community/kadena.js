import { dividerClass } from './Divider.css';

import type { FC } from 'react';
import React from 'react';

export const Divider: FC = () => {
  return <hr className={dividerClass} />;
};
