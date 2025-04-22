import { Plugin } from '@/modules/plugins/type';
import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '../wallet/wallet.hook';
import './PluginManager';
import { pluginManager } from './PluginManager';

const context = createContext<Map<string, Plugin> | undefined>(undefined);

export function PluginProvider({ children }: React.PropsWithChildren) {
  const wallet = useWallet();
  const [pluginList, setPluginList] = useState(new Map<string, Plugin>());

  useEffect(() => {
    if (wallet.profile?.showExperimentalFeatures) {
      console.log('PluginManager: startup');
      pluginManager.fetchPluginList().then(setPluginList);
    }
  }, [wallet.profile?.showExperimentalFeatures]);

  useEffect(() => {
    if (!wallet.isUnlocked || !wallet.profile?.showExperimentalFeatures) {
      console.log('PluginManager: cleanup');
      pluginManager.cleanup();
    }
  }, [wallet.isUnlocked, wallet.profile?.showExperimentalFeatures]);

  return <context.Provider value={pluginList}>{children}</context.Provider>;
}

export function usePlugins() {
  const pluginList = useContext(context);
  if (!pluginList) {
    throw new Error('PluginManager is not initialized; use PluginProvider');
  }
  return pluginList;
}
