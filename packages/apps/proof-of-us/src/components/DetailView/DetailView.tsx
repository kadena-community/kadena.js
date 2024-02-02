import { useProofOfUs } from '@/hooks/proofOfUs';
import { useRouter } from 'next/navigation';

import { useState  } from 'react';
import type {FC} from 'react';

interface IProps {
  next: () => void;
  prev: () => void;
}
export const DetailView: FC<IProps> = ({ next, prev }) => {
  const { proofOfUs, closeToken } = useProofOfUs();
  const [isMounted, setIsMounted] = useState(true);
  const router = useRouter();
  const handleShare = () => {
    next();
  };

  if (!proofOfUs) return null;

  const handleRedo = () => {
    prev();
  };
  const handleClose = () => {
    closeToken({ proofOfUsId: proofOfUs.proofOfUsId });
    setIsMounted(false);
    router.replace('/user');
  };

  if (!isMounted) return null;

  return (
    <section>
      <h3>Details</h3>
      <button onClick={handleRedo}>redo</button>
      <button onClick={handleClose}>delete</button>
      <img src={proofOfUs.avatar.background} />
      <button onClick={handleShare}>Share</button>
    </section>
  );
};
