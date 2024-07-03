import { addons } from '@storybook/manager-api';
import { KadenaTheme } from './theme';

addons.setConfig({
  theme: KadenaTheme,
  isFullscreen: false,
  panelPosition: 'right',
  showNav: true,
  showPanel: true,
  showToolbar: true,
  sidebar: {
    showRoots: true,
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('hidden');
      },
    },
  },
});
