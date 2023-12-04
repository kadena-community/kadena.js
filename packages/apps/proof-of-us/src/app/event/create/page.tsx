'use client';
import { FileUploader } from '@/components/FileUploader/FileUploader';
import { createToken } from '@/services/marmalade';
import type { FC } from 'react';

const Page: FC = () => {
  const handleChange = (file) => {
    console.log(file);
  };

  const metadata = {
    name: 'test',
    description: 'test event nft',
    image:
      'https://c2a4iuck3xz4ezcdprp7wcmlhno7okvz5yhdo7mjuv5aed5kkpha.arweave.net/FoHEUErd88JkQ3xf-wmLO133KrnuDjd9iaV6Ag-qU84/NFT-series-1/19920112/19920112-art.png',
    properties: {
      eventDate: '1977-10-13',
    },
    collection: {
      name: 'test collection',
      family: 'proof of us',
    },
  };
  return (
    <div>
      <h1>Create event NFT</h1>

      <button onClick={() => createToken(metadata)}>sfs</button>
      <FileUploader onChange={handleChange} />
    </div>
  );
};

export default Page;
