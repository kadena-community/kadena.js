import React, { FC } from 'react';

interface IProps {
  videoId: string;
  title: string;
}

export const Youtube: FC<IProps> = ({ videoId, title }) => {
  return (
    <span>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </span>
  );
};
