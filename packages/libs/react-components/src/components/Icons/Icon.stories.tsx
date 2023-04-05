import { Grid } from '../Grid';

import Icon, { Icons } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Icon> = {
  title: 'Icons',
  component: Icon,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Icon>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

const icons: Icons[] = [
  'bell',
  'dialpad',
  'eye',
  'github',
  'kcolon',
  'progress-wrench',
  'shield-account',
  'application-brackets',
  'close',
  'key',
  'information',
  'application',
  'bell-ring',
  'eye-outline',
  'car-brake-parking',
  'twitter',
  'copy',
  'key-filled',
  'loading',
  'earth',
  'signature',
  'eye-off',
  'folder-remove',
  'linkedin',
  'checkbox-blank',
  'alert-box',
  'radio-box-blank',
  'check',
  'plus',
  'usb',
  'stop-circle',
  'forward-slash',
  'checkbox-marked',
  'alert-box-outline',
  'radiobox-marked',
  'history',
  'check-decagram',
  'script-text-key',
  'qrcode',
  'checkbox-intermediate',
  'alert-circle-outline',
  'chevron-down',
  'form-textbox-password',
  'check-decagram-outline',
  'email',
  'help-circle',
  'leading-icon',
  'chevron-up',
  'exit-to-app',
  'link',
  'map-marker',
  'refresh',
  'badge-account',
  'trailing-icon',
  'application-cog-outline',
  'account',
  'magnify',
  'flag-checkered',
];
export const Primary: Story = {
  name: 'Icon',
  args: {},
  render: ({}) => (
    <>
      <Grid.Container spacing="sm" templateColumns="repeat(8, 1fr)">
        {icons.map((icon) => (
          <Grid.Item key={icon} bg="inherit">
            <Icon icon={icon} height={20} width={20} />
          </Grid.Item>
        ))}
      </Grid.Container>
    </>
  ),
};
