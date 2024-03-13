export const getInitials = (name: string | undefined) => {
  if (!name) {
    return '';
  }

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
