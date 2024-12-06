import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getInitials } from '@/utils/get-initials';
import { MonoApps } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { Link, useSearchParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { pluginContainerClass, pluginIconClass } from './style.css';

const pluginList = {
  'pact-console': {
    name: 'Pact Console',
    url: '/hosted-plugins/pact-console/index.html',
    description:
      'A console for interacting with the Pact remotely on different networks.',
  },
};

export function Plugins() {
  const [searchParams] = useSearchParams();
  const { networks } = useWallet();
  const pluginId = searchParams.get('plugin-id') as
    | null
    | keyof typeof pluginList;

  if (pluginId && pluginList[pluginId]) {
    const plugin = pluginList[pluginId];
    return (
      <Stack flexDirection={'column'} gap={'md'} height="100%">
        <SideBarBreadcrumbs icon={<MonoApps />} isGlobal>
          <SideBarBreadcrumbsItem href="/plugins">
            plugins
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href={`/plugins?plugin-id=${pluginId}`}>
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
        <Stack flex={1} marginBlockEnd={'md'} className={pluginContainerClass}>
          <iframe
            style={{ border: 'none', width: '100%', height: '100%' }}
            src={`${plugin.url}?config=${JSON.stringify({ networks })}`}
          />
        </Stack>
      </Stack>
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
        {Object.entries(pluginList).map(([id, { name }]) => (
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
