import {
  MonoAccountTree,
  MonoAdd,
  MonoControlPointDuplicate,
  MonoInsertDriveFile,
  MonoLightMode,
  MonoMoreVert,
  MonoWallet,
  MonoWifiTethering,
  MonoWindow,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { useNotifications } from '../LayoutUtils';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogHeader,
  Stack,
} from './../../components';
import { SideBarBreadcrumbs } from './components/Breadcrumbs/SideBarBreadcrumbs';
import { SideBarBreadcrumbsItem } from './components/Breadcrumbs/SideBarBreadcrumbsItem';
import { LayoutProvider, useLayout } from './components/LayoutProvider';
import { KLogoText } from './components/Logo/KLogoText';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
} from './components/RightAside';
import { SideBarFooter } from './components/SideBarFooter';
import { SideBarFooterItem } from './components/SideBarFooterItem';
import { SideBarHeaderContext } from './components/SideBarHeaderContext/SideBarHeaderContext';
import { SideBarItem } from './components/SideBarItem';
import { SideBarItemsInline } from './components/SideBarItemsInline';
import { SideBarTree } from './components/SideBarTree';
import { SideBarTreeItem } from './components/SideBarTreeItem';
import { TopBanner } from './components/TopBanner/TopBanner';
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

const InnerFooter = () => {
  return (
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
  );
};

const InnerLayout = () => {
  const { isExpanded, setIsRightAsideExpanded, isRightAsideExpanded } =
    useLayout();
  const [hasOpenSidebar, setHasOpenSidebar] = useState(false);
  const [hasOpenOtherSidebar, setHasOpenOtherSidebar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [hideTopBanner, setHideTopBanner] = useState(false);

  return (
    <>
      {openDialog && (
        <Dialog
          isOpen
          onOpenChange={() => {
            setOpenDialog(false);
          }}
        >
          <DialogHeader>Header of dialog</DialogHeader>
        </Dialog>
      )}
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
          <RightAsideContent>
            content
            <Button
              onPress={() => {
                setOpenDialog(true);
              }}
            >
              Open Dialog on TOP of Sidebar
            </Button>
          </RightAsideContent>
        </RightAside>
      )}
      <SideBarLayout
        logo={
          <a href="https://kadena.io" target="_blank" rel="noreferrer">
            <KLogoText />
          </a>
        }
        location={{
          url: 'https://kadena.io',
          push: console.log,
        }}
        sidebar={
          <SideBar
            logo={
              <a href="https://kadena.io" target="_blank" rel="noreferrer">
                <KLogoText />
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
            appContext={
              <SideBarItem visual={<MonoMoreVert />} label="Select Asset">
                <ButtonGroup fullWidth>
                  <Button
                    startVisual={<MonoAdd />}
                    textAlign="start"
                    isCompact
                    variant="outlined"
                  >
                    {isExpanded ? 'Asset Switch' : undefined}
                  </Button>
                  {isExpanded && (
                    <Button
                      isCompact
                      variant="outlined"
                      startVisual={<MonoMoreVert />}
                    />
                  )}
                </ButtonGroup>
              </SideBarItem>
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
        footer={<InnerFooter />}
      >
        <TopBanner>
          {!hideTopBanner ? (
            <Stack
              style={{
                paddingBlock: '10px',
                background: 'green',
                width: '100%',
                paddingInline: '10px',
              }}
            >
              topbanner
              <Stack flex={1} />
              <Button
                onPress={() => {
                  setHideTopBanner(true);
                }}
              >
                Hide
              </Button>
            </Stack>
          ) : (
            <></>
          )}
        </TopBanner>
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
        <SideBarHeaderContext>
          <Button variant="transparent" startVisual={<MonoInsertDriveFile />} />
        </SideBarHeaderContext>
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

const NotificationsLayout = () => {
  const { addNotification } = useNotifications();
  const { isExpanded, setIsRightAsideExpanded, isRightAsideExpanded } =
    useLayout();

  return (
    <>
      {isRightAsideExpanded && (
        <RightAside
          isOpen
          onClose={() => {
            setIsRightAsideExpanded(false);
          }}
        >
          <RightAsideHeader label="test header" />

          <RightAsideContent>content</RightAsideContent>
        </RightAside>
      )}
      <SideBarLayout
        logo={
          <a href="https://kadena.io" target="_blank" rel="noreferrer">
            <KLogoText />
          </a>
        }
        location={{
          url: 'https://kadena.io',
          push: console.log,
        }}
        sidebar={
          <SideBar
            logo={
              <a href="https://kadena.io" target="_blank" rel="noreferrer">
                <KLogoText />
              </a>
            }
            navigation={
              <>
                <SideBarItem
                  visual={<MonoWifiTethering />}
                  label="Mainnet"
                  href="javascript:void()"
                />
              </>
            }
            context={
              <>
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
        footer={<InnerFooter />}
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
            <p>content</p>

            <Button
              onPress={() => {
                setIsRightAsideExpanded(true);
              }}
            >
              Open sidebar
            </Button>

            <Button
              onPress={() => {
                addNotification({
                  icon: <MonoAccountTree />,
                  label: 'This is an error Notification',
                  message: 'And this is the message',
                  intent: 'negative',
                });
              }}
            >
              Add Error Notification
            </Button>

            <Button
              onPress={() => {
                addNotification({
                  icon: <MonoAccountTree />,
                  label: 'This is an info Notification',
                  message: 'And this is the info message',
                  isDismissable: true,
                  url: 'https://explorer.kadena.io',
                });
              }}
            >
              Add Info Notification
            </Button>
          </Stack>
        </Stack>
      </SideBarLayout>
    </>
  );
};

export const Notifications: IStory = {
  name: 'Notifications',

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
        </SideBarBreadcrumbs>
        <NotificationsLayout />
      </LayoutProvider>
    );
  },
};

export default meta;
