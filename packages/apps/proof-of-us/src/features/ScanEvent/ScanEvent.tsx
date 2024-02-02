import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { DEVWORLD_TOKENID } from '@/constants';
import { useAccount } from '@/hooks/account';
import { useEventToken } from '@/hooks/eventToken';
import { getToken } from '@/utils/marmalade';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  proofOfUs: IProofOfUs;
}

export const ScanEvent: FC<IProps> = ({ proofOfUs }) => {
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
      console.log(random);
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
