import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';
import { useEffect } from 'react';
import { MonoWifi } from '../../../../../libs/react-icons/dist/system/cjs';

interface IProps {
  signee: IProofOfUsSignee;
  isMe: boolean;
}

export const PingStatus: FC<IProps> = ({ signee }) => {
  const { updateSigneePing } = useProofOfUs();

  const update = async () => {
    if (!signee) return;
    await updateSigneePing(signee);
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section>
      <MonoWifi />
    </section>
  );
};
