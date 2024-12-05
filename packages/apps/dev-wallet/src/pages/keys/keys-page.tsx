import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { Mono123, MonoKey } from '@kadena/kode-icons/system';
import { Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useParams } from 'react-router-dom';
import { Keys } from './Components/Keys';
import { KeySets } from './Components/KeySets';

export function KeysPage() {
  const { tab = 'keys' } = useParams();

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoKey />} isGlobal>
        <SideBarBreadcrumbsItem href="/key-management/keys">
          Manage Your Keys
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <Stack flexDirection={'column'} gap={'lg'} width="100%">
        <Heading>Manage Your Keys</Heading>
        <Tabs defaultSelectedKey={tab}>
          <TabItem
            key={'keys'}
            title={
              <Stack justifyContent={'center'} alignItems={'center'} gap={'md'}>
                <MonoKey />
                <Text>Your Keys</Text>
              </Stack>
            }
          >
            <Keys />
          </TabItem>
          <TabItem
            key={'keysets'}
            title={
              <Stack justifyContent={'center'} alignItems={'center'} gap={'md'}>
                <Mono123 />
                <Text>Your Key Sets</Text>
              </Stack>
            }
          >
            <KeySets />
          </TabItem>
        </Tabs>
      </Stack>
    </>
  );
}
