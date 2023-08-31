import { dividerClass } from './Divider.css';

import React, { type FC } from 'react';

export const Divider: FC = () => {
  return <hr className={dividerClass} />;
};
