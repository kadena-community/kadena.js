import React from 'react';

import { circleClass, statusClass } from './Badge.css';

export interface IBadgeProps {
  name?: string;
  imageUrl?: string;
  size?: 'small' | 'extrasmall' | 'base';
  icon?: React.ReactNode; // accept it and use prios
  // categorical colors rename
  statusColor?: string;
}

export const Badge = (props: IBadgeProps) => {
  const getInitials = (name: string | undefined) => {
    if (!name) return '';

    let initials = '';
    const has2names = name.split(' ').length > 1;
    if (has2names) {
      initials = name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    } else {
      initials = name.slice(0, 2).toUpperCase();
    }

    return initials;
  };

  const initials = getInitials(props.name);
  const mainCircleStyle = props.imageUrl
    ? { backgroundImage: `url(${props.imageUrl})`, backgroundSize: 'cover' }
    : {};

  return (
    <div className={circleClass} style={mainCircleStyle}>
      {initials}
      <div className={statusClass}></div>
    </div>
  );
};
