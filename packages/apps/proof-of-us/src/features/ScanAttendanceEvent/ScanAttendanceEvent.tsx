import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { isAfter, isBefore } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  token: IProofOfUsTokenMeta;
  eventId: string;
  isMinted: boolean;
}

export const ScanAttendanceEvent: FC<IProps> = ({
  token,
  eventId,
  isMinted,
}) => {
  const { isLoading, hasSuccess, hasError, isPending, claim } =
    useClaimAttendanceToken();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { doSubmit, result, preview, status, SubmitStatus, tx } = useSubmit();

  const { account } = useAccount();

  console.log(account);

  useEffect(() => {
    doSubmit();
  }, []);

  const handleClaim = async () => {
    const transaction = await claim(eventId);

    console.log({ transaction });

    router.push(
      `${process.env.NEXT_PUBLIC_WALLET_URL}/sign?transaction=${Buffer.from(
        JSON.stringify(transaction),
      ).toString('base64')}&returnUrl=${
        process.env.NEXT_PUBLIC_URL
      }/scan/e/${eventId}
      `,
    );
  };

  const startDate = new Date(token.startDate * 1000);
  const endDate = new Date(token.endDate * 1000);

  const hasStarted = isBefore(startDate, Date.now());
  const hasEnded = isAfter(endDate, Date.now());

  const showClaimButton =
    hasStarted &&
    !hasEnded &&
    !hasSuccess &&
    !hasError &&
    !isLoading &&
    !isMinted &&
    !isPending;

  return (
    <>
      <div>
        <h2>Attendance @</h2>

        <AttendanceTicket token={token} />
      </div>
      <div>
        {endDate.toLocaleDateString()} {endDate.toLocaleTimeString()}
        {!hasStarted && (
          <div>
            the event has not started yet. please check back{' '}
            {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()} to
            claim the nft
          </div>
        )}
        {hasEnded && <div>the event has ended.</div>}
        {showClaimButton && (
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
