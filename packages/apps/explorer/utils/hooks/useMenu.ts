import { FC, useContext, useState } from 'react';
import Network from 'components/common/Header/components/Menu/components/Network/Network';
import About from 'components/common/Header/components/Menu/components/About/About';
import GetStarted from 'components/common/Header/components/Menu/components/GetStarted/GetStarted';
import LearnMore from 'components/common/Header/components/Menu/components/LearnMore/LearnMore';
import { NetworkContext } from '../../services/app';

type ComponentInfo = {
  Component: FC<any>;
  props: Record<string, any>;
};

export const useMenu = () => {
  const [openedTab, setOpenedTab] = useState<string>('');

  const { network, setNetwork } = useContext(NetworkContext);

  const menuInfo: Record<string, ComponentInfo> = {
    about: {
      Component: About,
      props: {},
    },
    getStarted: {
      Component: GetStarted,
      props: {},
    },
    learnMore: {
      Component: LearnMore,
      props: {},
    },
    network: {
      Component: Network,
      props: { setNetwork, network },
    },
  };

  return {
    openedTab,
    setOpenedTab,
    network,
    setNetwork,
    componentInfo: menuInfo[openedTab] || { Component: null, props: {} },
  };
};
