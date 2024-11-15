import {
  MonoAccountTree,
  MonoControlPointDuplicate,
  MonoLightMode,
  MonoWallet,
  MonoWifiTethering,
  MonoWindow,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { Button, Stack } from './../../components';
import { SideBarBreadcrumbs } from './components/Breadcrumbs/SideBarBreadcrumbs';
import { SideBarBreadcrumbsItem } from './components/Breadcrumbs/SideBarBreadcrumbsItem';
import { LayoutProvider, useLayout } from './components/LayoutProvider';
import { KLogo } from './components/Logo/KLogo';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
} from './components/RightAside';
import { SideBarFooter } from './components/SideBarFooter';
import { SideBarFooterItem } from './components/SideBarFooterItem';
import { SideBarItem } from './components/SideBarItem';
import { SideBarItemsInline } from './components/SideBarItemsInline';
import { SideBarTree } from './components/SideBarTree';
import { SideBarTreeItem } from './components/SideBarTreeItem';
import type { ISideBarProps } from './SideBar';
import { SideBar } from './SideBar';
import { SideBarLayout } from './SideBarLayout';
import './storybook.css';

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
        component:
          'A component that will set the layout for your app. All with header, footer and sidebar. The layout is setup that you can choose your own routing system. whether its Next or reactRouter. \nThe actual routes are set in your app',
      },
    },
  },
  argTypes: {},
};

type IStory = StoryObj<ISideBarProps>;

const LinkComponent: FC<PropsWithChildren<{ to: string }>> = ({
  children,
  ...props
}) => {
  return <a {...props}>{children}</a>;
};

const InnerLayout = () => {
  const { isExpanded, setIsRightAsideExpanded, isRightAsideExpanded } =
    useLayout();
  const [hasOpenSidebar, setHasOpenSidebar] = useState(false);
  const [hasOpenOtherSidebar, setHasOpenOtherSidebar] = useState(false);

  return (
    <>
      {isRightAsideExpanded && hasOpenSidebar && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenSidebar(false);
          }}
        >
          <RightAsideHeader label="test header" />
          <RightAsideContent>content</RightAsideContent>
        </RightAside>
      )}

      {isRightAsideExpanded && hasOpenOtherSidebar && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenOtherSidebar(false);
          }}
        >
          <RightAsideHeader label="test header" />
          <RightAsideContent>content</RightAsideContent>
        </RightAside>
      )}
      <SideBarLayout
        logo={
          <a href="https://kadena.io" target="_blank" rel="noreferrer">
            <KLogo height={40} />
          </a>
        }
        location={{
          url: 'https://kadena.io',
          push: console.log,
        }}
        topBanner={
          <div
            style={{ paddingBlock: '10px', background: 'green', width: '100%' }}
          >
            topbanner
          </div>
        }
        sidebar={
          <SideBar
            logo={
              <a href="https://kadena.io" target="_blank" rel="noreferrer">
                <KLogo height={40} />
              </a>
            }
            navigation={
              <>
                <SideBarItem
                  visual={<MonoWifiTethering />}
                  label="Mainnet"
                  href="javascript:void()"
                />
                <SideBarTree visual={<MonoWallet />} label="My Wallet">
                  <SideBarTreeItem label="Accounts" href="https://kadena.io" />
                  <SideBarTreeItem
                    label="Assets"
                    href="https://docs.kadena.io"
                  />
                </SideBarTree>
                <SideBarTree visual={<MonoWallet />} label="My Wallet 2">
                  <SideBarTreeItem label="Accounts" href="https://kadena.io" />
                  <SideBarTreeItem
                    label="Assets"
                    href="https://docs.kadena.io"
                  />
                </SideBarTree>
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
              component={LinkComponent}
              href="https://kadena.io"
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
        <Stack
          flexDirection="column"
          style={{ maxWidth: '800px', height: '400px' }}
        >
          <Stack
            width="100%"
            flexDirection="column"
            justifyContent="center"
            margin="md"
            gap="md"
          >
            <Button
              onPress={() => {
                setIsRightAsideExpanded(true);
                setHasOpenSidebar(true);
              }}
            >
              open sidebar
            </Button>

            <Button
              onPress={() => {
                setIsRightAsideExpanded(true);
                setHasOpenOtherSidebar(true);
              }}
            >
              open other sidebar
            </Button>
          </Stack>
          content
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
          <p>content</p>
        </Stack>
      </SideBarLayout>
    </>
  );
};

export const Primary: IStory = {
  name: 'SideBar',

  args: {},
  render: () => {
    return (
      <LayoutProvider>
        <SideBarBreadcrumbs icon={<MonoAccountTree />}>
          <SideBarBreadcrumbsItem href="/accounts">
            He-man
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href="/accounts/2">
            Skeletor
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href="/accounts/2">
            Cringer
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href="/accounts/2">
            Orko
          </SideBarBreadcrumbsItem>
          <SideBarBreadcrumbsItem href="/accounts/2">
            Masters of the Universe
          </SideBarBreadcrumbsItem>
        </SideBarBreadcrumbs>
        <InnerLayout />
      </LayoutProvider>
    );
  },
};

const InnerLayoutFull = () => {
  return (
    <SideBarLayout
      location={{
        url: 'https://kadena.io',
        push: console.log,
      }}
      logo={
        <a href="https://kadena.io" target="_blank" rel="noreferrer">
          <KLogo height={40} />
        </a>
      }
      variant="full"
    >
      <Stack style={{ maxWidth: '800px' }}>content</Stack>
    </SideBarLayout>
  );
};

export const Full: IStory = {
  name: 'Full centered layout',

  args: {},
  render: () => {
    return (
      <LayoutProvider>
        <InnerLayoutFull />
      </LayoutProvider>
    );
  },
};

export default meta;
