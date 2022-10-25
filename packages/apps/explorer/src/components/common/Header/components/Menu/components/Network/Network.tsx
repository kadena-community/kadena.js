import s from './Network.module.css';

import React, { FC, memo, useMemo } from 'react';
import { NetworkName } from 'utils/api';

interface IProps {
  setNetwork: (val: NetworkName) => void;
  network?: NetworkName;
  mobileMenu?: string;
}

const Network: FC<IProps> = ({ setNetwork, network, mobileMenu }) => {
  const netData = useMemo(
    () => [
      { id: 1, value: NetworkName.MAIN_NETWORK },
      { id: 2, value: NetworkName.TEST_NETWORK },
    ],
    [],
  );
  return (
    <div
      className={`${mobileMenu ? s.dropdownMobileMenu : s.container} ${
        s.netContainer
      }`}
    >
      {netData.map((datum) => (
        <div
          key={datum.id}
          className={s.row}
          onClick={() => setNetwork(datum.value as NetworkName)}
        >
          {datum.value}
        </div>
      ))}
    </div>
  );
};

export default memo(Network);
