import { getContrast } from '@/utils/getContrast';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  ticketBorderClass,
  ticketClass,
  ticketWrapClass,
  titleClass,
} from './style.css';
interface IProps {
  data: IProofOfUsTokenMeta;
}

export const AttendanceTicket: FC<IProps> = ({ data }) => {
  const [contrastColor, setContrastColor] = useState<string>('white');
  const color = data.properties?.avatar?.backgroundColor;

  useEffect(() => {
    const color = getContrast(data.properties?.avatar?.backgroundColor ?? '');
    setContrastColor(color);
  }, [data.properties?.avatar?.backgroundColor]);
  return (
    <>
      <div className={ticketWrapClass}>
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
              textShadow: `-1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color}, 1px 1px 0 ${color}`,
            }}
          >
            {data.name}
          </h4>

          <div style={{ color: contrastColor }}>
            <h5>Date</h5>
            {new Date(data.properties.date).toDateString()}
          </div>
        </motion.div>
      </div>
    </>
  );
};
