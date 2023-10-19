import type { FC } from 'react';
import React from 'react';
import { Tweet as ReactTweet } from 'react-tweet';
import { wrapperClass } from './styles.css';

interface IProps {
  tweetId: string;
}

export const Tweet: FC<IProps> = ({ tweetId }) => {
  return (
    <div className={wrapperClass}>
      <ReactTweet id={tweetId} />
    </div>
  );
};
