import { useAsset } from '@/hooks/asset';
import { useTogglePause } from '@/hooks/togglePause';
import type { Dispatch, FC, ReactElement, SetStateAction } from 'react';
import { useEffect } from 'react';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';

interface IProps {
  trigger: ReactElement;
  handleSetIsLoading?: Dispatch<SetStateAction<boolean>>;
}

export const PauseForm: FC<IProps> = ({ trigger, handleSetIsLoading }) => {
  const { paused } = useAsset();
  const { submit } = useTogglePause();

  const handlePauseToggle = async () => {
    try {
      if (handleSetIsLoading) handleSetIsLoading(true);
      return await submit({ isPaused: paused });
    } catch (e: any) {
      if (handleSetIsLoading) handleSetIsLoading(false);
    }
  };

  useEffect(() => {
    if (handleSetIsLoading) handleSetIsLoading(false);
  }, [paused]);

  return (
    <>
      <SendTransactionAnimation
        onPress={handlePauseToggle}
        trigger={trigger}
      ></SendTransactionAnimation>
    </>
  );
};
