import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { useEventToken } from '@/hooks/eventToken';
import type { FC } from 'react';
import { useState } from 'react';

interface IProps {
  proofOfUs: IProofOfUsData;
}

export const ScanEvent: FC<IProps> = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { token } = useEventToken();

  const handleMint = () => {
    setIsLoading(true);
    setHasError(false);
    setIsSuccess(false);

    //TODO: this should be an actual minting process
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.5) {
        setIsSuccess(true);
      } else {
        setHasError(true);
      }
      setIsLoading(false);
    }, 5000);
  };

  return (
    <>
      <div>
        <h2>Attendance @</h2>

        <AttendanceTicket title="Dev World 24" timestamp={1709164800000} />

        <pre>{JSON.stringify(token, null, 2)}</pre>
      </div>
      <div>
        {!isSuccess && !hasError && !isLoading && (
          <button disabled={isLoading} onClick={handleMint}>
            Claim NFT
          </button>
        )}

        {isLoading && <div>is loading...</div>}
        {hasError && (
          <div>
            what is the error?
            <button onClick={handleMint}>Retry NFT</button>
          </div>
        )}

        {isSuccess && <div>claimed the nft</div>}
      </div>
    </>
  );
};
