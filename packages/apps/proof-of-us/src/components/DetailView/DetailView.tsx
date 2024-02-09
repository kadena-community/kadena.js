import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useRouter } from 'next/navigation';

import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { ChangeEventHandler, FC } from 'react';
import { useState } from 'react';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { SocialsEditor } from '../SocialsEditor/SocialsEditor';

interface IProps {
  next: () => void;
  prev: () => void;
}
export const DetailView: FC<IProps> = ({ next, prev }) => {
  const { proofOfUs, closeToken, changeTitle } = useProofOfUs();
  const { removeBackground } = useAvatar();
  const [isMounted, setIsMounted] = useState(true);
  const router = useRouter();

  const handleShare = () => {
    next();
  };

  if (!proofOfUs) return null;

  const handleRedo = async () => {
    if (!proofOfUs) return;
    if (!confirm('Are you sure you want to retake the photo?')) return;
    await removeBackground(proofOfUs);
    prev();
  };
  const handleClose = async () => {
    if (!confirm('Are you sure you want to stop with this token?')) return;
    await closeToken({ proofOfUsId: proofOfUs.proofOfUsId });
    setIsMounted(false);
    router.replace('/user');
  };

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    //TODO: this needs to debounce
    if (!proofOfUs) return;
    changeTitle(e.target.value);
  };

  if (!isMounted) return null;

  return (
    <section>
      <h3>Details</h3>

      {!isAlreadySigning(proofOfUs.signees) ? (
        <>
          <button onClick={handleRedo}>redo</button>
          <button onClick={handleClose}>delete</button>
          <input
            name="title"
            placeholder="title"
            onChange={handleTitleChange}
            defaultValue={proofOfUs.title}
          />
          <SocialsEditor />

          <ImagePositions />
        </>
      ) : (
        <ImagePositions />
      )}

      <button onClick={handleShare}>Share</button>
    </section>
  );
};
