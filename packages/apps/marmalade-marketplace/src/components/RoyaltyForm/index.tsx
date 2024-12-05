import { Stack, Text, TextField } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import React, { FC } from 'react';

interface RoyaltyFormProps {
  royaltyInput: { [key: string]: any };
  handleRoyaltyInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoyaltyForm: FC<RoyaltyFormProps> = ({
  royaltyInput,
  handleRoyaltyInputChange,
}) => (
  <CardContentBlock
    title="Royalty"
    supportingContent={
      <Stack flexDirection="column" width="100%" gap="md">
        <Text>Provide Royalty Information</Text>
      </Stack>
    }
  >
    <TextField
      label="Royalty Fungible"
      name="royaltyFungible"
      value={royaltyInput.royaltyFungible}
      onChange={handleRoyaltyInputChange}
      disabled
    />
    <TextField
      label="Royalty Creator"
      name="royaltyCreator"
      value={royaltyInput.royaltyCreator}
      onChange={handleRoyaltyInputChange}
      disabled
    />
    <TextField
      label="Royalty Guard"
      name="royaltyGuard"
      value={JSON.stringify(royaltyInput.royaltyGuard)}
      onChange={handleRoyaltyInputChange}
      disabled
    />
    <TextField
      label="Royalty Rate"
      name="royaltyRate"
      value={royaltyInput.royaltyRate}
      onChange={handleRoyaltyInputChange}
    />
  </CardContentBlock>
);

export default RoyaltyForm;
