import React, { FC, memo } from 'react';
import s from './CommantInfo.module.css';

interface Props {
  value: string;
  title: string;
  host: string;
}

const CommandInfo: FC<Props> = props => {
  return (
    <div className={s.infoContainer}>
      <p className={s.info}>{props.title}</p>
      <div className={s.infoText}>{props.value}</div>
      <p className={s.info}>API Host</p>
      <div className={s.infoText}>{props.host}</div>
    </div>
  );
};

export default memo(CommandInfo);
