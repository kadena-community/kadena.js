import React, { FC } from 'react';
import { TextField } from '@kadena/react-ui';
import * as styles from '@/styles/create-token.css';

interface RoyaltyFormProps {
  royaltyInput: { [key: string]: string };
  handleRoyaltyInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoyaltyForm: FC<RoyaltyFormProps> = ({ royaltyInput, handleRoyaltyInputChange }) => (
  <div className={styles.formSection}>
    <TextField label="Royalty Fungible" name="royaltyFungible" value={royaltyInput.royaltyFungible} onChange={handleRoyaltyInputChange} disabled />
    <TextField label="Royalty Creator" name="royaltyCreator" value={royaltyInput.royaltyCreator} onChange={handleRoyaltyInputChange} />
    <TextField label="Royalty Guard" name="royaltyGuard" value={royaltyInput.royaltyGuard} onChange={handleRoyaltyInputChange} />
    <TextField label="Royalty Rate" name="royaltyRate" value={royaltyInput.royaltyRate} onChange={handleRoyaltyInputChange} />
  </div>
);

export default RoyaltyForm;