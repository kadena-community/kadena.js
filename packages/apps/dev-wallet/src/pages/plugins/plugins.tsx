import { PluginIcon } from '@/Components/PluginIcon/PluginIcon';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { usePlugins } from '@/modules/plugins/plugin.provider';
import { pluginManager } from '@/modules/plugins/PluginManager';
import { getInitials } from '@/utils/get-initials';
import { MonoApps } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  SideBarBreadcrumbsItem,
} from '@kadena/kode-ui/patterns';
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { pluginContainerClass } from './style.css';

export function Plugins() {
  const [searchParams] = useSearchParams();
  const pluginList = usePlugins();

  const pluginId = searchParams.get('plugin-id');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const plugin = pluginId ? pluginList.get(pluginId) : undefined;

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (plugin) {
      pluginManager.loadPlugin(plugin);
      pluginManager.bringToFront(plugin.id, wrapperRef.current);
      return () => {
        pluginManager.bringToBackground(plugin.id);
      };
    }
  }, [plugin]);

  if (plugin) {
    return (
      <>
        <SideBarBreadcrumbs icon={<MonoApps />} isGlobal>
          <SideBarBreadcrumbsItem href="/plugins">
            plugins
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href={`/plugins?plugin-id=${plugin.id}`}>
            {plugin.name}
          </SideBarBreadcrumbsItem>
        </SideBarBreadcrumbs>

        <Stack marginBlockStart="xxxl">
          <SectionCard
            stack="vertical"
            icon={<div>{getInitials(plugin.name).toUpperCase()}</div>}
          >
            <SectionCardContentBlock>
              <SectionCardHeader
                title={plugin.name}
                description={<>{plugin.description}</>}
              />

              <SectionCardBody>
                <Stack
                  flex={1}
                  marginBlockEnd={'md'}
                  className={pluginContainerClass}
                >
                  <Stack
                    ref={wrapperRef}
                    width="100%"
                    style={{ minHeight: '500px' }}
                  />
                </Stack>
              </SectionCardBody>
            </SectionCardContentBlock>
          </SectionCard>
        </Stack>
      </>
    );
  }
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoApps />} isGlobal>
        <SideBarBreadcrumbsItem href="/plugins">plugins</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack marginBlockStart="xxxl">
        <SectionCard stack="vertical">
          <SectionCardContentBlock>
            <SectionCardHeader
              title="Plugins"
              description={
                <>
                  Plugins are mini-apps provided by third-parties that can
                  installed inside the wallet
                </>
              }
            />
            <SectionCardBody>
              <Stack flexWrap="wrap" gap={'md'}>
                {[...pluginList.values()].map(({ name, id }) => (
                  <Link
                    to={`/plugins?plugin-id=${id}`}
                    className={noStyleLinkClass}
                  >
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      flexDirection={'column'}
                      gap={'xs'}
                    >
                      <PluginIcon name={name} />
                      <Text bold size="smallest">
                        {name}
                      </Text>
                    </Stack>
                  </Link>
                ))}
              </Stack>
            </SectionCardBody>
          </SectionCardContentBlock>
        </SectionCard>
      </Stack>
    </>
  );
}
