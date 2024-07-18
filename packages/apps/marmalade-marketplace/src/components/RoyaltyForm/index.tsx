import React, { FC } from 'react';
import { TextField } from '@kadena/kode-ui';
import CrudCard from '@/components/CrudCard';


interface RoyaltyFormProps {
  royaltyInput: { [key: string]: string };
  handleRoyaltyInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoyaltyForm: FC<RoyaltyFormProps> = ({ royaltyInput, handleRoyaltyInputChange }) => (
  <CrudCard
      title="Royalty "
      description={[
        "Provide Royalty Information"
      ]}
    >
    <TextField label="Royalty Fungible" name="royaltyFungible" value={royaltyInput.royaltyFungible} onChange={handleRoyaltyInputChange} disabled />
    <TextField label="Royalty Creator" name="royaltyCreator" value={royaltyInput.royaltyCreator} onChange={handleRoyaltyInputChange} disabled/>
    <TextField label="Royalty Guard" name="royaltyGuard" value={royaltyInput.royaltyGuard} onChange={handleRoyaltyInputChange} disabled/>
    <TextField label="Royalty Rate" name="royaltyRate" value={royaltyInput.royaltyRate} onChange={handleRoyaltyInputChange} />
  </CrudCard>
);

export default RoyaltyForm;
