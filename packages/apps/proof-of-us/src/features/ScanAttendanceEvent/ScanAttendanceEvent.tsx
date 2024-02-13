import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { useAccount } from '@/hooks/account';
import { useClaimAttendanceToken } from '@/hooks/data/claimAttendanceToken';
import { useSubmit } from '@/hooks/submit';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  token: IProofOfUsToken;
  eventId: string;
}

export const ScanAttendanceEvent: FC<IProps> = ({ token, eventId }) => {
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

  return (
    <>
      <div>
        <h2>Attendance @</h2>

        <AttendanceTicket token={token} />
      </div>
      <div>
        {!hasSuccess && !hasError && !isLoading && !isPending && (
          <Button onPress={handleClaim}>Claim NFT</Button>
        )}

        {isLoading && <div>is loading...</div>}
        {isPending && <div>you are already claiming this token</div>}
        {hasError && (
          <div>
            what is the error?
            <Button onPress={handleClaim}>Retry NFT</Button>
          </div>
        )}

        {hasSuccess && <div>claimed the nft</div>}
      </div>
    </>
  );
};
