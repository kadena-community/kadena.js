import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { DetailView } from '@/components/DetailView/DetailView';
import { MintView } from '@/components/MintView/MintView';
import { ShareView } from '@/components/ShareView/ShareView';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { createProofOfUsID } from '@/utils/createProofOfUsID';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

export const CreateProofOfUs: FC<IProps> = ({ params }) => {
  const router = useRouter();
  const { createToken, proofOfUs, background, updateStatus } = useProofOfUs();
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<IBuildStatusValues>(0);

  useEffect(() => {
    //init and check in what step you are
    if (!proofOfUs || isMounted) return;
    setStatus(proofOfUs.status);
    setIsMounted(true);
  }, [proofOfUs, background]);

  useEffect(() => {
    setStatus(proofOfUs?.status ?? 1);
  }, [proofOfUs?.proofOfUsId]);

  useEffect(() => {
    if (params?.id === 'new') {
      const proofOfUsId = createProofOfUsID();
      setStatus(1);
      router.replace(`/user/proof-of-us/${proofOfUsId}`);
      return;
    }

    createToken({ proofOfUsId: params.id });
  }, [params.id]);

  const next = async () => {
    const newStatus = (status + 1) as IBuildStatusValues;
    setStatus(newStatus);
    await updateStatus({ proofOfUsId: params.id, status: newStatus });
  };
  const prev = async () => {
    const newStatus = (status - 1) as IBuildStatusValues;
    setStatus(newStatus);
    await updateStatus({ proofOfUsId: params.id, status: newStatus });
  };

  return (
    <div>
      {status === 1 && <AvatarEditor next={next} status={status} />}
      {status === 2 && <DetailView next={next} prev={prev} />}
      {status === 3 && <ShareView next={next} prev={prev} status={status} />}
      {status >= 4 && <MintView next={next} prev={prev} status={status} />}
    </div>
  );
};
