'use client';
import { PROOFOFUS_QR_URL } from '@/constants';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import type { FC } from 'react';
import { useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const qrRef = useRef<QRCode | null>(null);

  const { data } = useProofOfUs();

  const handleQRPNGDownload = () => {
    if (!qrRef.current || !data) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = (qrRef.current as any).canvas.current as HTMLCanvasElement;
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode_${data.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (!data) return;

  return (
    <div>
      Proof Of Us with ID ({data.id})
      <section>
        <h2>qr code</h2>
        <QRCode
          ecLevel="H"
          ref={qrRef}
          value={`${env.URL}${PROOFOFUS_QR_URL}/${data.id}`}
          removeQrCodeBehindLogo={true}
          logoImage="/assets/qrlogo.png"
          logoPadding={5}
          quietZone={10}
          qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
          eyeRadius={10}
        />

        <button onClick={handleQRPNGDownload}>download PNG</button>
      </section>
    </div>
  );
};

export default Page;
