import {
  IAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { noStyleLinkClass } from '@/pages/home/style.css';
import { hashStyle } from '@/pages/transactions/style.css';
import { shorten } from '@/utils/helpers';
import { MonoContentCopy } from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { ListItem } from '../ListItem/ListItem';

export function AccountItem({
  account: { uuid, alias = 'test', address, overallBalance, contract },
}: {
  account: IAccount | IWatchedAccount;
}) {
  const { fungibles } = useWallet();
  const getSymbol = (contract: string) =>
    fungibles.find((f) => f.contract === contract)?.symbol;
  return (
    <Link to={`/account/${uuid}`} className={noStyleLinkClass}>
      <Stack
        gap={'sm'}
        flex={undefined}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <ListItem>
          {alias ? (
            <Stack flexDirection={'row'} gap={'sm'} className={hashStyle}>
              <Text>{alias}</Text>
              <Text className={hashStyle}>({shorten(address, 10)})</Text>
            </Stack>
          ) : (
            <Text className={hashStyle}>{shorten(address, 10)}</Text>
          )}

          <Stack alignItems={'center'} gap={'sm'}>
            <Text>
              {overallBalance} {getSymbol(contract)}
            </Text>
            <Button
              isCompact
              variant="transparent"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(address);
              }}
            >
              <MonoContentCopy />
            </Button>
          </Stack>
        </ListItem>
      </Stack>
    </Link>
  );
}
