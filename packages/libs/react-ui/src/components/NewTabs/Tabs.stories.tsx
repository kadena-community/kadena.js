import { Meta } from '@storybook/react';
import React, { useState } from 'react';
import type { ITabsProps } from './Tabs';
import { TabItem, Tabs } from './Tabs';

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
    argTypes: {
      ariaLabel: {
        description: 'accesibility label.',
        control: {
          type: 'text',
        },
      },
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
    },
  },
};

export default meta;

export const TabsStory = () => (
  <Tabs aria-label="History of Ancient Rome">
    <TabItem key="FoR" title="Founding of Rome">
      Arma virumque cano, Troiae qui primus ab oris.
    </TabItem>
    <TabItem key="MaR" title="Monarchy and Republic">
      Senatus Populusque Romanus.
    </TabItem>
    <TabItem key="Emp" title="Empire">
      Alea jacta est.
    </TabItem>
  </Tabs>
);

export const ControlledTabsStory = () => {
  const [timePeriod, setTimePeriod] = useState('jurassic');

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
