import { dividerClass } from './Divider.css';

import React, { FC } from 'react';

export const Divider: FC = () => {
  return <hr className={dividerClass} />;
};
