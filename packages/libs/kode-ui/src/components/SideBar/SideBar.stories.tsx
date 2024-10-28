import type { Meta, StoryObj } from '@storybook/react';
import type { MouseEventHandler } from 'react';
import React, { useState } from 'react';

import {
  MonoAccountTree,
  MonoAddCircleOutline,
  MonoControlPointDuplicate,
  MonoLightMode,
  MonoWifiTethering,
} from '@kadena/kode-icons/system';
import type { PressEvent } from 'react-aria';
import { Button } from '../Button';
import type { ISideBar } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarFooter } from './components/SideBarFooter';
import { SideBarHeader } from './components/SideBarHeader';
import { SideBarItem } from './components/SideBarItem';
import { SideBarItemsInline } from './components/SideBarItemsInline';
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
    const [isExpanded, setIsExpanded] = useState(true);

    const onExpand = (_e: PressEvent) => {
      setIsExpanded((v) => !v);
    };

    return (
      <SideBar isExpanded={isExpanded} onExpand={onExpand}>
        <SideBarHeader>
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
        </SideBarHeader>
        <SideBarNavigation>
          <SideBarItem label="nav item 1" />
        </SideBarNavigation>
        <SideBarFooter>
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
              <Button variant="transparent" startVisual={<MonoLightMode />} />
            </SideBarItem>
          </SideBarItemsInline>
        </SideBarFooter>
      </SideBar>
    );
  },
};

export default meta;
