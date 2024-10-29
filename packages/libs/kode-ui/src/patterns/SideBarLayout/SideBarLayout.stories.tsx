import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  MonoAccountTree,
  MonoControlPointDuplicate,
  MonoLightMode,
  MonoWifiTethering,
  MonoWindow,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';
import { Button } from './../../components';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarContext } from './components/SideBarContext';
import { SideBarFooter } from './components/SideBarFooter';
import { SideBarFooterItem } from './components/SideBarFooterItem';
import { SideBarItem } from './components/SideBarItem';
import { SideBarItemsInline } from './components/SideBarItemsInline';
import { SideBarNavigation } from './components/SideBarNavigation';
import type { ISideBar } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarLayout } from './SideBarLayout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleNetworkItems: string[] = ['Mainnet', 'Testnet'];

const meta: Meta<ISideBar> = {
  title: 'Patterns/SideBarLayout',
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
      <SideBarLayout>
        <SideBar>
          <SideBarAppContext>
            <SideBarItem visual={<MonoWifiTethering />}>
              <Button variant="outlined" startVisual={<MonoWifiTethering />}>
                Mainnet
              </Button>
            </SideBarItem>
            <SideBarItem visual={<MonoControlPointDuplicate />}>
              <Button
                variant="outlined"
                startVisual={<MonoControlPointDuplicate />}
              >
                New Transfer
              </Button>
            </SideBarItem>
          </SideBarAppContext>
          <SideBarNavigation>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
            <SideBarItem>Dashboard</SideBarItem>
          </SideBarNavigation>
          <SideBarContext>
            <SideBarItem visual={<MonoControlPointDuplicate />}>
              <Button
                variant="outlined"
                startVisual={<MonoControlPointDuplicate />}
              >
                New Transfer
              </Button>
            </SideBarItem>

            <SideBarItemsInline>
              <SideBarItem visual={<MonoAccountTree />}>
                <Button variant="outlined" startVisual={<MonoAccountTree />}>
                  Profile
                </Button>
              </SideBarItem>
              <SideBarItem visual={<MonoLightMode />}>
                <Button variant="transparent" startVisual={<MonoLightMode />} />
              </SideBarItem>
            </SideBarItemsInline>
          </SideBarContext>
        </SideBar>

        <main style={{ gridArea: 'sidebarlayout-main' }}>content</main>

        <SideBarFooter>
          <SideBarFooterItem startVisual={<MonoWindow />} onPress={() => {}} />
          <SideBarFooterItem
            startVisual={<MonoWifiTethering />}
            onPress={() => {}}
          />
          <SideBarFooterItem
            startVisual={<MonoWorkspaces />}
            onPress={() => {}}
          />
          <SideBarFooterItem
            startVisual={<MonoLightMode />}
            onPress={() => {}}
          />
        </SideBarFooter>
      </SideBarLayout>
    );
  },
};

export default meta;
