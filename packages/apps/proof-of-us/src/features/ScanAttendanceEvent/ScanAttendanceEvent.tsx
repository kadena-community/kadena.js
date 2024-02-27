import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { Text } from '@/components/Typography/Text';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { useTokens } from '@/hooks/tokens';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { Stack } from '@kadena/react-ui';
import { isAfter, isBefore } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  data: IProofOfUsTokenMeta;
  eventId: string;
  isMinted: boolean;
}

export const ScanAttendanceEvent: FC<IProps> = ({
  data,
  eventId,
  isMinted,
}) => {
  const { isLoading, hasSuccess, hasError, isPending, claim } =
    useClaimAttendanceToken();
  const router = useRouter();

  const { account, isMounted, login } = useAccount();
  const { doSubmit, isStatusLoading } = useSubmit();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //TODO listen to minting addMintingData
  useTokens();

  // const checkHasClaimed = useCallback(
  //   async (eventId: string, accountName: string) => {
  //     const result = await hasClaimed(eventId, accountName);
  //     setHasMinted(result);
  //   },
  //   [setHasMinted],
  // );

  // useEffect(() => {
  //   if (!account) return;
  //   checkHasClaimed(eventId, account.accountName);
  // }, []);

  useEffect(() => {
    doSubmit();
  }, []);

  const handleClaim = async () => {
    const transaction = await claim(eventId);

    //const d = { ...data, requestKey: transaction?.hash };
    //addMintingData(d);

    router.push(
      `${process.env.NEXT_PUBLIC_WALLET_URL}/sign?transaction=${Buffer.from(
        JSON.stringify(transaction),
      ).toString('base64')}&returnUrl=${getReturnUrl()}
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
        <Stack>
          {!hasStarted && (
            <div>
              the event has not started yet. please check back{' '}
              {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}{' '}
              to claim the nft
            </div>
          )}
          {hasEnded && <div>the event has ended.</div>}

          {showClaimButton && <Button onPress={handleClaim}>Claim NFT</Button>}
          {isLoading && <MainLoader />}
          {hasError && (
            <div>
              what is the error?
              <Button onPress={handleClaim}>Retry NFT</Button>
            </div>
          )}

          {!account && isMounted && (
            <Stack width="100%">
              <Button onClick={login}>Login to mint</Button>
            </Stack>
          )}
          {isMinted && (
            <Stack width="100%" flexDirection="column">
              <Text>you are already claiming this token</Text>
              <Button>Go to dashboard</Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};
