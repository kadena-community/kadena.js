import { createPluginIframe } from './plugins.service';
import { Plugin } from './type';

interface LoadedPlugin {
  element: HTMLIFrameElement;
  state: 'background' | 'foreground';
  config: Plugin;
  sessionId: string;
  disconnect: () => void;
}

export class PluginManager {
  loadedPlugins: Map<string, LoadedPlugin> = new Map();

  availablePlugins: Map<string, Plugin> = new Map();

  _pluginsContainer: HTMLDivElement | undefined;

  get pluginsContainer() {
    if (this._pluginsContainer) return this._pluginsContainer;
    const domElement = document.getElementById(this.containerId);
    if (!domElement) {
      this._pluginsContainer = document.createElement('div');
      this._pluginsContainer.style.display = 'content';
      this._pluginsContainer.id = this.containerId;
      document.body.appendChild(this.pluginsContainer);
    } else {
      this._pluginsContainer = domElement as HTMLDivElement;
    }
    return this._pluginsContainer;
  }

  // plugin whitelist
  registries = ['/internal-registry'];

  constructor(private containerId: string = 'plugins-container') {}

  hasPlugin(id: string) {
    return this.loadedPlugins.has(id);
  }

  loadPlugin(plugin: Plugin): LoadedPlugin {
    if (this.loadedPlugins.has(plugin.id)) {
      return this.loadedPlugins.get(plugin.id)!;
    }
    const sessionId = `${plugin.id}-${crypto.randomUUID()}`;
    const iframe = createPluginIframe(plugin, sessionId);

    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.display = 'none';

    const instance: LoadedPlugin = {
      element: iframe,
      state: 'background' as const,
      config: plugin,
      sessionId,
      disconnect: () => {},
    };

    this.pluginsContainer.appendChild(iframe);
    this.loadedPlugins.set(plugin.id, instance);

    return instance;
  }

  bringToFront(id: string, wrapper: HTMLElement) {
    const plugin = this.loadedPlugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with id ${id} does not exist`);
    }
    const updatePosition = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const pageXOffset =
        window.pageXOffset || document.documentElement.scrollLeft;
      const pageYOffset =
        window.pageYOffset || document.documentElement.scrollTop;
      const iframe = plugin.element;
      const iframeWidth = wrapperRect.width || 400; // Default width
      const iframeHeight = wrapperRect.height || 400; // Default height

      // Ensure the iframe appears within the wrapper's boundaries
      let left = Math.max(wrapperRect.left + pageXOffset, 0);
      let top = Math.max(wrapperRect.top + pageYOffset, 0);

      // Adjust position to keep it within the viewport
      const maxRight = window.innerWidth - iframeWidth;
      const maxBottom = window.innerHeight - iframeHeight;

      left = Math.min(left, maxRight);
      top = Math.min(top, maxBottom);

      console.log({ left, top, wrapperRect });

      iframe.style.width = `${iframeWidth}px`;
      iframe.style.height = `${iframeHeight}px`;

      iframe.style.left = `${left}px`;
      iframe.style.top = `${top}px`;
      iframe.style.display = 'block';
    };

    updatePosition();
    // Observe size changes
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(wrapper);

    // Observe DOM changes (e.g., layout shifts)
    const mutationObserver = new MutationObserver(updatePosition);
    mutationObserver.observe(wrapper, { attributes: true, subtree: true });

    plugin.disconnect = () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };

    // Update plugin state
    plugin.state = 'foreground';
  }

  bringToBackground(id: string) {
    const plugin = this.loadedPlugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with id ${id} does not exist`);
    }
    // plugin.element.setAttribute('style', 'display: none;');
    plugin.disconnect();
    plugin.element.style.display = 'none';
    plugin.state = 'background';
  }

  removePlugin(id: string) {
    const plugin = this.loadedPlugins.get(id);
    if (plugin) {
      this.loadedPlugins.delete(id);
      plugin.element.remove();
    }
  }

  async fetchPluginList() {
    const allPlugins = new Map<string, Plugin>();
    await Promise.all(
      this.registries.map((registry) =>
        fetch(`${registry}/plugins.json`)
          .then((res) => res.json())
          .then((list: Omit<Plugin, 'registry'>[]) =>
            (list || []).map((p) => ({
              ...p,
              registry,
              keepInBackground: p.keepInBackground || true, // temporary for testing
              permissions: p.permissions || [],
              sessionId: undefined,
            })),
          )
          .then((list) => {
            list.forEach((p) => {
              if (!allPlugins.has(p.id)) {
                allPlugins.set(p.id, p);
              }
            });
          }),
      ),
    );
    this.availablePlugins = allPlugins;
    return allPlugins;
  }
}
