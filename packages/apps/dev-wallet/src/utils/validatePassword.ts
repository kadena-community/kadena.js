export const validatePassword = (val: string) => {
  if (!val.length) return 'This field is required';
  if (!/^\S*$/.test(val)) return 'You are not allowed to use spaces';
  if (val.length < 6) return 'Minimum 6 symbols';
  if (!/[A-Z]/.test(val)) return 'You need at least 1 uppercase character';
  if (!/[^A-Za-z0-9]/.test(val)) return 'You need at least 1 special character';
  return true;
};
