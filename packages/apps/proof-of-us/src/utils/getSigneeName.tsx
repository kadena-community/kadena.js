export const getSigneeName = (signee?: IProofOfUsSignee): string => {
  console.log(signee);
  if (!signee) return 'Pending';
  return signee.name ? signee.name : signee.alias;
};
