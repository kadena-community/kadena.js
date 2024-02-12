import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { FC, FormEventHandler } from 'react';
import { useRef } from 'react';

export const SocialsEditor: FC = () => {
  const { proofOfUs, updateSigner } = useProofOfUs();
  const { account } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!proofOfUs || !account || isAlreadySigning(proofOfUs.signees))
    return null;

  const signer = proofOfUs.signees.find(
    (c) => c.accountName === account.accountName,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!inputRef.current || !signer) return;

    const socials = signer.socialLinks ?? [];
    const newSigner = {
      ...signer,
      socialLinks: [...socials, inputRef.current.value],
    };
    updateSigner(newSigner);
    inputRef.current.value = '';
  };
  const handleDelete = (link: ISocial) => {
    if (!signer) return;

    const socials = signer.socialLinks?.filter((l) => l !== link) ?? [];
    const newSigner = { ...signer, socialLinks: [...socials] };

    updateSigner(newSigner);
  };

  return (
    <section>
      <h4>Socials</h4>
      <ul>
        {signer?.socialLinks?.map((link) => (
          <li key={link}>
            {link} <button onClick={() => handleDelete(link)}>delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input ref={inputRef} name="new" />
        <button type="submit">add</button>
      </form>
    </section>
  );
};
