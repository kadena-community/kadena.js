import type { FC } from 'react';
import React from 'react';

interface IProps {
  chainId?: number;
}

const Balance: FC<IProps> = ({ chainId }) => {
  console.log(chainId);
  return (
    <section>
      Balance
      {chainId && `${chainId}`}
    </section>
  );
};

export default Balance;
