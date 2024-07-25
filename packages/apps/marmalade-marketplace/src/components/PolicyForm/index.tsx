import React, { FC } from 'react';
import { Checkbox } from '@kadena/kode-ui';
import * as styles from './style.css';

interface PolicyFormProps {
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const PolicyForm: FC<PolicyFormProps> = ({ handleCheckboxChange }) => (
    <>
      Available Concrete Policies
      <br/>
      <div className={styles.checkboxRow}>
        <Checkbox id="nonUpdatableURI" onChange={(isSelected) => handleCheckboxChange( 'nonUpdatableURI', isSelected) }>Non-Updatable URI</Checkbox>
        <Checkbox id="guarded" onChange={(isSelected) => handleCheckboxChange( 'guarded', isSelected) }>Guarded</Checkbox>
      </div>
      <div className={styles.checkboxRow}>
        <Checkbox id="nonFungible" onChange={(isSelected) => handleCheckboxChange( 'nonFungible', isSelected) }>Non Fungible</Checkbox>
        <Checkbox id="hasRoyalty" onChange={(isSelected) => handleCheckboxChange( 'hasRoyalty', isSelected) }>Has Royalty</Checkbox>
      </div>
      <div className={styles.checkboxRow}>
        <Checkbox id="collection" onChange={(isSelected) => handleCheckboxChange( 'collection', isSelected) }>Collection</Checkbox>
      </div>
    </>
);

export default PolicyForm;