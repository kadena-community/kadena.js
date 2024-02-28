import { initialsClass } from './select-profile.css';

const InitialsAvatar = (props: { name: string }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(props.name);

  return <div className={initialsClass}>{initials}</div>;
};

export default InitialsAvatar;
