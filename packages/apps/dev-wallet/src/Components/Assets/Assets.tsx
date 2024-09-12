import { Fungible, IAccount } from '@/modules/account/account.repository';
import { noStyleLinkClass } from '@/pages/home/style.css';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
        fungibles.reduce(
          (acc, item) => ({
            [item.contract]: '0.0',
            ...acc,
          }),
          {} as Record<string, string>,
        ),
      ),
    );
  }, [accounts, fungibles]);
  return (
    <Stack flexDirection={'column'} gap={'md'}>
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
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Heading as="h4">Your assets</Heading>
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
      <Stack flexDirection={'column'}>
        {assets.map(([contract, balance]) => (
          <Link to={`/fungible/${contract}`} className={noStyleLinkClass}>
            <ListItem key={contract}>
              <Stack
                gap={'sm'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                flex={1}
              >
                <Text>
                  {fungibles.find((item) => item.contract === contract)
                    ?.symbol ?? contract}
                </Text>
                <Text color="emphasize" bold>
                  {balance}
                </Text>
              </Stack>
            </ListItem>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
