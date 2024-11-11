export const getInitials = (name: string) => {
  let initials = '';
  const splitName = name.split(/[' '-]/);
  const has2names = splitName.length > 1;
  if (has2names) {
    initials = splitName
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  } else {
    initials = name.slice(0, 2).toUpperCase();
  }

  return initials;
};
