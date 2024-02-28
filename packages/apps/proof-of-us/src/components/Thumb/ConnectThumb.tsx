import { getContrast } from '@/utils/getContrast';
import { MonoDownloading } from '@kadena/react-icons';
import classNames from 'classnames';
import { motion } from 'framer-motion';
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
    <motion.div
      layoutId={token.image}
      className={classNames(connectThumbClass)}
      style={{
        backgroundColor: token.properties.avatar?.backgroundColor,
        backgroundImage: isMinted ? `url("${token.image}")` : '',
        color: invertColor,
      }}
    >
      {!isMinted && <MonoDownloading />}
    </motion.div>
  );
};
