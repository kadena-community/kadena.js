import { SystemIcon } from '@kadena/react-ui';
import type { FC } from 'react';
import { animateClass, checkClass } from './style.css';

interface IProps {
  status?: ISignerStatus;
}

export const SignStatus: FC<IProps> = ({ status = 'init' }) => {
  return (
    <div>
      {status === 'init' && <SystemIcon.CheckboxBlankOutline />}
      {status === 'signing' && <SystemIcon.Loading className={animateClass} />}
      {status === 'success' && <SystemIcon.Check className={checkClass} />}
      {status === 'error' && <SystemIcon.Close />}
    </div>
  );
};
