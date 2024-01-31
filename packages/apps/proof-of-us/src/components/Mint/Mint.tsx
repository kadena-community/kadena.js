import { PROOFOFUS_QR_EVENT_URL } from '@/constants';
import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import type { FC } from 'react';
import { useState } from 'react';

interface IProps {
  proofOfUs: IProofOfUs;
}

export const Mint: FC<IProps> = ({ proofOfUs }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const handleMint = () => {
    setIsMinting(true);

    //TODO: this should be an actual minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
    }, 5000);
  };
  return (
    <>
      scanned Proof Of Us with ID ({proofOfUs.tokenId})
      <div>
        {!isMinted ? (
          <button disabled={isMinting} onClick={handleMint}>
            Mint!
          </button>
        ) : (
          <div>Congrats!!!</div>
        )}
      </div>
    </>
  );
};
