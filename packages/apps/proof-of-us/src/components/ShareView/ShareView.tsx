import { ListSignees } from '@/components/ListSignees/ListSignees';
import { PROOFOFUS_QR_URL } from '@/constants';
import { useMintMultiToken } from '@/hooks/data/mintMultiToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import Link from 'next/link';
import type { FC } from 'react';
import { useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const ShareView: FC<IProps> = ({ next, prev, status }) => {
  const qrRef = useRef<QRCode | null>(null);
  const { proofOfUs, background } = useProofOfUs();
  const { isLoading, hasError, data, mintToken } = useMintMultiToken();

  const handleBack = () => {
    prev();
  };

  const handleSign = async () => {
    next();
    await mintToken();
  };

  const handleRetry = () => {
    mintToken();
  };

  if (!proofOfUs) return;

  const isReady = proofOfUs.signees[1]?.signerStatus === 'success';
  return (
    <section>
      {status === 3 && (
        <>
          <h3>Share</h3>
          {!isReady && <button onClick={handleBack}>back</button>}
          <ListSignees />
          {!isReady ? (
            <>
              <QRCode
                ecLevel="H"
                size={500}
                ref={qrRef}
                value={`${env.URL}${PROOFOFUS_QR_URL}/${proofOfUs.proofOfUsId}`}
                removeQrCodeBehindLogo={true}
                logoImage="/assets/qrlogo.png"
                logoPadding={5}
                quietZone={10}
                eyeRadius={10}
              />
              link: {`${env.URL}${PROOFOFUS_QR_URL}/${proofOfUs.proofOfUsId}`}
            </>
          ) : (
            <img src={background} />
          )}
          {isReady && <button onClick={handleSign}>Sign & Upload</button>}
        </>
      )}

      {status === 4 && (
        <>
          <div>status: {proofOfUs.mintStatus}</div>
          <ListSignees />
          {isLoading && <div>...isprocessing</div>}
          {hasError && (
            <div>
              there was an error.
              <button onClick={handleRetry}>retry</button>
            </div>
          )}
          {proofOfUs.mintStatus === 'success' && (
            <div>
              success {data}
              <Link href="/user">dashboard</Link>
              <Link href={`/user/proof-of-us/${proofOfUs?.tokenId}`}>
                go to proof
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};
