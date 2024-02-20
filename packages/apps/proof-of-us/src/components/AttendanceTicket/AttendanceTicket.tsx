import { getContrast } from '@/utils/getContrast';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
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
  console.log({ data });
  const color = data.properties?.avatar?.backgroundColor ?? 'white';
  const [contrastColor, setContrastColor] = useState<string>(color);

  useEffect(() => {
    const inverseColor = getContrast(color);
    setContrastColor(inverseColor);
  }, [data.properties?.avatar?.backgroundColor]);
  return (
    <motion.div
      layoutId="proof-of-us:jQ9ZFi5VDifZ_LekqHCGrP5EdgKTgU7WhrYkIWNPMe8"
      className={ticketClass}
      style={{
        backgroundImage: `url("${data.image}")`,
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
    </motion.div>
  );
};
