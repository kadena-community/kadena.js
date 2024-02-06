import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { Button } from '@/components/Button/Button';
import { useClaimEventToken } from '@/hooks/data/claimEventToken';
import type { FC } from 'react';

interface IProps {
  token: IProofOfUsToken;
}

export const ScanEvent: FC<IProps> = ({ token }) => {
  const { isLoading, hasSuccess, hasError, claim } = useClaimEventToken();

  const handleClaim = () => {
    claim();
  };

  return (
    <>
      <div>
        <h2>Attendance @</h2>

        <AttendanceTicket token={token} />
      </div>
      <div>
        {!hasSuccess && !hasError && !isLoading && (
          <Button onPress={handleClaim}>Claim NFT</Button>
        )}

        {isLoading && <div>is loading...</div>}
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
