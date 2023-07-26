import { formatDateDistance } from '@/utils/dates';
import React, { FC } from 'react';

interface IProps {
  date: string;
}

export const FormatDate: FC<IProps> = ({ date }) => {
  return <time dateTime={date}>{formatDateDistance(new Date(date))}</time>;
};
