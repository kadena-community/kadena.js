import { IAccount } from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { hashStyle } from '@/pages/activities/style.css';
import { noStyleLinkClass } from '@/pages/home/style.css';
import { MonoContentCopy } from '@kadena/kode-icons/system';
import { Button, Stack, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { ListItem } from '../ListItem/ListItem';

export function AccountItem({
  account: { uuid, alias, address, overallBalance, contract, guard },
}: {
  account: IAccount;
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
          <Stack
            gap={'sm'}
            style={{
              maxWidth: '100%',
              width: '100%',
            }}
            alignItems={'center'}
          >
            {alias ? (
              <Stack flexDirection={'row'} gap={'sm'} className={hashStyle}>
                <Text>{alias}</Text>
                <Text className={hashStyle}>({address})</Text>
              </Stack>
            ) : (
              <Text className={hashStyle}>{address}</Text>
            )}

            <Stack alignItems={'center'} gap={'sm'}>
              <Text bold color="emphasize">
                {overallBalance} {getSymbol(contract)}
              </Text>
              <Button
                isCompact
                variant="transparent"
                onClick={(e) => {
                  e.preventDefault();
                  if (address.startsWith('w:') && isKeysetGuard(guard)) {
                    navigator.clipboard.writeText(
                      `${address}:${guard.keys.join(':')}`,
                    );
                  } else {
                    navigator.clipboard.writeText(address);
                  }
                }}
              >
                <MonoContentCopy />
              </Button>
            </Stack>
          </Stack>
        </ListItem>
      </Stack>
    </Link>
  );
}
