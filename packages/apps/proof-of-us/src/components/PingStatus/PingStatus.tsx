import {
  MonoWifi,
  MonoWifi1Bar,
  MonoWifi2Bar,
  MonoWifiOff,
} from '@kadena/kode-icons';
import { differenceInSeconds } from 'date-fns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  signee: IProofOfUsSignee;
}

export const PingStatus: FC<IProps> = ({ signee }) => {
  const [state, setState] = useState<number>(0);

  const checkTime = () => {
    const seconds = differenceInSeconds(
      Date.now(),
      signee.lastPingTime ?? Date.now(),
    );
    setState(seconds);
  };

  useEffect(() => {
    const interval = setInterval(checkTime, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [signee.lastPingTime]);

  const renderIcon = (seconds: number) => {
    switch (true) {
      case seconds > 69:
        return <MonoWifiOff />;
      case seconds > 39:
        return <MonoWifi1Bar />;
      case seconds > 19:
        return <MonoWifi2Bar />;
      default:
        return <MonoWifi />;
    }
  };

  return <section>{renderIcon(state)}</section>;
};
