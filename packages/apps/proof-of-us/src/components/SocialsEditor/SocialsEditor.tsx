import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC, FormEventHandler } from 'react';
import { useRef } from 'react';

export const SocialsEditor: FC = () => {
  const { proofOfUs, addSocial, removeSocial } = useProofOfUs();
  const { account } = useAccount();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!proofOfUs || !account) return null;

  const signer = proofOfUs.signees.find((c) => c.cid === account.cid);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!inputRef.current) return;
    addSocial(inputRef.current.value);
    inputRef.current.value = '';
  };
  const handleDelete = (link: ISocial) => {
    removeSocial(link);
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
