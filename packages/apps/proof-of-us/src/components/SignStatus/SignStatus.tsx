import {
  MonoAccessTime,
  MonoCheck,
  MonoClose,
  MonoLoading,
  MonoSignatureNotAllowed,
} from '@kadena/kode-icons';
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
      {status === 'signing' && <MonoLoading className={animateClass} />}
      {status === 'notsigning' && <MonoSignatureNotAllowed />}
      {status === 'success' && <MonoCheck className={checkClass} />}
      {status === 'error' && <MonoClose />}
    </div>
  );
};
