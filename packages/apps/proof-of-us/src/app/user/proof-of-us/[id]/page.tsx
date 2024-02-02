'use client';
import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { DetailView } from '@/components/DetailView/DetailView';

import { ShareView } from '@/components/ShareView/ShareView';

import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';
import { env } from '@/utils/env';
import { createProofOfUsID } from '@/utils/marmalade';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const router = useRouter();
  const { socket, disconnect } = useSocket();
  const { createToken, proofOfUs } = useProofOfUs();
  const { uploadBackground } = useAvatar();

  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (params.id === 'new') {
      const proofOfUsId = createProofOfUsID();
      router.replace(`/user/proof-of-us/${proofOfUsId}`);
      return;
    }

    disconnect({ proofOfUsId: params.id });
    createToken({ proofOfUsId: params.id });
  }, [socket, params.id]);

  const next = () => {
    setStatus((v) => v + 1);
  };
  const prev = () => {
    setStatus((v) => v - 1);
  };

  const handleUpload = async () => {
    if (!proofOfUs?.avatar.background) return;

    await uploadBackground(params.id.toString(), proofOfUs?.avatar.background);
  };

  if (!proofOfUs) return;

  return (
    <div>
      {status === 1 && <AvatarEditor next={next} />}
      {status === 2 && <DetailView next={next} prev={prev} />}
      {status === 3 && <ShareView next={next} prev={prev} />}
    </div>
  );
};

export default Page;
