import { useMintMultiToken } from '@/hooks/mintMultiToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  next: () => void;
  prev: () => void;
}

export const ProcessingView: FC<IProps> = ({ next, prev }) => {
  const { proofOfUs } = useProofOfUs();
  const { isLoading, hasError, data, mintToken } = useMintMultiToken();

  useEffect(() => {
    mintToken();
  }, []);

  const handleRetry = () => {
    mintToken();
  };

  return (
    <section>
      <div>status: {proofOfUs?.mintStatus}</div>

      {isLoading && <div>...isprocessing</div>}
      {hasError && (
        <div>
          there was an error.
          <button onClick={handleRetry}>retry</button>
        </div>
      )}
      {data && (
        <div>
          success {data}
          <Link href="/user">dashboard</Link>
          <Link href={`/user/proof-of-us/${proofOfUs?.tokenId}`}>
            go to proof
          </Link>
        </div>
      )}
    </section>
  );
};
