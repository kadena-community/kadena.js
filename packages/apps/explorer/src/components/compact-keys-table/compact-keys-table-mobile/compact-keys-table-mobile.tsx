import { Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ICompactKeyTableProps } from '../types';
import {
  dataFieldClass,
  dataFieldLinkClass,
  headerClass,
  rowClass,
  sectionClass,
} from './styles.css';

const CompactTransactionsTableMobile: FC<ICompactKeyTableProps> = ({
  keys,
}) => {
  return keys.map((key, index) => (
    <section key={index} className={sectionClass}>
      <div className={rowClass}>
        <span className={headerClass}>ChainId</span>
        {key.chainId}
      </div>
      <div className={rowClass}>
        <span className={headerClass}>Key</span>
        <Text variant="code" className={dataFieldClass}>
          {key.key}
        </Text>
      </div>
      <div className={rowClass}>
        <span className={headerClass}>Predicate</span>
        <span className={dataFieldLinkClass}>
          <Text variant="code" className={dataFieldClass}>
            {key.predicate}
          </Text>
        </span>
      </div>
    </section>
  ));
};
export default CompactTransactionsTableMobile;
