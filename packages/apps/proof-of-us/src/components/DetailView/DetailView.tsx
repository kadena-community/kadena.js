import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import {
  MonoArrowBack,
  MonoCheck,
  MonoClose,
  MonoQrCodeScanner,
} from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { TextField } from '../TextField/TextField';
import { TitleHeader } from '../TitleHeader/TitleHeader';
import {
  checkClass,
  imageWrapper,
  infoTextClass,
  titleErrorClass,
} from './style.css';

interface IProps {
  next: () => void;
  prev: () => void;
}

export const DetailView: FC<IProps> = ({ next, prev }) => {
  const { proofOfUs, closeToken, changeTitle, updateProofOfUs } =
    useProofOfUs();
  const { removeBackground } = useAvatar();
  const [isMounted, setIsMounted] = useState(true);
  const router = useRouter();
  const [titleError, setTitleError] = useState<string>('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);

  const handleShare = () => {
    if (!proofOfUs?.title) {
      setTitleError('Title is empty');
      return;
    }

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

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    //TODO: this needs to debounce
    if (!proofOfUs) return;
    const value = e.target.value;
    if (!value) {
      setTitleError('Title is empty');
    } else {
      setTitleError('');
    }

    await updateProofOfUs({
      title: changeTitle(value),
    });
  };

  const handleCloseModal: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    setIsInfoModalOpen(false);
  };

  if (!isMounted) return null;

  return (
    <ScreenHeight>
      <TitleHeader
        Prepend={() => (
          <>
            {!isAlreadySigning(proofOfUs.signees) && (
              <IconButton onClick={handleRedo}>
                <MonoArrowBack />
              </IconButton>
            )}
          </>
        )}
        label="Details"
        Append={() => (
          <>
            {!isAlreadySigning(proofOfUs.signees) && (
              <IconButton onClick={handleClose}>
                <MonoClose />
              </IconButton>
            )}
          </>
        )}
      />

      {!isAlreadySigning(proofOfUs.signees) ? (
        <>
          <div className={imageWrapper}>
            <ImagePositions />
          </div>

          <TextField
            name="title"
            placeholder="Title"
            onChange={handleTitleChange}
            defaultValue={proofOfUs.title}
          />
        </>
      ) : (
        <ImagePositions />
      )}

      <Stack flex={1} />
      <Button variant="primary" onPress={handleShare}>
        Share <MonoQrCodeScanner />
      </Button>
      {titleError && <div className={titleErrorClass}>{titleError}</div>}
      {isInfoModalOpen && (
        <Modal label="Tap to Tag" onClose={() => setIsInfoModalOpen(false)}>
          <p className={infoTextClass}>
            Tag yourself on the picture by tapping anywhere on the photo
          </p>
          <Button onClick={handleCloseModal}>
            Capisce
            <MonoCheck className={checkClass} />
          </Button>
        </Modal>
      )}
    </ScreenHeight>
  );
};
