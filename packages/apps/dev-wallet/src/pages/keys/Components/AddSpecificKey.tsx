import { useWallet } from '@/modules/wallet/wallet.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { MonoDoNotDisturb } from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export function AddSpecificKey({
  keySource,
  isOpen,
}: {
  keySource: IKeySource;
  isOpen: boolean;
}) {
  const [index, setIndex] = useState('');
  const { createKey } = useWallet();
  const isAvailable = !keySource.keys.find((k) => k.index === parseInt(index));
  const [error, setError] = useState<string | null>(null);
  const { setIsRightAsideExpanded } = useSideBarLayout();
  return (
    <RightAside isOpen={isOpen}>
      <RightAsideHeader label="Add Specific Key" />
      <RightAsideContent>
        <Stack gap={'md'} flexDirection={'column'}>
          <form
            style={{ display: 'contents' }}
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (index && isAvailable) {
                createKey(keySource, parseInt(index))
                  .then(() => {
                    setIndex('');
                    setIsRightAsideExpanded(false);
                  })
                  .catch((e) => {
                    setError(getErrorMessage(e));
                  });
              }
            }}
          >
            <Heading variant="h5">Add {keySource.source} key</Heading>
            <TextField
              label="Key Index"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              type="number"
              placeholder="e.g 123"
            />
            {!isAvailable && (
              <Text>
                <Stack gap={'xs'} alignItems={'center'}>
                  <MonoDoNotDisturb /> This index is already created
                </Stack>
              </Text>
            )}
            {error && (
              <Notification intent="negative" role="alert">
                {error}
              </Notification>
            )}
            <Button type="submit" isDisabled={!isAvailable}>
              Add Key
            </Button>
          </form>
        </Stack>
      </RightAsideContent>
    </RightAside>
  );
}
