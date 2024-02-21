import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoLogoLinkedin, MonoLogoX } from '@kadena/react-icons';
import type { FC, FormEventHandler } from 'react';
import { useRef, useState } from 'react';
import { liClass, listClass } from './style.css';

interface ISocial {
  name: string;
  Icon: FC;
}
const supportedSocials: ISocial[] = [
  {
    name: 'https://twitter.com/',
    Icon: MonoLogoX,
  },
  {
    name: 'https://x.com/',
    Icon: MonoLogoX,
  },
  {
    name: 'https://www.linkedin.com/in',
    Icon: MonoLogoLinkedin,
  },
];

export const SocialsEditor: FC = () => {
  const { proofOfUs, updateSigner } = useProofOfUs();
  const { account } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  if (!proofOfUs || !account || isAlreadySigning(proofOfUs.signees))
    return null;

  const signer = proofOfUs.signees.find(
    (c) => c.accountName === account.accountName,
  );

  const getSocial = (url?: string): ISocial | undefined => {
    if (!url) return;
    const foundSocial = supportedSocials.find((s) => url.startsWith(s.name));
    return foundSocial;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError('');
    if (!inputRef.current || !signer) return;

    const value = inputRef.current.value;
    const socialType = getSocial(value);

    if (!socialType && value) {
      setError(`${value} is not a valid social link`);
      return;
    }

    const newSigner = {
      ...signer,
      socialLink: value,
    };
    updateSigner(newSigner);
  };

  const socialType = getSocial(signer?.socialLink);
  const Icon = socialType?.Icon;

  return (
    <section>
      <h4>Socials</h4>

      <form onSubmit={handleSubmit}>
        <input ref={inputRef} name="new" defaultValue={signer?.socialLink} />
        <button type="submit">add</button>
        {Icon && <Icon />}
        <div>{error}</div>
      </form>
    </section>
  );
};
