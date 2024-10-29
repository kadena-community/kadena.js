import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';

import {
  MonoAccountTree,
  MonoControlPointDuplicate,
  MonoLightMode,
  MonoWallet,
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
import { useSideBar } from './components/SideBarProvider';
import { SideBarTree } from './components/SideBarTree';
import { SideBarTreeItem } from './components/SideBarTreeItem';
import type { ISideBarProps } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarLayout } from './SideBarLayout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleNetworkItems: string[] = ['Mainnet', 'Testnet'];

const meta: Meta<ISideBarProps> = {
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

type IStory = StoryObj<ISideBarProps>;

const InnerLayout = () => {
  const { setAppContext, isExpanded } = useSideBar();

  useEffect(() => {
    setAppContext({
      visual: <MonoAccountTree />,
      label: 'New Transfer',
      onPress: () => {},
    });
  }, []);

  return (
    <>
      <SideBar>
        <SideBarAppContext>
          <SideBarItem
            visual={<MonoWifiTethering />}
            label="Mainnet"
            onPress={() => {}}
          />
        </SideBarAppContext>
        <SideBarNavigation>
          <SideBarTree visual={<MonoWallet />} label="My Wallet">
            <SideBarTreeItem label="Accounts" onPress={() => {}} />
            <SideBarTreeItem label="Assets" onPress={() => {}} />
          </SideBarTree>
          <SideBarItem
            visual={<MonoControlPointDuplicate />}
            label="Dashboard"
            onPress={() => {}}
          />
        </SideBarNavigation>
        <SideBarContext>
          <SideBarItem
            visual={<MonoControlPointDuplicate />}
            label="New Transfer"
            onPress={() => {}}
          />

          <SideBarItemsInline>
            <SideBarItem
              visual={<MonoAccountTree />}
              label="Profile"
              onPress={() => {}}
            />

            <SideBarItem
              visual={<MonoLightMode />}
              label="Change theme"
              onPress={() => {}}
            >
              <Button
                aria-label="Change theme"
                variant={isExpanded ? 'transparent' : 'outlined'}
                isCompact={!isExpanded}
                startVisual={<MonoLightMode />}
                onPress={() => {}}
              />
            </SideBarItem>
          </SideBarItemsInline>
        </SideBarContext>
      </SideBar>

      <main style={{ gridArea: 'sidebarlayout-main' }}>content</main>

      <SideBarFooter>
        <SideBarFooterItem
          visual={<MonoWindow />}
          onPress={() => {}}
          label="option 1"
        />
        <SideBarFooterItem
          visual={<MonoWifiTethering />}
          onPress={() => {}}
          label="option 2"
        />
        <SideBarFooterItem
          visual={<MonoWorkspaces />}
          onPress={() => {}}
          label="option 3"
        />
        <SideBarFooterItem
          visual={<MonoLightMode />}
          onPress={() => {}}
          label="option 4"
        />
      </SideBarFooter>
    </>
  );
};

export const Primary: IStory = {
  name: 'SideBar',

  args: {},
  render: () => {
    return (
      <SideBarLayout>
        <InnerLayout />
      </SideBarLayout>
    );
  },
};

export default meta;
