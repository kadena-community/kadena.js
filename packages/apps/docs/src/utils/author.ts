export const getInitials = (name: string): string => {
  const names = name.split(' ');
  let str = '';
  const firstName = names.shift();
  const lastName = names.pop();

  if (firstName !== undefined) str += firstName.charAt(0);
  if (lastName !== undefined) str += lastName.charAt(0);

  return str.toUpperCase();
};
