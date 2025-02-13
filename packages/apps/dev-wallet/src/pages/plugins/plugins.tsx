import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { getInitials } from '@/utils/get-initials';
import { MonoApps } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { noStyleLinkClass } from '../home/style.css';
import { PluginCommunicationProvider } from './PluginCommunicationProvider';
import { pluginContainerClass, pluginIconClass } from './style.css';
import { Plugin } from './type';

// plugin whitelist
const registries = [
  '/internal-registry',
  // 'https://localhost:3000/test-plugins',
];

function escapeHTML(input: string) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const getDoc = (plugin: Plugin, sessionId: string) => {
  const id = escapeHTML(plugin.id);
  const host = escapeHTML(plugin.registry);
  const src = `${host}/${id}/dist/index.es.js`;
  const style = `${host}/${id}/dist/style.css`;

  console.log('loading plugin: ', { id, host, src, style });

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kadena Dev Wallet Plugin</title>
    <link rel="stylesheet" href="${style}" />
    <link rel="modulepreload" crossorigin href="${src}" />
    </head>
    <body class="boot">
    <div id="plugin-root"></div>
    <script type="module">
      window.process =  window.process || { env: { NODE_ENV: 'production' } };
    </script>
    <script type="module">
      import { createApp } from '${src}';
      createApp(document.getElementById('plugin-root'), { sessionId: '${sessionId}' }, window.parent);
    </script>
  </body>
</html>`;
};

const logTap = function <T>(msg: string): (e: T) => T {
  return function (e: T): T {
    console.log(msg, e);
    return e;
  };
};

export function Plugins() {
  const [searchParams] = useSearchParams();
  const [pluginList, setPluginList] = useState<Plugin[]>([]);
  const pluginId = searchParams.get('plugin-id') as
    | null
    | keyof typeof pluginList;

  const plugin = pluginList.find((p) => p.id === pluginId);
  const sessionId = useMemo(
    () => `${pluginId?.toString()}:${crypto.randomUUID()}`,
    [pluginId],
  );

  useEffect(() => {
    registries.map((registry) =>
      fetch(`${registry}/plugins.json`)
        .then((res) => res.json())
        .then((list: Omit<Plugin, 'registry'>[]) =>
          (list || []).map((p) => ({ ...p, registry })),
        )
        .then((list) =>
          setPluginList((prev) => {
            const newPlugins: Plugin[] = [];
            list.forEach((p) => {
              if (
                !prev.find((pl) => pl.id === p.id && pl.registry === p.registry)
              ) {
                newPlugins.push(logTap<typeof p>('plugin found')(p));
              }
            });
            return [...prev, ...newPlugins];
          }),
        ),
    );
  }, []);

  const doc = useMemo(() => {
    if (!plugin) return '';
    return getDoc(plugin, sessionId);
  }, [plugin, sessionId]);

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
                    {getInitials(plugin.shortName).toUpperCase()}
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
            <iframe
              sandbox="allow-scripts allow-forms"
              style={{ border: 'none', width: '100%', height: '100%' }}
              srcDoc={doc}
            />
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
        {pluginList.map(({ name, shortName, id }) => (
          <Link to={`/plugins?plugin-id=${id}`} className={noStyleLinkClass}>
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
              gap={'xs'}
            >
              <div className={pluginIconClass}>
                {getInitials(shortName).toUpperCase()}
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
