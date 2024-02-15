import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useMintMultiToken } from '@/hooks/data/mintMultiToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { CopyButton, SystemIcon, TextField } from '@kadena/react-ui';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getReturnHostUrl } from '@/utils/getReturnUrl';
import type { FC } from 'react';
import { useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { backButtonClass } from '../DetailView/style.css';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { MainLoader } from '../MainLoader/MainLoader';
import { TitleHeader } from '../TitleHeader/TitleHeader';
import { qrClass } from './style.css';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const ShareView: FC<IProps> = ({ next, prev, status }) => {
  const qrRef = useRef<QRCode | null>(null);
  const { proofOfUs } = useProofOfUs();
  const { isLoading, hasError, data, mintToken } = useMintMultiToken();
  const router = useRouter();
  const { id } = useParams();

  const handleBack = () => {
    prev();
  };

  const handleSign = async () => {
    if (!proofOfUs) return;
    router.push(
      `${process.env.NEXT_PUBLIC_WALLET_URL}/sign?transaction=${
        proofOfUs.tx
      }&returnUrl=${getReturnHostUrl()}/scan/${id}
      `,
    );

    return;
    // next();
    // await mintToken();
  };

  const handleRetry = () => {
    mintToken();
  };

  if (!proofOfUs) return;

  return (
    <section>
      sdsdsdf
      {status === 3 && (
        <>
          <TitleHeader
            Prepend={() => (
              <>
                {!isAlreadySigning(proofOfUs.signees) && (
                  <button className={backButtonClass} onClick={handleBack}>
                    <SystemIcon.ArrowCollapseDown />
                  </button>
                )}
              </>
            )}
            label="Share"
          />

          <ListSignees />
          {!isAlreadySigning(proofOfUs.signees) ? (
            <>
              <div className={qrClass}>
                <QRCode
                  ecLevel="H"
                  size={800}
                  ref={qrRef}
                  value={`${getReturnHostUrl()}/scan/${proofOfUs.proofOfUsId}`}
                  removeQrCodeBehindLogo={true}
                  logoImage="/assets/qrlogo.png"
                  logoPadding={5}
                  quietZone={10}
                  eyeRadius={10}
                />
              </div>
              <TextField
                placeholder="Link"
                id="linkshare"
                aria-label="share"
                value={`${getReturnHostUrl()}/scan/${proofOfUs.proofOfUsId}`}
                endAddon={<CopyButton inputId="linkshare" />}
              />
            </>
          ) : (
            <ImagePositions />
          )}
          {isAlreadySigning(proofOfUs.signees) && (
            <Button onPress={handleSign}>Sign & Upload</Button>
          )}
        </>
      )}
      {status === 4 && (
        <>
          <TitleHeader
            Prepend={() => (
              <>
                <button className={backButtonClass} onClick={handleBack}>
                  <SystemIcon.ArrowCollapseDown />
                </button>
              </>
            )}
            label="Sign & Upload Proof"
          />

          <div>status: {proofOfUs.mintStatus}</div>
          <ListSignees />
          {isLoading && <MainLoader />}
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
