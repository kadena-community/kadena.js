import { useAccount } from '@/hooks/account';
import { getToken } from '@/utils/marmalade';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  proofOfUs: IProofOfUs;
}

export const Event: FC<IProps> = ({ proofOfUs }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const { account } = useAccount();

  const init = async () => {
    const result = await getToken(proofOfUs.tokenId, account);
    setIsMinted(result);
  };

  useEffect(() => {
    init();
  }, []);

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
