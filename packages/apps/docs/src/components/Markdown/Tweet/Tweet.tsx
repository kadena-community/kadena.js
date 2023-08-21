import React, { FC } from 'react';
import { Tweet as ReactTweet } from 'react-tweet';

interface IProps {
  tweetId: string;
}

export const Tweet: FC<IProps> = ({ tweetId }) => {
  return <ReactTweet id={tweetId} />;
};
