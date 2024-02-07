'use client';

//import { Multi } from '@/features/Multi/Multi';
//import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = () => {
  const { peer } = useSocket();
  // const { proofOfUs, background } = useProofOfUs();

  // if (!proofOfUs) return null;

  const handleClick = () => {
    console.log(peer().conn);
    peer().conn?.send('fack!');
  };
  return (
    <div>
      <button onClick={handleClick}>EVCHT</button>
      {/* <Multi proofOfUs={proofOfUs} background={background} /> */}
    </div>
  );
};

export default Page;
