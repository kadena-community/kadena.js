import { MonoLogoLinkedin, MonoLogoX } from '@kadena/react-icons';

interface ISocialType {
  name: string;
  icon: keyof typeof SocialIcons;
}
const supportedSocials: ISocialType[] = [
  {
    name: 'https://twitter.com/',
    icon: 'MonoLogoX',
  },
  {
    name: 'https://x.com/',
    icon: 'MonoLogoX',
  },
  {
    name: 'https://www.linkedin.com/in',
    icon: 'MonoLogoLinkedin',
  },
];

export const SocialIcons = {
  MonoLogoX: MonoLogoX,
  MonoLogoLinkedin: MonoLogoLinkedin,
};

export const getSocial = (url?: string): ISocialType | undefined => {
  if (!url) return;
  const foundSocial = supportedSocials.find((s) => url.startsWith(s.name));
  return foundSocial;
};
