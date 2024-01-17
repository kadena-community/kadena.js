'use client';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { POU_QR_URL } from '@/constants';
import { useGetPou } from '@/hooks/getPou';
import { env } from '@/utils/env';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { data, isLoading, error } = useGetPou({ id: params.id });

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

  if (isLoading) return <IsLoading />;
  if (error) return <div>{error.message}</div>;
  if (!data) {
    router.replace('/404');
    return null;
  }

  return (
    <div>
      pou with ID ({params.id})
      <section>
        <h2>qr code</h2>
        <QRCode
          ecLevel="H"
          ref={qrRef}
          value={`${env.URL}${POU_QR_URL}/${params.id}`}
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
