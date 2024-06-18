import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  onLayer1,
  withCenteredStory,
  withContentWidth,
} from '../../storyDecorators';
import { Button } from '../Button';
import type { ICardProps } from '../Card';
import { Card } from '../Card';
import { Stack } from '../Layout';
import { Heading, Text } from '../Typography';

const meta: Meta<ICardProps> = {
  title: 'Layout/Card',
  decorators: [onLayer1, withContentWidth, withCenteredStory],
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    docs: {
      description: {
        component: 'A component used for grouping items in a card.',
      },
    },
  },
  component: Card,
  argTypes: {
    fullWidth: {
      control: {
        type: 'boolean',
      },
      description:
        'An option to make the card span the full width of its container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Disables the input and applies visual styling.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ICardProps>;

export const Primary: Story = {
  name: 'Card',
  args: {
    fullWidth: false,
    disabled: false,
  },
  render: ({ fullWidth, disabled }) => {
    return (
      <>
        <Card fullWidth={fullWidth} disabled={disabled}>
          <Stack
            flexDirection="column"
            gap="xs"
            alignItems="flex-start"
            marginBlockEnd="md"
            maxWidth="content.maxWidth"
          >
            <Heading as="h5">Intro to Kadena</Heading>
            <Text>
              Kadena is the only platform offering a complete decentralized
              infrastructure for builders. Combining a revolutionary chain
              architecture with the tools needed for widespread adoption, your
              teams get the full capabilities of blockchain with the ability to
              go from concept to launch in days vs. months by not having to
              build from scratch. Learn about our core concepts.
            </Text>
          </Stack>
          <Button title={'Button'}>Kadena Docs</Button>
        </Card>
      </>
    );
  },
};
