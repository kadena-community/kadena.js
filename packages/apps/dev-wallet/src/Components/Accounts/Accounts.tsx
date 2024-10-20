import { IAccount } from '@/modules/account/account.repository';
import { panelClass } from '@/pages/home/style.css';
import { linkClass } from '@/pages/select-profile/select-profile.css';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { AccountItem } from '../AccountItem/AccountItem';
import { listClass } from './style.css';

export function Accounts({
  accounts,
  contract,
}: {
  accounts: IAccount[];
  contract?: string;
}) {
  return (
    <Stack flexDirection={'column'}>
      <Stack justifyContent={'space-between'}>
        <Heading as="h5">Accounts</Heading>
        <Link
          to={
            contract
              ? `/create-account${contract ? `?contract=${contract}` : ''}`
              : '/create-account'
          }
          className={linkClass}
        >
          Create Account
        </Link>
      </Stack>
      {accounts.length ? (
        <ul className={listClass}>
          {accounts.map((account) => (
            <li key={account.uuid}>
              <AccountItem account={account} />
            </li>
          ))}
        </ul>
      ) : (
        <Stack
          padding={'sm'}
          marginBlockStart="md"
          className={classNames(panelClass)}
        >
          <Text>No accounts created yet!</Text>
        </Stack>
      )}
    </Stack>
  );
}
