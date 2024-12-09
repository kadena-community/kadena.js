import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { getInitials } from '@/utils/get-initials';
import { MonoApps } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { Link, useSearchParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { pluginContainerClass, pluginIconClass } from './style.css';

type Plugin = {
  id: string;
  name: string;
  src: string;
  style: string;
  description: string;
};

const pluginList: Plugin[] = [
  {
    id: 'pact-console',
    name: 'Pact Console',
    src: '/hosted-plugins/pact-console/pact-console.es.js',
    style: '/hosted-plugins/pact-console/style.css',
    description:
      'A console for interacting with the Pact remotely on different networks.',
  },
];

const getDoc = (
  plugin: Plugin,
  config: Record<string, unknown>,
) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kadena Dev Wallet Plugin</title>
    <link rel="stylesheet" href="${plugin.style}" />
    <link rel="modulepreload" crossorigin href="${plugin.src}" />
    </head>
    <body class="boot">
    <div id="plugin-root"></div>
    <script type="module">
      window.process =  window.process || { env: { NODE_ENV: 'production' } };
    </script>
    <script type="module">
      import { createApp } from '${plugin.src}';
      createApp(document.getElementById('plugin-root'), ${JSON.stringify(config)});
    </script>
  </body>
</html>
`;

export function Plugins() {
  const [searchParams] = useSearchParams();
  const { networks } = useWallet();
  const pluginId = searchParams.get('plugin-id') as
    | null
    | keyof typeof pluginList;

  const plugin = pluginList.find((p) => p.id === pluginId);

  if (plugin) {
    return (
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
        <Stack flex={1} marginBlockEnd={'md'} className={pluginContainerClass}>
          <iframe
            sandbox="allow-scripts allow-forms"
            style={{ border: 'none', width: '100%', height: '100%' }}
            srcDoc={getDoc(plugin, { networks })}
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
        {pluginList.map(({ name, id }) => (
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
