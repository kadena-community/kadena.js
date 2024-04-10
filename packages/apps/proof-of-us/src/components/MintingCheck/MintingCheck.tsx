import { useProofOfUs } from '@/hooks/proofOfUs';
import { getTransaction } from '@/utils/proofOfUs';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { ErrorStatus } from '../Status/ErrorStatus';
import { LoadingStatus } from '../Status/LoadingStatus';

interface IProps extends PropsWithChildren {
  token: IToken;
}

export const MintingCheck: FC<IProps> = ({ token }) => {
  const { proofOfUs } = useProofOfUs();
  const [error, setError] = useState<unknown>();
  const router = useRouter();

  const init = async () => {
    if (!token || !token.requestKey) return;
    try {
      if (!token.listener) {
        if (!token.requestKey) {
          setError('no transaction found');
          return;
        }
        const transaction = await getTransaction(token.requestKey);
        if (!transaction) {
          setError('no transaction found');
        }
        return;
      }

      const result = await token.listener;

      // if there is no token with a reqyestKey, then maybe the token has already been minted.
      // lets check the block by requestKey
      let transaction;
      if (!result) {
        transaction = await getTransaction(token.requestKey);
      } else {
        transaction = result[token.requestKey];
      }
      if (!transaction) {
        setError('no transaction found');
        return;
      }

      router.replace(
        `/user/proof-of-us/t/${transaction.result.data}?requestKey=${token.requestKey}`,
      );
    } catch (e) {
      console.log('fail on the page');
      setError(e);
    }
  };

  useEffect(() => {
    if (!proofOfUs) return;
    if (!proofOfUs.isReadyToSign) {
      router.replace(`/scan/${proofOfUs?.proofOfUsId}?shouldAdd=true`);
    }
  }, [proofOfUs]);

  useEffect(() => {
    init();
  }, [token]);

  const isAttendanceToken = token?.proofOfUsId?.startsWith('proof-of-us');

  if (error) {
    return (
      <Stack
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ErrorStatus closeUrl="/user">
          {JSON.stringify(error, null, 2)}
        </ErrorStatus>
      </Stack>
    );
  }

  return (
    <Stack flex={1} flexDirection="column">
      <LoadingStatus />
      {isAttendanceToken ? null : <ListSignees />}

      <Stack flex={1} />
      <Stack>
        <Link href="/user">
          <Button>Go to dashboard</Button>
        </Link>
      </Stack>
    </Stack>
  );
};
