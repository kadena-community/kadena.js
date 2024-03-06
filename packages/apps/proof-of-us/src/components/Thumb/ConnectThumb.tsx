import { getContrast } from '@/utils/getContrast';
import { getIPFSLink } from '@/utils/getIPFSLink';
import { MonoDownloading } from '@kadena/react-icons';
import classNames from 'classnames';
import type { FC } from 'react';
import { connectThumbClass } from './style.css';

interface IProps {
  token: IProofOfUsData;
  isMinted?: boolean;
}
export const ConnectThumb: FC<IProps> = ({ token, isMinted = true }) => {
  const invertColor = getContrast(token.backgroundColor ?? '#000');

  return (
    <div
      className={classNames(connectThumbClass)}
      style={{
        backgroundColor: token.backgroundColor,
        backgroundImage: isMinted
          ? `url("${getIPFSLink(token.imageUri)}")`
          : '',
        color: invertColor,
      }}
    >
      {!isMinted && <MonoDownloading />}
    </div>
  );
};
