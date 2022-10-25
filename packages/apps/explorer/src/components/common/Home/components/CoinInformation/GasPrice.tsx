import s from './CoinInformation.module.css';

import React, { FC, memo, useEffect, useState } from 'react';
import { useTransactionData } from 'services/transaction';

interface IProps {
  requestKey: string;
}

const GasPrice: FC<IProps> = ({ requestKey }) => {
  const [gasPrice, setGasPrice] = useState<string>('—');

  const { metaData } = useTransactionData(requestKey);

  useEffect(() => {
    const value = metaData.find((item) => item.id === 8)?.value;
    if (value) {
      setGasPrice(String(value));
    }
  }, [metaData]);

  return (
    <div>
      <div className={s.title}>Avg gas price</div>
      <div className={s.text}>{gasPrice}</div>
    </div>
  );
};

export default memo(GasPrice);
