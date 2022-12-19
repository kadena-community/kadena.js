import { Text } from '../text';

import React, { useEffect, useState } from 'react';

interface ITimeTickerProps {
  date: Date;
}

export function TimeTicker({ date }: ITimeTickerProps): JSX.Element {
  const [timeDiff, setTimeDiff] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeDiffSeconds: number = Math.round(
        (new Date().valueOf() - date.valueOf()) / 1000,
      );

      if (timeDiffSeconds <= 100) {
        setTimeDiff(timeDiffSeconds);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
}
