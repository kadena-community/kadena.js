import { Text } from '@components/text';
import React, { useEffect, useState } from 'react';

interface ITimeTickerProps {
  date: Date;
}

export const TimeTicker = ({ date }: ITimeTickerProps): JSX.Element => {
  const [timeDiff, setTimeDiff] = useState<number>(0);

  useEffect(() => {
    setTimeDiff(Math.round((new Date().valueOf() - date.valueOf()) / 1000));

    const intervalId = setInterval(() => {
      const timeDiffSeconds: number = Math.round(
        (new Date().valueOf() - date.valueOf()) / 1000,
      );

      setTimeDiff(timeDiffSeconds);
      if (timeDiffSeconds >= 100) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <Text
      as="span"
      css={{
        whiteSpace: 'nowrap',
      }}
    >
      {timeDiff < 100 ? timeDiff : '>99'} s
    </Text>
  );
};
