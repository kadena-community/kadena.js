import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { ISideBar } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarHeader } from './components/SideBarFooter';

const sampleNetworkItems: string[] = ['Mainnet', 'Testnet'];

const meta: Meta<ISideBar> = {
  title: 'Navigation/SideBar',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: 'A component can show the steps through a process',
      },
    },
  },
  argTypes: {},
};

type IStory = StoryObj<ISideBar>;

export const Primary: IStory = {
  name: 'SideBar',
  args: {},
  render: () => {
    return <>sdffsd</>;
  },
};

export default meta;
