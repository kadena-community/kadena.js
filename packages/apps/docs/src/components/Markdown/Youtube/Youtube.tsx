import { wrapper } from './styles.css';

import React, { FC } from 'react';

interface IProps {
  videoId: string;
  title: string;
}

export const Youtube: FC<IProps> = ({ videoId, title }) => {
  return (
    <div className={wrapper}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};
