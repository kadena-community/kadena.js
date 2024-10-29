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
import { SideBarHeader } from './components/SideBarHeader';
import { SideBarItem } from './components/SideBarItem';
import { SideBarItemsInline } from './components/SideBarItemsInline';
import { SideBarNavigation } from './components/SideBarNavigation';
import { SideBarProvider, useSideBar } from './components/SideBarProvider';
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
  const { setAppContext, isExpanded, setBreadCrumbs } = useSideBar();

  useEffect(() => {
    setAppContext({
      visual: <MonoAccountTree />,
      label: 'New Transfer',
      onPress: () => {},
    });

    setBreadCrumbs([
      { visual: <MonoAccountTree />, label: 'He-man', url: '/accounts' },
      { label: 'Skeletor', url: '/accounts' },
    ]);
  }, []);

  return (
    <SideBarLayout
      topBanner={<div>topbanner</div>}
      breadcrumbs={<div>sdfsf</div>}
      sidebar={
        <SideBar
          appContext={
            <SideBarItem
              visual={<MonoWifiTethering />}
              label="Mainnet"
              onPress={() => {}}
            />
          }
          navigation={
            <>
              <SideBarTree visual={<MonoWallet />} label="My Wallet">
                <SideBarTreeItem label="Accounts" onPress={() => {}} />
                <SideBarTreeItem label="Assets" onPress={() => {}} />
              </SideBarTree>
              <SideBarItem
                visual={<MonoControlPointDuplicate />}
                label="Dashboard"
                onPress={() => {}}
              />
            </>
          }
          context={
            <>
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
            </>
          }
        />
      }
      footer={
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
      }
    >
      content
    </SideBarLayout>
  );
};

export const Primary: IStory = {
  name: 'SideBar',

  args: {},
  render: () => {
    return (
      <SideBarProvider>
        <InnerLayout />
      </SideBarProvider>
    );
  },
};

const InnerLayoutFull = () => {
  return <SideBarLayout variant="full">content</SideBarLayout>;
};

export const Full: IStory = {
  name: 'Full centered layout',

  args: {},
  render: () => {
    return (
      <SideBarProvider>
        <InnerLayoutFull />
      </SideBarProvider>
    );
  },
};

export default meta;
