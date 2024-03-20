import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { MessageBlock } from '@/components/MessageBlock/MessageBlock';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { SubmitStatus, useSubmit } from '@/hooks/submit';
import { env } from '@/utils/env';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { getSigneeAccount } from '@/utils/getSigneeAccount';
import { store } from '@/utils/socket/store';
import { Stack } from '@kadena/react-ui';
import { isAfter, isBefore } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect } from 'react';

interface IProps {
  data: IProofOfUsTokenMeta;
  eventId: string;
  isMinted: boolean;
  handleIsMinted: Dispatch<SetStateAction<boolean>>;
}

export const ScanAttendanceEvent: FC<IProps> = ({
  data,
  eventId,
  isMinted,
  handleIsMinted,
}) => {
  const { isLoading, hasSuccess, hasError, isPending, claim } =
    useClaimAttendanceToken();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { account, isMounted, login } = useAccount();
  const { doSubmit, isStatusLoading, status } = useSubmit();

  const getProof = (
    data: IProofOfUsTokenMeta,
    account: IAccount,
    transaction: string,
  ): IProofOfUsData => {
    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());

    const proof: IProofOfUsData = {
      proofOfUsId: data.properties.eventId,
      type: 'attendance',
      requestKey: tx.hash,
      title: data.name,
      signees: [{ ...getSigneeAccount(account), initiator: true }],
      mintStatus: 'init',
      imageUri: data.image,
      date: Date.now(),
      eventId: data.properties.eventId,
      eventName: data.properties.eventName,
      backgroundColor: data.properties.avatar?.backgroundColor,
      tx: transaction,
      status: 4,
      manifestUri: data.manifestUri,
    };

    return proof;
  };

  useEffect(() => {
    if (status === SubmitStatus.SUCCESS) {
      handleIsMinted(true);
    }
  }, [status]);

  useEffect(() => {
    const transaction = searchParams.get('transaction') ?? '';
    if (!transaction || !account) return;

    const proof = getProof(data, account, transaction);
    console.log({ proof });
    console.log('update in scanattendance');
    store.updateProofOfUs(proof, proof);

    console.log('submit');
    doSubmit(undefined, true);
  }, [account, searchParams]);

  const handleClaim = async () => {
    const transaction = await claim(eventId);
    if (!transaction || !account) return;

    const bufferedTx = Buffer.from(JSON.stringify(transaction)).toString(
      'base64',
    );

    const proof = getProof(data, account, bufferedTx);
    console.log('update in scanattendance claim');
    store.updateProofOfUs(proof, proof);
    console.log({ proof });

    router.push(
      `${
        process.env.NEXT_PUBLIC_WALLET_URL
      }/sign?transaction=${bufferedTx}&chainId=${
        env.CHAINID
      }&returnUrl=${getReturnUrl()}
      `,
    );
  };

  const startDate = new Date(data.startDate * 1000);
  const endDate = new Date(data.endDate * 1000);

  const hasStarted = isBefore(startDate, Date.now());
  const hasEnded = isAfter(Date.now(), endDate);

  const showClaimButton =
    hasStarted &&
    !hasEnded &&
    !hasSuccess &&
    !hasError &&
    !isLoading &&
    !isMinted &&
    !isPending &&
    account;

  return (
    <>
      {isStatusLoading && <MainLoader />}
      <Stack flexDirection="column" flex={1}>
        <AttendanceTicket data={data} />

        <Stack flex={1} />
        <Stack flexDirection="column">
          {!hasStarted && (
            <div>
              <Stack flexDirection="column" flex={1} gap="md">
                <MessageBlock title={''}>
                  {' '}
                  the event has not started yet. please check back{' '}
                  {startDate.toLocaleDateString()}{' '}
                  {startDate.toLocaleTimeString()} to claim the nft
                </MessageBlock>
                <Stack gap="md">
                  {!isMinted && account && (
                    <Stack flex={1}>
                      <Link href="/user">
                        <Button>Go to dashboard</Button>
                      </Link>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </div>
          )}
          {hasEnded && (
            <Stack flexDirection="column" flex={1} gap="md">
              <MessageBlock title={''}>The event has ended.</MessageBlock>
              <Stack gap="md">
                {!isMinted && account && (
                  <Stack flex={1}>
                    <Link href="/user">
                      <Button>Go to dashboard</Button>
                    </Link>
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}

          {showClaimButton && !isMinted && (
            <Stack flex={1} gap="md">
              {account && (
                <Link href="/user">
                  <Button>Go to dashboard</Button>
                </Link>
              )}
              <Button onPress={handleClaim}>Claim NFT</Button>
            </Stack>
          )}
          {isLoading && <MainLoader />}
          {hasError && (
            <Stack width="100%" flexDirection="column" gap="md">
              <MessageBlock title="Error" variant="error">
                There was an issue with minting
              </MessageBlock>
              <Stack flex={1} gap="md">
                {account && (
                  <Link href="/user">
                    <Button>Go to dashboard</Button>
                  </Link>
                )}
              </Stack>
            </Stack>
          )}

          {!account && isMounted && (
            <Stack width="100%">
              <Button onClick={login}>Login to mint</Button>
            </Stack>
          )}
          {isMinted && (
            <Stack width="100%" flexDirection="column" gap="md">
              <MessageBlock title="Success" variant="success">
                The token is minted
              </MessageBlock>
              <Link href="/user">
                <Button>Go to dashboard</Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};
