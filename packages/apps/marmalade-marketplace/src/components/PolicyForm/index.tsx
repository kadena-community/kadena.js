import React, { FC } from 'react';
import { Heading, Checkbox } from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';
import { ICreateTokenPolicyConfig } from "@kadena/client-utils/marmalade";

interface PolicyFormProps {
  policyConfig: ICreateTokenPolicyConfig;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PolicyForm: FC<PolicyFormProps> = ({ policyConfig, handleCheckboxChange }) => (
      <>
      Available Concrete Policies
          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxStyle}>
              <Checkbox>Collection</Checkbox>
            </div>
            <div className={styles.checkboxStyle}>
              <Checkbox>Guard</Checkbox>
            </div>
            <div className={styles.checkboxStyle}>
              <Checkbox>Royalty</Checkbox>
            </div>
            <div className={styles.checkboxStyle}>
              <Checkbox>Non-fungible</Checkbox>
            </div>
            <div className={styles.checkboxStyle}>
              <Checkbox>Non-upgradable URI</Checkbox>
            </div>
          </div>
            {/* <div  className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="nonUpdatableURI"
                name="nonUpdatableURI"
                checked={policyConfig.nonUpdatableURI}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="nonUpdatableURI">Non-Updatable URI</label>
            </div>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="guarded"
                name="guarded"
                checked={policyConfig.guarded}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="guarded">Guarded</label>
            </div>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="nonFungible"
                name="nonFungible"
                checked={policyConfig.nonFungible}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="nonFungible">Non-Fungible</label>
            </div>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="hasRoyalty"
                name="hasRoyalty"
                checked={policyConfig.hasRoyalty}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="hasRoyalty">Has Royalty</label>
            </div>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="collection"
                name="collection"
                checked={policyConfig.collection}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="collection">Collection</label>
            </div> */}
    </>
);

export default PolicyForm;
