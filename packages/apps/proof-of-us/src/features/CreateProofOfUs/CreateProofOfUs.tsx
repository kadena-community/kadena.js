import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { DetailView } from '@/components/DetailView/DetailView';
import { ShareView } from '@/components/ShareView/ShareView';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { createProofOfUsID } from '@/utils/createProofOfUsID';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

export const CreateProofOfUs: FC<IProps> = ({ params }) => {
  const router = useRouter();
  const { createToken, proofOfUs, background, updateStatus } = useProofOfUs();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //init and check in what step you are
    if (!proofOfUs || isMounted) return;
    setIsMounted(true);
  }, [proofOfUs, background]);

  useEffect(() => {
    if (params?.id === 'new') {
      const proofOfUsId = createProofOfUsID();
      router.replace(`/user/proof-of-us/${proofOfUsId}`);
      return;
    }

    createToken({ proofOfUsId: params.id });
  }, [params.id]);

  const next = useCallback(async () => {
    if (!proofOfUs) return;
    const newStatus = (proofOfUs.status + 1) as IBuildStatusValues;
    await updateStatus({ proofOfUsId: params.id, status: newStatus });
  }, [proofOfUs]);

  const prev = useCallback(async () => {
    if (!proofOfUs) return;
    const newStatus = (proofOfUs.status - 1) as IBuildStatusValues;
    await updateStatus({ proofOfUsId: params.id, status: newStatus });
  }, [proofOfUs]);

  if (!isMounted) return null;

  const status = proofOfUs?.status ?? 1;

  return (
    <div>
      {status === 1 && <AvatarEditor next={next} status={status} />}
      {status === 2 && <DetailView next={next} prev={prev} />}
      {status === 3 && <ShareView next={next} prev={prev} status={status} />}
    </div>
  );
};
