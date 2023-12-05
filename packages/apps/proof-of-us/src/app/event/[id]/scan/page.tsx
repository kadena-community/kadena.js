'use client';
import { FileUploader } from '@/components/FileUploader/FileUploader';
import { useQR } from '@/hooks/qr';
import { createToken } from '@/services/marmalade';
import type { FC } from 'react';

const Page: FC = ({ params: { id } }) => {
  const { QR } = useQR(id);

  return (
    <div>
      <h1>Scan event NFT</h1>

      {QR && <img src={QR} />}
    </div>
  );
};

export default Page;
