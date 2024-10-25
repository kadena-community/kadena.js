import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import type { ISideBar } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarFooter } from './components/SideBarFooter';
import { SideBarHeader } from './components/SideBarHeader';
import { SideBarItem } from './components/SideBarItem';
import { SideBarNavigation } from './components/SideBarNavigation';

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
    return (
      <SideBar isExpanded={true}>
        <SideBarHeader>
          <SideBarItem label="headeritem 1" />
        </SideBarHeader>
        <SideBarNavigation>
          <SideBarItem label="nav item 1" />
        </SideBarNavigation>
        <SideBarFooter>
          <SideBarItem label="footer item 1" />
        </SideBarFooter>
      </SideBar>
    );
  },
};

export default meta;
