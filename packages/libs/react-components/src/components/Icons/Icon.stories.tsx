import { Grid } from '../Grid';
import { Stack } from '../Stack/Stack';

import { styled } from './../../styles';
import * as Icons from './';

import type { StoryObj } from '@storybook/react';
import React from 'react';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

const meta = {
  title: 'Icons',
  component: Icons.AccountIcon,
  argTypes: {
    icon: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icons.AccountIcon>;

const IconName = styled('span', {
  fontSize: '$sm',
  textAlign: 'center',
});

export const Primary: Story = {
  name: 'Icon',
  args: {},
  render: ({ icon = '' }: any) => {
    const searchRegexp = new RegExp(icon, 'i');
    return (
      <>
        <Grid.Container spacing="xl" templateColumns="repeat(6, 1fr)">
          {Object.entries(Icons)
            .filter(([k]) => searchRegexp.test(k))
            .map(([k, Icon]) => (
              <Grid.Item key={k} bg="inherit">
                <Stack direction="column" alignItems="center" spacing="xs">
                  <Icon />
                  <IconName>{k}</IconName>
                </Stack>
              </Grid.Item>
            ))}
        </Grid.Container>
      </>
    );
  },
};
