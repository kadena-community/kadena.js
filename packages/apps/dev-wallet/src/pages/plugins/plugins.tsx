import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { usePlugins } from '@/modules/plugins/plugin.provider';
import { getInitials } from '@/utils/get-initials';
import { MonoApps } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PluginCommunicationProvider } from '../../modules/plugins/PluginCommunicationProvider';
import { noStyleLinkClass } from '../home/style.css';
import { pluginContainerClass, pluginIconClass } from './style.css';

export function Plugins() {
  const [searchParams] = useSearchParams();
  const { pluginList, pluginManager } = usePlugins();
  const [sessionId, setSessionId] = useState<string | undefined>();

  const pluginId = searchParams.get('plugin-id');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const plugin = pluginId ? pluginList.get(pluginId) : undefined;

  useEffect(() => {
    if (!pluginManager || !wrapperRef.current) return;
    if (plugin) {
      const loadedPlugin = pluginManager.loadPlugin(plugin);
      pluginManager.bringToFront(plugin.id, wrapperRef.current);
      setSessionId(loadedPlugin.sessionId);
      return () => {
        pluginManager.bringToBackground(plugin.id);
      };
    }
  }, [plugin, pluginManager]);

  if (plugin) {
    return (
      <PluginCommunicationProvider sessionId={sessionId} plugin={plugin}>
        <Stack flexDirection={'column'} gap={'md'} height="100%">
          <SideBarBreadcrumbs icon={<MonoApps />} isGlobal>
            <SideBarBreadcrumbsItem href="/plugins">
              plugins
            </SideBarBreadcrumbsItem>
            <SideBarBreadcrumbsItem href={`/plugins?plugin-id=${plugin.id}`}>
              {plugin.name}
            </SideBarBreadcrumbsItem>
          </SideBarBreadcrumbs>
          <Stack gap={'sm'} flexDirection={'column'}>
            <Heading variant="h3">
              <Stack gap={'sm'} alignItems={'center'}>
                <div style={{ display: 'inline-block' }}>
                  <div className={pluginIconClass}>
                    {getInitials(plugin.name).toUpperCase()}
                  </div>
                </div>
                {plugin.name}
              </Stack>
            </Heading>

            <Text>{plugin.description}</Text>
          </Stack>
          <Stack
            flex={1}
            marginBlockEnd={'md'}
            className={pluginContainerClass}
          >
            <Stack ref={wrapperRef} width="100%" height="100%" />
          </Stack>
        </Stack>
      </PluginCommunicationProvider>
    );
  }
  return (
    <Stack flexDirection={'column'} gap={'md'}>
      <SideBarBreadcrumbs icon={<MonoApps />} isGlobal>
        <SideBarBreadcrumbsItem href="/plugins">plugins</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <Heading variant="h3">Plugins</Heading>
      <Text>
        Plugins are mini-apps provided by third-parties that can installed
        inside the wallet
      </Text>
      <Divider />
      <Stack flexWrap="wrap" gap={'md'}>
        {[...pluginList.values()].map(({ name, id }) => (
          <Link to={`/plugins?plugin-id=${id}`} className={noStyleLinkClass}>
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
              gap={'xs'}
            >
              <div className={pluginIconClass}>
                {getInitials(name).toUpperCase()}
              </div>
              <Text bold size="smallest">
                {name}
              </Text>
            </Stack>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
