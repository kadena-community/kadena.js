import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { useClaimEventToken } from '@/hooks/data/claimEventToken';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

interface IProps {
  token: IProofOfUsToken;
}

export const ScanEvent: FC<IProps> = ({ token }) => {
  const { isLoading, hasSuccess, hasError, isPending } = useClaimEventToken();
  const router = useRouter();

  const handleClaim = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_WALLET_URL}/claimurl?returnUrl=${process.env.NEXT_PUBLIC_URL}/user/t${token.tokenId}`,
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
