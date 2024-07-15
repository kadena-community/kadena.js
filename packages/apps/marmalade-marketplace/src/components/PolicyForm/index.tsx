import React, { FC } from 'react';
import { Heading } from '@kadena/kode-ui';
import * as styles from '@/styles/create-token.css';
import { ICreateTokenPolicyConfig } from "@kadena/client-utils/marmalade";

interface PolicyFormProps {
  policyConfig: ICreateTokenPolicyConfig;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PolicyForm: FC<PolicyFormProps> = ({ policyConfig, handleCheckboxChange }) => (
    <>
        Available Concrete Policies
        <br/>
        <div className={styles.checkboxRow}>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                id="nonUpdatableURI"
                name="nonUpdatableURI"
                checked={policyConfig.nonUpdatableURI}
                onChange={handleCheckboxChange}
              />
              <label className={styles.checkboxLabel} htmlFor="nonUpdatableURI">Non-Updatable URI</label>
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
              <label className={styles.checkboxLabel} htmlFor="guarded">Guarded</label>
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
              <label className={styles.checkboxLabel} htmlFor="nonFungible">Non Fungible</label>
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
              <label className={styles.checkboxLabel} htmlFor="hasRoyalty">Has Royalty</label>
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
              <label className={styles.checkboxLabel} htmlFor="collection">Collection</label>
            </div>
      </div>
    </>
);

export default PolicyForm;
