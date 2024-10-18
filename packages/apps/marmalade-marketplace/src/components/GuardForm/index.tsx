import { Checkbox, Stack, Text, TextField } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import React, { FC } from 'react';

interface GuardFormProps {
  guardInput: { [key: string]: any };
  handleGuardInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGuardExcludeChange: (name: string, checked: boolean) => void;
  excluded: string;
}

const GuardForm: FC<GuardFormProps> = ({
  guardInput,
  handleGuardInputChange,
  handleGuardExcludeChange,
  excluded,
}) => (
  <CardContentBlock
    title="Guard"
    supportingContent={
      <Stack flexDirection="column" width="100%" gap="md">
        <Text>Provide Guards for the token</Text>
      </Stack>
    }
  >
    <TextField
      label="URI Guard"
      name="uriGuard"
      value={JSON.stringify(guardInput.uriGuard)}
      disabled
      endAddon={
        <Checkbox
          isSelected={guardInput.uriGuard === excluded}
          onChange={(e) => handleGuardExcludeChange('uriGuard', e)}
        >
          Exclude
        </Checkbox>
      }
    />
    <TextField
      label="Mint Guard"
      name="mintGuard"
      value={JSON.stringify(guardInput.mintGuard)}
      disabled
      endAddon={
        <Checkbox
          isSelected={guardInput.mintGuard === excluded}
          onChange={(e) => handleGuardExcludeChange('mintGuard', e)}
        >
          Exclude
        </Checkbox>
      }
    />
    <TextField
      label="Burn Guard"
      name="burnGuard"
      value={JSON.stringify(guardInput.burnGuard)}
      disabled
      endAddon={
        <Checkbox
          isSelected={guardInput.burnGuard === excluded}
          onChange={(e) => handleGuardExcludeChange('burnGuard', e)}
        >
          Exclude
        </Checkbox>
      }
    />
    <TextField
      label="Sale Guard"
      name="saleGuard"
      value={JSON.stringify(guardInput.saleGuard)}
      disabled
      endAddon={
        <Checkbox
          isSelected={guardInput.saleGuard === excluded}
          onChange={(e) => handleGuardExcludeChange('saleGuard', e)}
        >
          Exclude
        </Checkbox>
      }
    />
    <TextField
      label="Transfer Guard"
      name="transferGuard"
      value={JSON.stringify(guardInput.transferGuard)}
      disabled
      endAddon={
        <Checkbox
          isSelected={guardInput.transferGuard === excluded}
          onChange={(e) => handleGuardExcludeChange('transferGuard', e)}
        >
          Exclude
        </Checkbox>
      }
    />
  </CardContentBlock>
);

export default GuardForm;
