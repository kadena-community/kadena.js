import { getContrast } from '@/utils/getContrast';
import { getIPFSLink } from '@/utils/getIPFSLink';
import { MonoDownloading } from '@kadena/react-icons';
import classNames from 'classnames';
import type { FC } from 'react';
import { connectThumbClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
  isMinted?: boolean;
}
export const ConnectThumb: FC<IProps> = ({ token, isMinted = true }) => {
  const invertColor = getContrast(
    token.properties.avatar?.backgroundColor ?? '#000',
  );

  return (
    <div
      className={classNames(connectThumbClass)}
      style={{
        backgroundColor: token.properties.avatar?.backgroundColor,
        backgroundImage: isMinted ? `url("${getIPFSLink(token.image)}")` : '',
        color: invertColor,
      }}
    >
      {!isMinted && <MonoDownloading style={{ fill: invertColor }} />}
    </div>
  );
};
