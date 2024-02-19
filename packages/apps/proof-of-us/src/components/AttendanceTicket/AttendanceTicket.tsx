import { getContrast } from '@/utils/getContrast';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ticketClass, ticketWrapClass, titleClass } from './style.css';
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
      <svg viewBox="0 0 160 90" width="1">
        <defs>
          <clipPath id="path" clipPathUnits="objectBoundingBox">
            <path
              style={{ fill: 'rgb(0,7,255)' }}
              transform="scale(0.0063, 0.011)"
              d="M159.764,30.921c-0.029,0 -0.059,0 -0.088,0c-7.771,0 -14.079,6.309 -14.079,14.079c-0,7.77 6.308,14.079 14.079,14.079c0.029,-0 0.059,-0 0.088,-0l0,31.008l-159.642,0l-0,-89.817l159.642,0l0,30.651Z"
            ></path>
          </clipPath>
        </defs>
      </svg>

      <div className={ticketWrapClass}>
        <motion.div
          layoutId="proof-of-us:jQ9ZFi5VDifZ_LekqHCGrP5EdgKTgU7WhrYkIWNPMe8"
          className={ticketClass}
          style={{
            backgroundImage: `url("${data.image}")`,
            backgroundColor: data.properties?.avatar?.backgroundColor,
          }}
        >
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
