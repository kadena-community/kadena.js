import React, { FC } from 'react';
import { TextField } from '@kadena/kode-ui';
import CrudCard from '@/components/CrudCard';

interface CollectionFormProps {
  collectionInput: { [key: string]: string };
  handleCollectionInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CollectionForm: FC<CollectionFormProps> = ({ collectionInput, handleCollectionInputChange,  }) => (
  <CrudCard
    title="Collection"
    description={[
      "Provide a Collection ID"
    ]}
  >
    <TextField label="Collection ID" name="collectionId" value={collectionInput.collectionId} onChange={handleCollectionInputChange} />
  </CrudCard>
);

export default CollectionForm;
