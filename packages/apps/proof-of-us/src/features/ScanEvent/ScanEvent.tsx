import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
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

        <AttendanceTicket
          title={token.name}
          timestamp={token.properties.date}
        />
      </div>
      <div>
        {!hasSuccess && !hasError && !isLoading && (
          <button disabled={isLoading} onClick={handleClaim}>
            Claim NFT
          </button>
        )}

        {isLoading && <div>is loading...</div>}
        {hasError && (
          <div>
            what is the error?
            <button onClick={handleClaim}>Retry NFT</button>
          </div>
        )}

        {hasSuccess && <div>claimed the nft</div>}
      </div>
    </>
  );
};
