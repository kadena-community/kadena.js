import { wrapperClass } from './styles.css';

import React, { type FC } from 'react';
import { Tweet as ReactTweet } from 'react-tweet';

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
