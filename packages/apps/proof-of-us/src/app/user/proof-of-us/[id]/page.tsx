'use client';
import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { PROOFOFUS_QR_URL } from '@/constants';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';
import { env } from '@/utils/env';
import { createTokenId } from '@/utils/marmalade';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const qrRef = useRef<QRCode | null>(null);
  const router = useRouter();
  const { socket, disconnect } = useSocket();
  const { createToken, proofOfUs } = useProofOfUs();
  const [isNew, setIsNew] = useState(false);

  const createNew = async () => {
    const tokenId = await createTokenId();
    router.replace(`/user/proof-of-us/${tokenId}`);
  };

  useEffect(() => {
    if (params.id === 'new') {
      setIsNew(true);
      createNew();
    }

    disconnect({ tokenId: params.id });
    createToken({ tokenId: params.id });
  }, [socket, params.id]);

  if (!proofOfUs) return;

  return (
    <div>
      Proof Of Us with ID ({proofOfUs.tokenId})
      <section>
        <h4>image</h4>
        <img src={proofOfUs.uri} />

        <ListSignees />

        {!isNew ? <AvatarEditor /> : null}
      </section>
      <section>
        <h2>qr code</h2>
        <QRCode
          ecLevel="H"
          ref={qrRef}
          value={`${env.URL}${PROOFOFUS_QR_URL}/${proofOfUs.tokenId}`}
          removeQrCodeBehindLogo={true}
          logoImage="/assets/qrlogo.png"
          logoPadding={5}
          quietZone={10}
          qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
          eyeRadius={10}
        />
      </section>
    </div>
  );
};

export default Page;
