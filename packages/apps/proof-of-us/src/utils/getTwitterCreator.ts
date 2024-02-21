export const getTwitterCreator = (
  signees?: IProofOfUsTokenSignee[],
): string | undefined => {
  if (!signees) return;
  const socialLinks = signees.map((s) => s.socialLinks).flat();
  const link = socialLinks.find(
    (link) => link?.includes('x.com') || link?.includes('twitter.com'),
  );

  if (!link) return;

  const creator = link.split('/').at(-1);

  return creator;
};
