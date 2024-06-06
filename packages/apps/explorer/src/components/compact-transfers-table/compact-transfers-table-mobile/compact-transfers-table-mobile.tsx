import type {
  ExecutionPayload,
  TransactionResult,
  Transfer,
} from '@/__generated__/sdk';
import {
  MonoArrowOutward,
  MonoCheck,
  MonoClear,
} from '@kadena/react-icons/system';
import { Badge, Text } from '@kadena/react-ui';
import React, { Fragment } from 'react';
import {
  badgeClass,
  dataFieldClass,
  dataFieldLinkClass,
  headerClass,
  iconLinkClass,
  linkClass,
  linkIconClass,
  rowClass,
  sectionClass,
} from './styles.css';

interface ICompacTransfersTableMobileProps {
  transfers: Transfer[];
}

const CompactTransactionsTableMobile: React.FC<
  ICompacTransfersTableMobileProps
> = ({ transfers }) => {
  return (
    <>
      {transfers.map((transfer, index) => (
        <section key={index} className={sectionClass}>
          <div className={rowClass}>
            <span className={headerClass}>Height</span>
            <span className={dataFieldLinkClass}>{transfer.height}</span>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>ChainId</span>
            <span className={dataFieldLinkClass}>{transfer.chainId}</span>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Amount</span>
            <span className={dataFieldLinkClass}>{transfer.amount} KDA</span>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Sender</span>
            <Text variant="code" className={dataFieldClass}>
              {transfer.senderAccount}
            </Text>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>Receiver</span>
            <Text variant="code" className={dataFieldClass}>
              {transfer.receiverAccount}
            </Text>
          </div>
          <div className={rowClass}>
            <span className={headerClass}>RequestKey</span>
            <Text variant="code" className={dataFieldClass}>
              {transfer.requestKey}
            </Text>
          </div>
        </section>
      ))}
    </>
  );
};
export default CompactTransactionsTableMobile;
