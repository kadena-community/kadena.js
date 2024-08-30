import { Fungible, IAccount } from '@/modules/account/account.repository';
import { MonoSearch } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useMemo, useState } from 'react';
import { ListItem } from '../ListItem/ListItem';
import { AddToken } from './AddToken';

export function Assets({
  accounts,
  fungibles,
  showAddToken = false,
}: {
  accounts: IAccount[];
  fungibles: Fungible[];
  showAddToken?: boolean;
}) {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [filter, setFilter] = useState('');
  const assets = useMemo(() => {
    return Object.entries(
      accounts.reduce(
        (acc, { contract, overallBalance }) => {
          const { [contract]: ct, ...rest } = acc;
          if (!ct) return acc;
          return {
            [contract]: new PactNumber(overallBalance).plus(ct).toDecimal(),
            ...rest,
          };
        },
        fungibles
          .filter(({ title, symbol, contract }) => {
            const lowerCaseFilter = filter.toLocaleLowerCase();
            return (
              !filter ||
              title.toLocaleLowerCase().search(lowerCaseFilter) !== -1 ||
              symbol.toLocaleLowerCase().search(lowerCaseFilter) !== -1 ||
              contract.toLocaleLowerCase().search(lowerCaseFilter) !== -1
            );
          })
          .reduce(
            (acc, item) => ({
              [item.contract]: '0.0',
              ...acc,
            }),
            {} as Record<string, string>,
          ),
      ),
    );
  }, [accounts, fungibles, filter]);
  return (
    <Stack flexDirection={'column'}>
      <Dialog
        isOpen={showTokenModal}
        onOpenChange={setShowTokenModal}
        size="sm"
      >
        <DialogHeader>Add new token</DialogHeader>
        <DialogContent>
          <AddToken onAdd={() => setShowTokenModal(false)} />
        </DialogContent>
      </Dialog>
      <Stack flexDirection={'row'}>
        <TextField
          startVisual={<MonoSearch />}
          placeholder="Search token"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        {showAddToken && (
          <Button
            variant="outlined"
            isCompact
            onPress={() => setShowTokenModal(true)}
          >
            Add new token
          </Button>
        )}
      </Stack>
      {assets.map(([contract, balance]) => (
        <ListItem key={contract}>
          <Stack
            gap={'sm'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            flex={1}
          >
            <Text>
              {fungibles.find((item) => item.contract === contract)?.symbol ??
                contract}
            </Text>
            <Text color="emphasize" bold>
              {balance}
            </Text>
          </Stack>
        </ListItem>
      ))}
    </Stack>
  );
}
