import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { accountRepository } from '@/modules/account/account.repository';
import { contactRepository } from '@/modules/contact/contact.repository';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import { UUID } from '@/modules/types';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  MonoContacts,
  MonoRemoveRedEye,
  MonoSettings,
  MonoTableRows,
  MonoWallet,
} from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { downloadAsFile } from '../utils/download-file';

const toCSV = (table: string, header: string[], data: string[][]) => {
  return [
    [table, ...header].join('\t'),
    ...data.map((row, index) => [index + 1, ...row].join('\t')),
  ].join('\n');
};

export function ExportData() {
  const { profile, activeNetwork, networks } = useWallet();

  const profileId = profile?.uuid as UUID;
  const networkId = activeNetwork?.uuid as UUID;

  if (!profileId || !networkId) {
    return (
      <Notification intent="negative" role="alert">
        Profile or network not found
      </Notification>
    );
  }

  async function exportTransactions() {
    const transactions =
      await transactionRepository.getTransactionList(profileId);
    const header = ['networkId', 'hash', 'cmd', 'sigs', 'status', 'result'];
    const data = transactions
      .reverse()
      .map((tx) => [
        networks.find((n) => n.uuid === tx.networkUUID)?.networkId ?? '',
        tx.hash,
        tx.cmd,
        JSON.stringify(tx.sigs),
        tx.status,
        tx.result ? JSON.stringify(tx.result) : '',
      ]);
    downloadAsFile(
      toCSV('transaction', header, data),
      'transactions.csv',
      'text/csv',
    );
  }

  async function exportAccounts() {
    const accounts = await accountRepository.getAccountsByProfileId(profileId);
    const header = [
      'networkId',
      'contract',
      'alias',
      'address',
      'guard',
      'chains',
      'total-balance',
    ];
    const data = accounts
      .reverse()
      .map((account) => [
        networks.find((n) => n.uuid === account.networkUUID)?.networkId ?? '',
        account.contract,
        account.alias ?? '',
        account.address,
        JSON.stringify(account.guard),
        JSON.stringify(account.chains),
        account.overallBalance,
      ]);
    downloadAsFile(toCSV('account', header, data), 'accounts.csv', 'text/csv');
  }

  async function exportWatchedAccounts() {
    const accounts =
      await accountRepository.getWatchedAccountsByProfileId(profileId);
    const header = [
      'networkId',
      'contract',
      'alias',
      'address',
      'guard',
      'chains',
      'total-balance',
    ];
    const data = accounts
      .reverse()
      .map((account) => [
        networks.find((n) => n.uuid === account.networkUUID)?.networkId ?? '',
        account.contract,
        account.alias ?? '',
        account.address,
        JSON.stringify(account.guard),
        JSON.stringify(account.chains),
        account.overallBalance,
      ]);
    downloadAsFile(
      toCSV('watched-account', header, data),
      'watched-accounts.csv',
      'text/csv',
    );
  }

  async function exportContacts() {
    const contacts = await contactRepository.getContactsList();
    const header = ['name', 'email', 'address', 'guard'];
    const data = contacts
      .reverse()
      .map((contact) => [
        contact.name,
        contact.email ?? '',
        contact.account.address,
        JSON.stringify(contact.account.guard),
      ]);
    downloadAsFile(toCSV('contact', header, data), 'contacts.csv', 'text/csv');
  }
  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      <SideBarBreadcrumbs icon={<MonoSettings />} isGlobal>
        <SideBarBreadcrumbsItem href="/settings">
          Settings
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/settings/export-data">
          Export Data
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <Heading variant="h3">Export Data</Heading>
      <Text>You can export the data from the following sections as csv:</Text>
      <Button
        isCompact
        variant="outlined"
        startVisual={<MonoTableRows />}
        onClick={exportTransactions}
      >
        Export Transactions
      </Button>
      <Button
        isCompact
        variant="outlined"
        startVisual={<MonoWallet />}
        onClick={exportAccounts}
      >
        Export Accounts
      </Button>
      <Button
        isCompact
        variant="outlined"
        startVisual={<MonoRemoveRedEye />}
        onClick={exportWatchedAccounts}
      >
        Export Watched Accounts
      </Button>
      <Button
        isCompact
        variant="outlined"
        startVisual={<MonoContacts />}
        onClick={exportContacts}
      >
        Export Contacts
      </Button>
    </Stack>
  );
}
