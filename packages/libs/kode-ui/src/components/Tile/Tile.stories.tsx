import { MonoCheck, MonoClear } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getVariants } from '../../storyDecorators/getVariants';
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
    hasFocus: {
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
