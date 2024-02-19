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

  const getSocial = (url: string): ISocial | undefined => {
    const foundSocial = supportedSocials.find((s) => url.startsWith(s.name));

    return foundSocial;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError('');
    if (!inputRef.current || !signer) return;

    const socials = signer.socialLinks ?? [];
    const value = inputRef.current.value;

    const socialType = getSocial(value);
    if (!socialType) {
      setError(`${value} is not a valid social link`);
      return;
    }

    const newSigner = {
      ...signer,
      socialLinks: [...socials, value],
    };
    updateSigner(newSigner);
    inputRef.current.value = '';
  };
  const handleDelete = (link: string) => {
    if (!signer) return;

    const socials = signer.socialLinks?.filter((l) => l !== link) ?? [];
    const newSigner = { ...signer, socialLinks: [...socials] };

    updateSigner(newSigner);
  };

  return (
    <section>
      <h4>Socials</h4>
      <ul className={listClass}>
        {signer?.socialLinks?.map((link) => {
          const socialType = getSocial(link);
          if (!socialType) return null;
          const Icon = socialType.Icon;
          return (
            <li key={link} className={liClass}>
              {link} <Icon />
              <button onClick={() => handleDelete(link)}>delete</button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleSubmit}>
        <input ref={inputRef} name="new" />
        <button type="submit">add</button>
        <div>{error}</div>
      </form>
    </section>
  );
};
