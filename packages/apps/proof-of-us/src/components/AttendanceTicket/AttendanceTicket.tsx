import { getContrast } from '@/utils/getContrast';
import { getIPFSLink } from '@/utils/getIPFSLink';
import { Stack } from '@kadena/kode-ui';
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

//there are a couple of specific TICKETS where we do NOT want to show the date
//because they are not date specific.
//atm the only way to check those is to check the image hash
const DATEIGNOREHASHES = ['QmXK1eoQwPoYrmNKowRCybBN9M6AejwaCeht2xoyJP7CxC'];

export const AttendanceTicket: FC<IProps> = ({ data }) => {
  const color = data.properties?.avatar?.backgroundColor ?? 'white';
  const contrastColor = useMemo(() => getContrast(color), [color]);

  const ignoreDate = (imageUrl: string): boolean => {
    return !DATEIGNOREHASHES.find((hash) => imageUrl.includes(hash));
  };

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
      {data.properties.date && ignoreDate(data.image) && (
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
