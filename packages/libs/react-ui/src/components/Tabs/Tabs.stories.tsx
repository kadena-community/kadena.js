import type { ITabsContainerProps } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { Text } from '@components/Typography/Text/Text';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const ExampleTabs: string[] = [
  'He-man',
  'Skeletor',
  'Orko',
  'Teela-Na',
  'Cringer',
  'King Randor',
];

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
          "The Tab component consists of three sub components:<br /><strong><Tabs.Root></strong> as the parent container<br /><strong><Tabs.Tab></strong> for each tab item<br /><strong><Tabs.Content></strong> for the tab content<br /><br /><strong>initialSelectedTab</strong><br />This optional prop can be used on the Root element to set the initially selected tab<br /><em>It defaults to `undefined` and has only been explcitly set to 'Skeletor' in the story code for demonstration purposes.</em>",
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
    initialSelected: {
      options: [
        ...['-'],
        ...Object.values(ExampleTabs),
      ] as (keyof typeof ExampleTabs)[],
      control: {
        type: 'select',
      },
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string | undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ITabsContainerProps & { itemsCount: number }>;

export const Primary: Story = {
  name: 'Tabs',
  args: {
    itemsCount: 3,
    initialSelected: 'Skeletor',
  },
  render: ({ itemsCount, initialSelected }) => {
    const tabs = ExampleTabs.slice(0, itemsCount);

    return (
      <>
        <Tabs.Root initialSelected={initialSelected}>
          {tabs.map((tab) => {
            return (
              <Tabs.Tab key={tab} id={tab}>
                {tab}
              </Tabs.Tab>
            );
          })}

          {tabs.map((tab) => {
            return (
              <Tabs.Content key={tab} id={tab}>
                <Text>Content for Tab &apos;{tab}&apos;</Text>
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </>
    );
  },
};
