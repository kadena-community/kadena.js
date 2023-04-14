import { Grid } from '../Grid';
import { Stack } from '../Stack/Stack';
import { Text } from '../Typography';

import { sizeVariant } from './styles';
import { IIconProps, SystemIcons } from './';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */
const meta: Meta<{ icon: string; color: string } & IIconProps> = {
  title: 'Icons',
  argTypes: {
    icon: {
      control: {
        type: 'text',
      },
    },
    size: {
      options: Object.keys(sizeVariant),
      control: {
        type: 'select',
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
  },
};

export default meta;
type Story = StoryObj<{ icon: string; color: string } & IIconProps>;

export const Primary: Story = {
  name: 'System',
  args: {},
  render: ({ icon = '', size, color }) => {
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const searchRegexp = new RegExp(icon, 'i');
    return (
      <>
        <Grid.Container spacing="xl" templateColumns="repeat(6, 1fr)">
          {Object.entries(SystemIcons)
            .filter(([k]) => searchRegexp.test(k))
            // eslint-disable-next-line @typescript-eslint/naming-convention
            .map(([k, Icon]) => (
              <Grid.Item key={k}>
                <Stack direction="column" alignItems="center" spacing="xs">
                  <Icon size={size} color={color} />
                  <Text size="sm">System.{k}</Text>
                </Stack>
              </Grid.Item>
            ))}
        </Grid.Container>
      </>
    );
  },
};
