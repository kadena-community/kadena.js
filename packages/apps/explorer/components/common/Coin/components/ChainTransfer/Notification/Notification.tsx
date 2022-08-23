import React, { FC } from 'react';
import Info from 'components/common/GlobalIcons/Info';
import CloseIcon from 'components/common/GlobalIcons/CloseIcon';
import s from './Notification.module.css';
import { IUnfinishedChains } from '../ChainTransfer';

interface Props {
  handleClick: (key: string) => void;
  handleRemove: (key: string) => void;
  unfinishedChains: IUnfinishedChains[];
}

const Notification: FC<Props> = React.memo(
  ({ unfinishedChains, handleClick, handleRemove }) => {
    return (
      <div className={s.notificationContainer}>
        <div className={s.container}>
          <span className={s.iconInfo}>
            <Info height="24" width="24" fill="#f6cc62" />
          </span>
          <div className={s.textContainer}>
            <div className={s.text}>
              You have an unfinished cross chain
              {unfinishedChains.length > 1 && <span>s</span>}
            </div>
            <div className={s.keyContainer}>
              {unfinishedChains?.map(chain => (
                <div key={chain.requestKey}>
                  <a
                    className={s.keyText}
                    onClick={() => handleClick(chain.requestKey)}>
                    {chain.requestKey}
                  </a>
                  <a
                    className={s.iconClose}
                    onClick={() => handleRemove(chain.requestKey)}>
                    <CloseIcon height="12" width="12" fill="#f6cc62" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Notification;
