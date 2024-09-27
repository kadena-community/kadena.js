import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack } from '../Layout';
import { Text } from '../Typography';
import type { ITileProps } from './Tile';
import { Tile } from './Tile';

const meta: Meta<ITileProps> = {
  title: 'Components/Tile',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: 'A component can show the steps through a process',
      },
    },
  },
  argTypes: {
    isDisabled: {
      control: { type: 'boolean' },
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'span', 'li', 'button'],
    },
  },
};

export default meta;

type Story = StoryObj<ITileProps>;

export const Primary: Story = {
  name: 'Tile',
  args: {},
  render: (args) => {
    const as = args.as === 'li' ? 'ul' : 'div';

    return (
      <Stack as={as} flexDirection="column" gap="md">
        <Tile {...args}>
          <Text>This is a tile</Text>
        </Tile>

        <Tile {...args}>
          <Text>This is a tile</Text>
        </Tile>
      </Stack>
    );
  },
};

export const Buttons: Story = {
  name: 'Tiles as Buttons',
  args: {},
  render: (args) => {
    return (
      <Stack as="div" flexDirection="column" gap="md">
        <Tile as="button" {...args} onClick={() => alert('test')}>
          <Text>This is a tile</Text>
        </Tile>

        <Tile as="button" {...args} onClick={() => alert('test')}>
          <Text>This is a tile</Text>
        </Tile>
      </Stack>
    );
  },
};
