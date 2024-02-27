import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { useTokens } from '@/hooks/tokens';
import { getReturnUrl } from '@/utils/getReturnUrl';
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
  const { doSubmit, status, isStatusLoading } = useSubmit();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //TODO listen to minting addMintingData
  useTokens();

  useEffect(() => {
    doSubmit();
  }, []);

  const handleClaim = async () => {
    const transaction = await claim(eventId);
    console.log({ transaction });

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
    !isPending;

  console.log({ isStatusLoading, status });
  return (
    <>
      {isStatusLoading && <MainLoader />}
      <div>
        <div>claimstatus: {status}</div>
        <AttendanceTicket data={data} />
      </div>
      <div>
        {!hasStarted && (
          <div>
            the event has not started yet. please check back{' '}
            {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()} to
            claim the nft
          </div>
        )}
        {hasEnded && <div>the event has ended.</div>}
        {showClaimButton && !isMinted && (
          <Button isDisabled={isMinted} onPress={handleClaim}>
            Claim NFT
          </Button>
        )}
        {isLoading && <MainLoader />}
        {isPending && <div>you are already claiming this token</div>}
        {hasError && (
          <div>
            what is the error?
            <Button onPress={handleClaim}>Retry NFT</Button>
          </div>
        )}
        {isMinted && <div>claimed the nft</div>}
      </div>
    </>
  );
};
