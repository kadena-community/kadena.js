import React, { FC, memo, useState, useEffect } from 'react';
import { useTransactionData } from 'services/transaction';

interface Props {
  requestKey: string;
}

const FeeEstimator: FC<Props> = ({ requestKey }) => {
  const [feeEstimator, setFeeEstimator] = useState<string | undefined>('—');

  const { metaData, historyData } = useTransactionData(requestKey);

  useEffect(() => {
    const gasPrice = metaData.find(item => item.id === 8)?.value;
    const gas = historyData?.length
      ? (historyData[0]?.items || []).find(item => item.id === 12)?.value
      : undefined;
    if (gasPrice && gas) {
      setFeeEstimator((Number(gasPrice) * Number(gas)).toFixed(8));
    }
  }, [metaData]);

  return <div>{feeEstimator}</div>;
};

export default memo(FeeEstimator);
