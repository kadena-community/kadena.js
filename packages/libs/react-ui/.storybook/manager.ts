import { addons } from '@storybook/addons';
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
  },
});
