import { getContrast } from '@/utils/getContrast';
import { getIPFSLink } from '@/utils/getIPFSLink';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useMemo } from 'react';
import {
  dateClass,
  dateTitleClass,
  dateWrapperClass,
  ticketBorderClass,
  ticketClass,
  titleClass,
} from './style.css';

interface IProps {
  data: IProofOfUsTokenMeta;
}

export const AttendanceTicket: FC<IProps> = ({ data }) => {
  const color = data.properties?.avatar?.backgroundColor ?? 'white';
  const contrastColor = useMemo(() => getContrast(color), [color]);

  return (
    <motion.div
      layoutId={data.image}
      className={ticketClass}
      style={{
        backgroundImage: `url("${getIPFSLink(data.image)}")`,
        backgroundColor: data.properties?.avatar?.backgroundColor,
      }}
    >
      <img
        className={ticketBorderClass}
        src="/assets/attendance-border-large.svg"
      />

      <h4
        className={titleClass}
        style={{
          color: contrastColor,
          textShadow: `1px 1px 0px ${color}`,
        }}
      >
        {data.name}
      </h4>
      {data.properties.date && (
        <Stack
          flexDirection="column"
          className={dateWrapperClass}
          style={{ color: contrastColor, textShadow: `1px 1px 0px ${color}` }}
        >
          <h5 className={dateTitleClass}>Date</h5>
          <span className={dateClass}>
            {new Date(data.properties.date).toDateString()}
          </span>
        </Stack>
      )}
    </motion.div>
  );
};
