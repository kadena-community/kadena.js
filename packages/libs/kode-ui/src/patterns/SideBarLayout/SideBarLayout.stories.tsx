import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  MonoAccountTree,
  MonoControlPointDuplicate,
  MonoLightMode,
  MonoWifiTethering,
} from '@kadena/kode-icons/system';
import { Button, MediaContextProvider } from './../../components';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarContext } from './components/SideBarContext';
import { SideBarFooter } from './components/SideBarFooter';
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
      <MediaContextProvider>
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
                    ProfileX
                  </Button>
                </SideBarItem>
                <SideBarItem visual={<MonoLightMode />}>
                  <Button
                    variant="transparent"
                    startVisual={<MonoLightMode />}
                  />
                </SideBarItem>
              </SideBarItemsInline>
            </SideBarContext>
          </SideBar>

          <main
            style={{ gridArea: 'sidebarlayout-main', backgroundColor: 'green' }}
          >
            content
          </main>

          <SideBarFooter>sdf</SideBarFooter>
        </SideBarLayout>
      </MediaContextProvider>
    );
  },
};

export default meta;
