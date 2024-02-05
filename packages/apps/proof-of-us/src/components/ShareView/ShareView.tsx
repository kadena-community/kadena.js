import { ListSignees } from '@/components/ListSignees/ListSignees';
import { PROOFOFUS_QR_URL } from '@/constants';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import type { FC } from 'react';
import { useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface IProps {
  next: () => void;
  prev: () => void;
}

export const ShareView: FC<IProps> = ({ next, prev }) => {
  const qrRef = useRef<QRCode | null>(null);
  const { proofOfUs, background } = useProofOfUs();

  const handleBack = () => {
    prev();
  };

  const handleSign = () => {
    next();

    //@OTODO extend addsignee so we know when he actually has signed
    //atm this is not checked
  };

  if (!proofOfUs) return;

  const isReady = proofOfUs.signees.length > 1;
  return (
    <section>
      <h3>Share</h3>
      <button onClick={handleBack}>back</button>

      <ListSignees />

      {!isReady ? (
        <>
          <QRCode
            ecLevel="H"
            ref={qrRef}
            value={`${env.URL}${PROOFOFUS_QR_URL}/${proofOfUs.proofOfUsId}`}
            removeQrCodeBehindLogo={true}
            logoImage="/assets/qrlogo.png"
            logoPadding={5}
            quietZone={10}
            qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
            eyeRadius={10}
          />
          link: {`${env.URL}${PROOFOFUS_QR_URL}/${proofOfUs.proofOfUsId}`}
        </>
      ) : (
        <img src={background} />
      )}

      {isReady && <button onClick={handleSign}>Sign & Upload</button>}
    </section>
  );
};
