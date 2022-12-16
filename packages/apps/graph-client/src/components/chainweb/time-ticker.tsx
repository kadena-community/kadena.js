import { Text } from '../text';

import React, { useEffect, useState } from 'react';

interface ITimeTickerProps {
  date: Date;
}

export function TimeTicker({ date }: ITimeTickerProps): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Text
      as="span"
      css={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {Math.round((currentDate - date) / 1000)} s
    </Text>
  );
}
