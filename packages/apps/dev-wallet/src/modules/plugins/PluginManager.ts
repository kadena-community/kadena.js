import { createPluginIframe } from './plugins.service';
import { Plugin } from './type';

export interface LoadedPlugin {
  element: HTMLIFrameElement;
  state: 'background' | 'foreground';
  config: Plugin;
  sessionId: string;
  disconnect: () => void;
}

class PluginManager {
  loadedPlugins: Map<string, LoadedPlugin> = new Map();

  availablePlugins: Map<string, Plugin> = new Map();

  private emitter = new EventTarget();

  get plugins() {
    return Array.from(this.loadedPlugins.values());
  }

  _pluginsContainer: HTMLDivElement | undefined;

  get pluginsContainer() {
    if (this._pluginsContainer) return this._pluginsContainer;
    const domElement = document.getElementById(this.containerId);
    if (!domElement) {
      this._pluginsContainer = document.createElement('div');
      this._pluginsContainer.style.display = 'contents';
      this._pluginsContainer.id = this.containerId;
      document.body.appendChild(this._pluginsContainer);
    } else {
      this._pluginsContainer = domElement as HTMLDivElement;
    }
    return this._pluginsContainer;
  }

  // TODO: this should be a separate domain for security reasons otherwise the plugin can access the whole wallet
  registries = [`/internal-registry`];

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
    if (!plugin.config.permissions.includes('MODE:FOREGROUND')) {
      throw new Error(
        `Plugin with id ${id} does not have foreground permission`,
      );
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
      const left = Math.max(wrapperRect.left + pageXOffset, 0);
      const top = Math.max(wrapperRect.top + pageYOffset, 0);

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
    mutationObserver.observe(document.body, {
      attributes: true,
      subtree: true,
    });

    plugin.disconnect = () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };

    // Update plugin state
    plugin.state = 'foreground';
    this.emitter.dispatchEvent(new Event('plugin:updated'));
  }

  bringToBackground(id: string) {
    const plugin = this.loadedPlugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with id ${id} does not exist`);
    }
    if (!plugin.config.permissions.includes('MODE:BACKGROUND')) {
      // If the plugin does not have BACKGROUND permission, remove it
      return this.removePlugin(id);
    }
    // plugin.element.setAttribute('style', 'display: none;');
    plugin.disconnect();
    plugin.element.style.display = 'none';
    plugin.state = 'background';
    this.emitter.dispatchEvent(new Event('plugin:updated'));
  }

  removePlugin(id: string) {
    const plugin = this.loadedPlugins.get(id);
    if (plugin) {
      plugin.disconnect();
      this.loadedPlugins.delete(id);
      plugin.element.remove();
      this.emitter.dispatchEvent(new Event('plugin:updated'));
    }
  }

  cleanup() {
    this.loadedPlugins.forEach((plugin) => {
      plugin.disconnect();
      plugin.element.remove();
    });
    this.loadedPlugins.clear();
    this.emitter.dispatchEvent(new Event('plugin:updated'));
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
    let bgTasks = 0;
    // Load plugins that have both BACKGROUND and ON_START permissions
    this.availablePlugins.forEach((plugin) => {
      if (
        plugin.permissions.includes('MODE:BACKGROUND') &&
        plugin.permissions.includes('MODE:ON_START')
      ) {
        this.loadPlugin(plugin);
        bgTasks += 1;
      }
    });
    if (bgTasks > 0) {
      this.emitter.dispatchEvent(new Event('plugin:updated'));
    }
    return allPlugins;
  }

  onStatusChange(cb: () => void) {
    this.emitter.addEventListener('plugin:updated', cb);
    return () => {
      this.emitter.removeEventListener('plugin:updated', cb);
    };
  }
}

export const pluginManager = new PluginManager();
