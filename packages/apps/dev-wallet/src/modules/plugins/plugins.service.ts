/**
 * - a service that accepts list of plugins with their metadata
 * - expose a function that loads a plugin and returns a plugin instance as iframe
 * - the service should be able to load multiple plugins
 * - the service exposes the functions to remove a plugin
 * - the service should remember the loaded plugins if page is reloaded and restore them (if possible and plugin supports it)
 *
 */

import { Plugin } from '@/modules/plugins/type';

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
      var pluginId = "${plugin.id}";
      window.process =  window.process || { env: { NODE_ENV: 'production' } };
    </script>
    <script type="module">
      import { createApp } from '${src}';
      createApp(document.getElementById('plugin-root'), { sessionId: '${sessionId}' }, window.parent);
    </script>
  </body>
</html>`;
};

/*
TODO: this is a temporary solution to load plugins
each plugin should have its own isolated origin (localstorage/indexed db ..). this is not achievable by loading plugin with docsrc or blob on the same url.
for the web version we can create sub urls for each plugin like plugin1.wallet.kadena.io or any other unique domain
this needs configuration in vercel so the server should serve app on *.wallet.kadena.io then handle different subdomains in client side.
for the desktop version we need more investigation
 */
export function createPluginIframe(
  plugin: Plugin,
  sessionId: string,
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.id = `plugin-${plugin.id}`;
  iframe.srcdoc = getDoc(plugin, sessionId);
  // TODO: the plugin should have its own url for security reasons
  iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin');
  return iframe;
}


