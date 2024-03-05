import { MonoAccessTime, MonoCheck, MonoClose } from '@kadena/react-icons';
import { SystemIcon } from '@kadena/react-ui';
import type { FC } from 'react';
import { animateClass, checkClass } from './style.css';

interface IProps {
  status?: ISignerStatus;
}

export const SignStatus: FC<IProps> = ({ status }) => {
  return (
    <div>
      {!status && <MonoAccessTime />}
      {status === 'init' && <MonoAccessTime />}
      {status === 'signing' && <SystemIcon.Loading className={animateClass} />}
      {status === 'success' && <MonoCheck className={checkClass} />}
      {status === 'error' && <MonoClose />}
    </div>
  );
};
