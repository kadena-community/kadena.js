import type { FC } from 'react';
import { SigneeItem } from './SigneeItem';
import { listClass } from './styles.css';

interface IProps {
  signees?: IProofOfUsTokenSignee[];
  authors: { name: string }[];
}
export const Signees: FC<IProps> = ({ signees, authors }) => {
  console.log({ signees, authors });
  return (
    <section>
      <ul className={listClass}>
        {signees
          ? signees.map((signee, idx) => (
              <SigneeItem
                key={signee.name}
                name={signee.name}
                accountName={signee.accountName}
                idx={idx}
                socialLink={signee.socialLink}
              />
            ))
          : authors.map((author, idx) => (
              <SigneeItem key={author.name} name={author.name} idx={idx} />
            ))}
      </ul>
    </section>
  );
};
