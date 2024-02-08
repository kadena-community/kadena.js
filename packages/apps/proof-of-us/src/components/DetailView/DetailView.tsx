import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useRouter } from 'next/navigation';

import type { ChangeEventHandler, FC } from 'react';
import { useState } from 'react';

interface IProps {
  next: () => void;
  prev: () => void;
}
export const DetailView: FC<IProps> = ({ next, prev }) => {
  const { proofOfUs, background, closeToken, changeTitle } = useProofOfUs();
  const { removeBackground } = useAvatar();
  const [isMounted, setIsMounted] = useState(true);
  const router = useRouter();

  const handleShare = () => {
    next();
  };

  if (!proofOfUs) return null;

  const handleRedo = async () => {
    if (!proofOfUs) return;
    await removeBackground(proofOfUs);
    prev();
  };
  const handleClose = async () => {
    await closeToken({ proofOfUsId: proofOfUs.proofOfUsId });
    setIsMounted(false);
    router.replace('/user');
  };

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!proofOfUs) return;
    changeTitle(e.target.value);
  };

  if (!isMounted) return null;

  return (
    <section>
      <h3>Details</h3>

      <button onClick={handleRedo}>redo</button>
      <button onClick={handleClose}>delete</button>
      <input
        name="title"
        onChange={handleTitleChange}
        value={proofOfUs.title}
      />
      <img src={background} />
      <button onClick={handleShare}>Share</button>
    </section>
  );
};
