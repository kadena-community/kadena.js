import { ITabsProps, Tabs } from '.';

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<
  ITabsProps & {
    itemsCount: number;
  }
> = {
  title: 'Layout/Tabs',
  component: Tabs,
  argTypes: {
    itemsCount: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
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
type Story = StoryObj<ITabsProps & { itemsCount: number }>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/7.0/react/api/csf
 * to learn how to use render functions.
 */

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
        <Tabs defaultSelected={defaultSelected}>
          {items.map((item) => {
            return (
              <Tabs.Tab key={item} value={item}>
                {item}
              </Tabs.Tab>
            );
          })}

          <Tabs.Panels>
            {items.map((item) => {
              return (
                <Tabs.Panels.Panel key={item} value={item}>
                  content {item}
                </Tabs.Panels.Panel>
              );
            })}
          </Tabs.Panels>
        </Tabs>
      </>
    );
  },
};
