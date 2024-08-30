import { IPactInt } from '../../../../libs/types/dist/types';
import { PactNumber } from '@kadena/pactjs';

export const parsePactDate = (date: IPactInt) =>
  date ? new Date(Number(date.int) * 1000) : null;

export const getTimeUntilNextPriceChange = (
  priceIntervalSeconds: number,
  targetTime: number,
): string => {
  const intervalMillis = priceIntervalSeconds * 1000;
  const nextIntervalTime =
    Math.ceil(targetTime / intervalMillis) * intervalMillis;
  const timeUntilNextInterval = nextIntervalTime - targetTime;

  const days = Math.floor(timeUntilNextInterval / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeUntilNextInterval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor(
    (timeUntilNextInterval % (1000 * 60 * 60)) / (1000 * 60),
  );
  const seconds = Math.floor((timeUntilNextInterval % (1000 * 60)) / 1000);

  let timeString = '';

  if (days > 0) timeString += `${days} day${days > 1 ? 's' : ''}, `;
  if (hours > 0) timeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
  if (minutes > 0) timeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
  timeString += `${seconds} second${seconds > 1 ? 's' : ''}`;

  return timeString.trim();
};

export const getTimestampFromDays = (days:number) => {
  return new PactNumber(Math.floor(new Date().getTime()/1000) + days * 24 * 60 * 60).toPactInteger()
}