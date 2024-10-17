import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChainBalanceDistribution } from './ChainBalanceDistribution';
import type { IChainBalanceDistributionProps } from './types';

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
  argTypes: {},
};

export default meta;
type Story = StoryObj<IChainBalanceDistributionProps>;

export const Primary: Story = {
  name: 'Chain Balance Distribution Pattern',
  args: {},
  render: ({}) => {
    const chains = [
      {
        chainId: '0',
        balance: 1.1980178,
        percentage: 100,
      },
      {
        chainId: '1',
      },
      {
        chainId: '2',
        balance: 0.001879,
        percentage: 2,
      },
      {
        chainId: '3',
      },
      {
        chainId: '4',
      },
      {
        chainId: '5',
      },
      {
        chainId: '6',
      },
      {
        chainId: '7',
      },
      {
        chainId: '8',
      },
      {
        chainId: '9',
      },
      {
        chainId: '10',
      },
      {
        chainId: '11',
      },
      {
        chainId: '12',
      },
      {
        chainId: '13',
      },
      {
        chainId: '14',
      },
      {
        chainId: '15',
      },
      {
        chainId: '16',
      },
      {
        chainId: '17',
      },
      {
        chainId: '18',
      },
      {
        chainId: '19',
        balance: 0.05,
        percentage: 4.173560693338613,
      },
    ];
    return <ChainBalanceDistribution chains={chains} />;
  },
};
