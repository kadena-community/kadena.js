/* eslint no-eval: 0 */
'use client';
import { ToggleSwitch } from '@/app/components/ToggleSwitch';
import styles from './customizer.module.scss';

import React, { FC, useState } from 'react';
import { Icon } from '@/app/components/Icon';
import { Code } from '@/app/components/Code';

export const PolicyCustomizer: FC = () => {

  const [quote, setQuote] = useState<boolean>(true);
  const [nfp, setNfp] = useState<boolean>(true);
  const [royalty, setRoyalty] = useState<boolean>(false);
  const [collection, setCollection] = useState<boolean>(false);
  const [guard, setGuard] = useState<boolean>(true);

  const onQuoteChange = (checked: boolean): void => {
    setQuote(checked);
  }
  const onNfpChange = (checked: boolean): void => {
    setNfp(checked);
  }
  const onRoyaltyChange = (checked: boolean): void  => {
    setRoyalty(checked);
  }
  const onCollectionChange = (checked: boolean): void  => {
    setCollection(checked);
  }
  const onGuardChange = (checked: boolean): void  => {
    setGuard(checked);
  }

  const defaultState = (quote && nfp && guard)
  let constName = (defaultState) ? 'DEFAULT' : 'EMPTY'; 
  if (!defaultState && quote) {
    constName += '_QUOTE'
  }
  if (!defaultState && nfp) {
    constName += '_NFP'
  }
  if (!defaultState && guard) {
    constName += '_GUARD'
  }
  if (royalty) {
    constName += '_ROYALTY'
  }
  if (collection) {
    constName += '_COLLECTION'
  }

  const contentPolicies = [
    {
      name: 'quote',
      icon: 'file-replace-outline',
      title: 'Fungible Quote',
      description: 'Allows fungible sale, bidding',
      onChange: onQuoteChange
    },
    {
      name: 'nfp',
      icon: 'shield-sun',
      title: 'Non-fungible-policy',
      description: 'Makes tokens non-fungible',
      onChange: onNfpChange
    },
    {
      name: 'royalty',
      icon: 'chess-queen',
      title: 'Royalty',
      description: 'Native royalty payment to creator',
      onChange: onRoyaltyChange
    },
    {
      name: 'collection',
      icon: 'rhombus-split',
      title: 'Collection',
      description: 'Allows collection tracking',
      onChange: onCollectionChange
    },
    {
      name: 'guard',
      icon: 'account-child',
      title: 'Guard',
      description: 'Adds guards per action (mint guard)',
      onChange: onGuardChange
    }
  ]
  return (
    <div className="grid">
      <div>
        <h3 className="color-green">Customize</h3>
        <p>in the way you need it</p>
        <Code>
            {`(defconst ${constName}:object{concrete-policy}`}<br/>
            &nbsp;&nbsp; {`{ 'quote-policy: ${quote}`}<br/>
            &nbsp;&nbsp; {`,'non-fungible-policy: ${nfp}`}<br/>
            &nbsp;&nbsp; {`,'royalty-policy: ${royalty}`}<br/>
            &nbsp;&nbsp; {`,'collection-policy: ${collection}`}<br/>
            &nbsp;&nbsp; {`,'guard-policy: ${guard}`}<br/>
            {`})`}
        </Code>
      </div>
      <div className={styles['policy-selector']}>
        <h4>My Awesome token</h4>
        <p>Default general purpose policies</p>
        { contentPolicies.map((policy, index) => (
          <div key={index} className={styles['selector-row']}>
            <div className={styles['desc-row']}> 
              <Icon name={policy.icon} color="green" />
              <div>
                <p>{policy.title}</p>
                <span className={styles.description}>{policy.description}</span>
              </div>
            </div>
            <div>
              <ToggleSwitch name={policy.name} isChecked={ eval(policy.name) } onSwitchChange={policy.onChange} />
            </div>
          </div>
        )) }
      </div>
    </div>
  );
};