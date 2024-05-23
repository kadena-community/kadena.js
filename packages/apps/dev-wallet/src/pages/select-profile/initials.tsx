import { initialsClass } from './select-profile.css';

const InitialsAvatar = (props: { name: string }) => {
  const getInitials = (name: string) => {
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

  const initials = getInitials(props.name || 'default');

  return <div className={initialsClass}>{initials}</div>;
};

export default InitialsAvatar;
