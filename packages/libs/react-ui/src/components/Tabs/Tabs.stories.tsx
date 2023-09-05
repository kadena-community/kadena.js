import type { ITabsContainerProps } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { Text } from '@components/Typography/Text/Text';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  ITabsContainerProps & {
    itemsCount: number;
  }
> = {
  title: 'Layout/Tabs',
  parameters: {
    docs: {
      description: {
        component:
          'The tabs functionality is divided into three sub components: The <i>Tabs.Root</i> for parent, then <i>Tabs.Tab</i> for each tab item and the <i>Tabs.Content</i> for the tab content.',
      },
    },
  },
  component: Tabs.Root,
  argTypes: {
    itemsCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Total number of tabs.',
      table: {
        type: { summary: 'number' },
      },
    },
  },
};

const ItemArray: string[] = [
  'He-man',
  'Skeletor',
  'Orko',
  'Teela-Na',
  'Cringer',
  'King Randor',
];

export default meta;
type Story = StoryObj<ITabsContainerProps & { itemsCount: number }>;

export const Primary: Story = {
  name: 'Tabs',
  args: {
    itemsCount: 3,
    defaultSelected: 'He-man',
  },
  render: ({ itemsCount, defaultSelected }) => {
    const items = ItemArray.slice(0, itemsCount);

    return (
      <>
        <Tabs.Root defaultSelected={defaultSelected}>
          {items.map((item) => {
            return (
              <Tabs.Tab key={item} value={item}>
                {item}
              </Tabs.Tab>
            );
          })}

          {items.map((item) => {
            return (
              <Tabs.Content key={item} value={item}>
                <Text>content {item}</Text>
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </>
    );
  },
};
