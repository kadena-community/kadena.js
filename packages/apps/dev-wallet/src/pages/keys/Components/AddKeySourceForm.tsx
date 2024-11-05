import { KeySourceType } from '@/modules/wallet/wallet.repository';
import { Button, Checkbox, Divider, Stack, Text } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export function AddKeySourceForm({
  close,
  onSave,
  installed,
  isOpen,
}: {
  installed: KeySourceType[];
  close: () => void;
  onSave: (sourcesToInstall: KeySourceType[]) => void;
  isOpen: boolean;
}) {
  const [localInstalled, setLocalInstalled] =
    useState<KeySourceType[]>(installed);

  const onChange = (source: KeySourceType) => (isSelected: boolean) => {
    if (isSelected) {
      setLocalInstalled([...localInstalled, source]);
    } else if (!installed.includes(source)) {
      setLocalInstalled(localInstalled.filter((i) => i !== source));
    }
  };
  const checkBoxProps = (source: KeySourceType) => ({
    isDisabled: installed.includes(source),
    onChange: onChange(source),
    isSelected: localInstalled.includes(source),
  });

  return (
    <RightAside isOpen={isOpen}>
      <RightAsideHeader label="Add Key Source" />
      <RightAsideContent>
        <Stack flexDirection={'column'} gap={'sm'} paddingBlockStart={'lg'}>
          <Stack flexDirection={'column'} gap={'sm'}>
            <Checkbox {...checkBoxProps('HD-BIP44')}>BIP44 algorithm</Checkbox>
            <Text size="small">
              This is the default and recommended algorithm for generating keys.
            </Text>
          </Stack>
          <Divider />
          <Stack flexDirection={'column'} gap={'sm'}>
            <Checkbox {...checkBoxProps('HD-chainweaver')}>
              Legacy algorithm (chainweaver 1)
            </Checkbox>
            <Text size="small">
              This is a legacy algorithm used in chainweaver 1, it's not
              recommended to use it for new wallets, use this only if you have a
              wallet created in chainweaver 1
            </Text>
          </Stack>
          <Divider />
          <Stack flexDirection={'column'} gap={'sm'}>
            <Checkbox {...checkBoxProps('web-authn')}>
              WebAuthn External keys (Experimental)
            </Checkbox>
            <Text size="small">
              This is an experimental feature that allows you to use your
              compatible devices to generate keys, The keys are stored in the
              device and cant be recovered with the wallet if lost the device
            </Text>
          </Stack>
        </Stack>
      </RightAsideContent>
      <RightAsideFooter>
        <Button variant="outlined" onPress={() => close()}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={() =>
            onSave(localInstalled.filter((i) => !installed.includes(i)))
          }
        >
          Save
        </Button>
      </RightAsideFooter>
    </RightAside>
  );
}
