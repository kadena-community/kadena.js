import type { ReactNode } from 'react';
import React from 'react';

export const cleanOutput = (str: ReactNode | object): ReactNode => {
  if (typeof str !== 'string') return JSON.stringify(str, null, 2);
  const arr = str.split('\\n');

  return arr.map((str, idx) => (
    <span key={idx}>
      {str}
      <br />
    </span>
  ));
};
