import { motion } from 'framer-motion';
import type { FC } from 'react';
import { eventThumbClass, thumbWrapClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const EventThumb: FC<IProps> = ({ token }) => {
  const getInitial = (str: string) => {
    return str.slice(0, 1);
  };

  return (
    <span className={thumbWrapClass}>
      <motion.div
        layoutId={token.properties.eventId}
        className={eventThumbClass}
        style={{
          backgroundColor: 'green',
        }}
      >
        {getInitial(token.name)}
      </motion.div>
    </span>
  );
};
