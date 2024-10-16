import { MonoNote } from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Button, Stack } from '../../components';
import type { IChainBalanceDistributionProps } from './ChainBalanceDistribution';
import { ChainBalanceDistribution } from './ChainBalanceDistribution';

const meta: Meta<IChainBalanceDistributionProps> = {
  title: 'Patterns/Chain Balance Distribution',
  parameters: {
    status: { type: 'stable' },
    docs: {
      description: {
        component:
          'The Card Layout Pattern is used in most cases when you use the `Card` component. It is comprised of the `CardContentBlock`, `CardFooterGroup`, and `CardFixedContainer`. The `CardFixedContainer` is used when you want to position the card in the center of the page as the primary content for a page. The `CardContentBlock` is used to layout the content of the card in stackable blocks. The `CardFooterGroup` component allows you to group items together in the footer and nest them if you need some items on the left and some on the right. These components are flexible so that you can configure them to fit your needs.',
      },
    },
  },
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      description: 'Card Title',
    },
    description: {
      description: 'Card description',
      control: { type: 'text' },
    },
    visual: {
      description: 'An icon for the card',
    },
    extendedContent: {
      description:
        'Accented content that will be extended past the container of the card',
    },
    children: { description: 'The main content for the card' },
  },
};

export default meta;
type Story = StoryObj<IChainBalanceDistributionProps>;

export const Primary: Story = {
  name: 'Chain Balance Distribution Pattern',
  args: {},
  render: ({}) => {
    return <ChainBalanceDistribution />;
  },
};
