import { Mono123, MonoKey } from '@kadena/kode-icons/system';
import { Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useParams } from 'react-router-dom';
import { Keys } from './Components/Keys';
import { KeySets } from './Components/KeySets';

export function KeysPage() {
  const { tab = 'keys' } = useParams();
  useLayout({
    breadCrumbs: [
      {
        label: 'Manage Your Keys',
        visual: <MonoKey />,
        url: '/key-management/keys',
      },
    ],
  });

  return (
    <Stack flexDirection={'column'} gap={'lg'}>
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
  );
}
