import type { ITabsContainerProps } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { Text } from '@components/Typography/Text/Text';
import type { Meta, StoryObj } from '@storybook/react';
import { withCenteredStory } from '@utils/withCenteredStory';
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
  decorators: [withCenteredStory],
  parameters: {
    docs: {
      description: {
        component:
          'The Tab component consists of three sub components:<br /><strong><Tabs.Root></strong> as the parent container<br /><strong><Tabs.Tab></strong> for each tab item<br /><strong><Tabs.Content></strong> for the tab content<br /><br /><em>This component has a controlled and uncontrolled state. When a currentTab is not provided, the component will track state internally.</em>',
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
    initialTab: {
      options: [
        ...['-'],
        ...Object.values(ExampleTabs),
      ] as (keyof typeof ExampleTabs)[],
      control: {
        type: 'select',
      },
      description:
        'The default selected page <em>before</em> any interaction.<br /><small>Changing value will not trigger story re-render.</small>',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string | undefined' },
      },
    },
    currentTab: {
      options: [
        ...[undefined],
        ...Object.values(ExampleTabs),
      ] as (keyof typeof ExampleTabs)[],
      control: {
        type: 'select',
      },
      description:
        'Current active tab. Used when component is controlled.<br /><small>Set to make component controlled.</small>',
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
    itemsCount: 6,
    initialTab: 'Skeletor',
    currentTab: undefined,
  },
  render: ({ itemsCount, initialTab, currentTab }) => {
    const tabs = ExampleTabs.slice(0, itemsCount);

    return (
      <>
        <Tabs.Root initialTab={initialTab} currentTab={currentTab}>
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
