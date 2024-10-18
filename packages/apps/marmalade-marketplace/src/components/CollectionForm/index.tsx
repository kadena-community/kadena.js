import { Stack, Text, TextField } from '@kadena/kode-ui';
import React, { FC } from 'react';

import { CardContentBlock } from '@kadena/kode-ui/patterns';

interface CollectionFormProps {
  collectionInput: { [key: string]: string };
  handleCollectionInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CollectionForm: FC<CollectionFormProps> = ({
  collectionInput,
  handleCollectionInputChange,
}) => (
  <CardContentBlock
    title="Collection"
    supportingContent={
      <Stack flexDirection="column" width="100%" gap="md">
        <Text>Provide a Collection ID</Text>
      </Stack>
    }
  >
    <TextField
      label="Collection ID"
      name="collectionId"
      value={collectionInput.collectionId}
      onChange={handleCollectionInputChange}
    />
  </CardContentBlock>
);

export default CollectionForm;
