import { motion } from 'framer-motion';
import type { FC } from 'react';
import { attendanceBorderClass, attendanceThumbClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const AttendanceThumb: FC<IProps> = ({ token }) => {
  console.log(token.properties.avatar?.backgroundColor);

  return (
    <motion.div
      layoutId={token.properties.eventId}
      className={attendanceThumbClass}
      style={{
        backgroundColor: token.properties.avatar?.backgroundColor ?? '#665BE1',
      }}
    >
      <img
        className={attendanceBorderClass}
        src="/assets/attendance-border-large.svg"
      />
    </motion.div>
  );
};
