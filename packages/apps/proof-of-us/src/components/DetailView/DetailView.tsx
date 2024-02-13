import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { SystemIcon } from '@kadena/react-ui';
import type { ChangeEventHandler, FC } from 'react';
import { useState } from 'react';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { SocialsEditor } from '../SocialsEditor/SocialsEditor';
import { TitleHeader } from '../TitleHeader/TitleHeader';
import {
  backButtonClass,
  closeButtonClass,
  imageWrapper,
  titleInputClass,
} from './style.css';

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
    if (!confirm('Are you sure you want to retake your photo?')) return;
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
      <TitleHeader
        Prepend={() => (
          <>
            {!isAlreadySigning(proofOfUs.signees) && (
              <button className={backButtonClass} onClick={handleRedo}>
                <SystemIcon.ArrowCollapseDown />
              </button>
            )}
          </>
        )}
        label="Details"
        Append={() => (
          <>
            {!isAlreadySigning(proofOfUs.signees) && (
              <button className={closeButtonClass} onClick={handleClose}>
                <SystemIcon.Close />
              </button>
            )}
          </>
        )}
      />

      {!isAlreadySigning(proofOfUs.signees) ? (
        <>
          <div className={imageWrapper}>
            <ImagePositions />

            <input
              className={titleInputClass}
              name="title"
              placeholder="title"
              onChange={handleTitleChange}
              defaultValue={proofOfUs.title}
            />
          </div>

          <SocialsEditor />
        </>
      ) : (
        <ImagePositions />
      )}

      <Button variant="primary" onPress={handleShare}>
        Share
      </Button>
    </section>
  );
};
