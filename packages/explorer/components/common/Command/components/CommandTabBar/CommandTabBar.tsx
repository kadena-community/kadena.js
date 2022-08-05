import React, { FC, memo } from 'react';
import s from './CommandTabBar.module.css';
import { useWindowSize } from '../../../../../utils/window';

interface IProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const CommandTabBar: FC<IProps> = ({ activeTab, setActiveTab }) => {
  const [width] = useWindowSize();
  return (
    <div className={s.headContainer}>
      <span
        className={`${s.block} ${activeTab === 'pact' ? s.activeBlock : null}`}
        onClick={() => setActiveTab('pact')}>
        Pact
      </span>
      <span
        className={`${s.block} ${
          activeTab === 'signing' ? s.activeBlock : null
        }`}
        onClick={() => setActiveTab('signing')}>
        Signing
      </span>
      <span
        className={`${s.block} ${
          activeTab === 'network' ? s.activeBlock : null
        }`}
        onClick={() => setActiveTab('network')}>
        Network
      </span>
      <span
        className={`${s.block} ${
          activeTab === 'metaData' ? s.activeBlock : null
        }`}
        onClick={() => setActiveTab('metaData')}>
        {width < 1024 ? 'Meta' : 'Meta Data'}
      </span>
      <span
        className={`${s.block} ${
          activeTab === 'envData' ? s.activeBlock : null
        }`}
        onClick={() => setActiveTab('envData')}>
        {width < 1024 ? 'Env' : 'Env (Advanced)'}
      </span>
    </div>
  );
};

export default memo(CommandTabBar);
