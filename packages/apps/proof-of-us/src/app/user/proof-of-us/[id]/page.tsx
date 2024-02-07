'use client';
import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { DetailView } from '@/components/DetailView/DetailView';

import { ShareView } from '@/components/ShareView/ShareView';

import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';
import { createProofOfUsID } from '@/utils/marmalade';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const router = useRouter();
  const { socket, disconnect } = useSocket();
  const { createToken, proofOfUs, background, updateStatus } = useProofOfUs();
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<IBuildStatusValues>(1);

  useEffect(() => {
    //init and check in what step you are
    if (!proofOfUs || isMounted) return;
    setStatus(proofOfUs.status);
    setIsMounted(true);
  }, [proofOfUs, background]);

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
    const newStatus = (status + 1) as IBuildStatusValues;
    setStatus(newStatus);
    updateStatus({ proofOfUsId: params.id, status: newStatus });
  };
  const prev = () => {
    const newStatus = (status - 1) as IBuildStatusValues;
    setStatus(newStatus);
    updateStatus({ proofOfUsId: params.id, status: newStatus });
  };

  if (!proofOfUs || !isMounted) return;

  return (
    <div>
      {status === 1 && <AvatarEditor next={next} />}
      {status === 2 && <DetailView next={next} prev={prev} />}
      {status >= 3 && <ShareView next={next} prev={prev} status={status} />}
    </div>
  );
};

export default Page;
