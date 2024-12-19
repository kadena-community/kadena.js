import { env } from '@/utils/env';
import { Tile } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { ITransaction } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  transaction: ITransaction;
}

export const ActiveTransaction: FC<IProps> = ({ transaction }) => {
  return (
    <li>
      <Tile>
        <a
          href={`https://explorer.kadena.io/${env.NETWORKID}/transaction/${transaction.requestKey}`}
          target="_blank"
          rel="noreferrer"
        >
          {transaction.requestKey}
        </a>
      </Tile>
    </li>
  );
};
