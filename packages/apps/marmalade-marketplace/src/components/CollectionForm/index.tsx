import React, { FC } from 'react';
import { TextField, Button } from '@kadena/react-ui';
import * as styles from '@/styles/create-token.css';

interface CollectionFormProps {
  collectionInput: { [key: string]: string };
  handleCollectionInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CollectionForm: FC<CollectionFormProps> = ({ collectionInput, handleCollectionInputChange,  }) => (
  <div className={styles.formSection}>
    <TextField label="Collection ID" name="collectionId" value={collectionInput.collectionId} onChange={handleCollectionInputChange} />
    </div>
);

export default CollectionForm;