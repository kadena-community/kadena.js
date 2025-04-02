import { Plugin } from '@/modules/plugins/type';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import './PluginManager';
import { PluginManager } from './PluginManager';

const context = createContext<{
  pluginManager: PluginManager | undefined;
  pluginList: Map<string, Plugin>;
}>({
  pluginManager: undefined,
  pluginList: new Map(),
});

export function PluginProvider({ children }: React.PropsWithChildren) {
  const [pluginManager] = useState<PluginManager>(() => new PluginManager());
  const [pluginList, setPluginList] = useState(new Map<string, Plugin>());

  useEffect(() => {
    pluginManager.fetchPluginList().then(setPluginList);
  }, [pluginManager]);

  const value = useMemo(
    () => ({
      pluginManager,
      pluginList,
    }),
    [pluginManager, pluginList],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function usePlugins() {
  return useContext(context);
}
