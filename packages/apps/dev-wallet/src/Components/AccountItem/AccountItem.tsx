import { IAccount } from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfile } from '@/modules/wallet/wallet.repository';
import { noStyleLinkClass } from '@/pages/home/style.css';
import { showIcon } from '@/utils/showIcon';
import { MonoCopyAll } from '@kadena/kode-icons/system';
import { Button, maskValue, Stack, Text, Tile } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { subTitleClass } from './style.css';

export function AccountItem({
  account: { uuid, alias, address, overallBalance, contract, guard },
  profile,
}: {
  account: IAccount;
  profile: IProfile | undefined;
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
        <Tile>
          <Stack
            gap={'sm'}
            style={{
              maxWidth: '100%',
              width: '100%',
            }}
            alignItems="flex-start"
          >
            <Stack>{showIcon(profile?.options.authMode)}</Stack>
            <Stack flexDirection="column" flex={1}>
              {alias ? (
                <>
                  <Text variant="ui">{alias}</Text>
                  <Text variant='code' size="small" className={subTitleClass}>
                    {maskValue(address)}
                  </Text>
                </>
              ) : (
                <>
                  <Text variant="code">{maskValue(address)}</Text>
                  <Text size="small" className={subTitleClass}>
                    {' '}
                  </Text>
                </>
              )}
            </Stack>

            <Stack alignItems={'flex-start'} gap={'xs'}>
              <Text variant='code' bold color="emphasize">
                {overallBalance}
              </Text>
              <Text bold className={subTitleClass}>
                {getSymbol(contract)}
              </Text>
            </Stack>
            <Button
              style={{ position: 'relative', top: '-5px' }}
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
              <MonoCopyAll />
            </Button>
          </Stack>
        </Tile>
      </Stack>
    </Link>
  );
}
