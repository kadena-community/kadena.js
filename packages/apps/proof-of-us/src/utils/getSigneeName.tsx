export const getSigneeName = (signee?: IProofOfUsSignee): string => {
  if (!signee) return 'Pending';
  return signee.name ? signee.name : signee.alias;
};
