import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import type { Key } from 'react-aria';
import type { ITabsProps } from './Tabs';
import { TabItem, Tabs } from './Tabs';

const ExampleTabs: any[] = [
  { title: 'Title', content: 'Content' },
  { title: 'Title2', content: 'Content2' },
  { title: 'Title3', content: 'Content3' },
];

const meta: Meta<ITabsProps> = {
  title: 'Layout/Tabs',
  component: Tabs,
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'The Tabs component is wrapper around [react aria](https://react-spectrum.adobe.com/react-aria/useTabList.html) hook to add all the accessibility perks this lib includes onto our tabs.  Here are just a couple of examples but you can check their docs for more. The exposed component are Tabs and TabItem, check the examples bellow to see how to use it.',
      },
    },
  },
  argTypes: {
    ['aria-label']: {
      description: 'accesibility label.',
      control: {
        type: 'text',
      },
    },
    ['aria-describedby']: {
      description: 'accesibility label.',
      control: {
        type: 'text',
      },
    },
    ['aria-details']: {
      description: 'accesibility label.',
      control: {
        type: 'text',
      },
    },
    ['aria-labelledby']: {
      description: 'accesibility label.',
      control: {
        type: 'text',
      },
    },
    selectedKey: {
      description: 'The currently selected key in the collection (controlled).',
    },
    defaultSelectedKey: {
      description: 'The initial selected key in the collection (uncontrolled).',
    },
    onSelectionChange: {
      description: 'Handler that is called when the selection changes.',
      action: 'clicked',
    },
  },
};

export default meta;

export const TabsStory = () => (
  <Tabs aria-label="SomeExampleOfTabs">
    {ExampleTabs.map((tab) => (
      <TabItem key={tab.title} title={tab.title}>
        {tab.content}
      </TabItem>
    ))}
  </Tabs>
);

export const ControlledTabsStory = () => {
  const [timePeriod, setTimePeriod] = useState<Key>('jurassic');

  return (
    <>
      <p>Selected time period: {timePeriod}</p>
      <Tabs
        aria-label="Mesozoic time periods"
        selectedKey={timePeriod}
        onSelectionChange={setTimePeriod}
      >
        <TabItem key="triassic" title="Triassic">
          The Triassic ranges roughly from 252 million to 201 million years ago,
          preceding the Jurassic Period.
        </TabItem>
        <TabItem key="jurassic" title="Jurassic">
          The Jurassic ranges from 200 million years to 145 million years ago.
        </TabItem>
        <TabItem key="cretaceous" title="Cretaceous">
          The Cretaceous is the longest period of the Mesozoic, spanning from
          145 million to 66 million years ago.
        </TabItem>
      </Tabs>
    </>
  );
};
