import type { FC } from 'react';
import { SigneeItem } from './SigneeItem';
import { wrapperClass } from './styles.css';

interface IProps {
  signees?: IProofOfUsTokenSignee[];
  authors: { name: string }[];
}
export const Signees: FC<IProps> = ({ signees, authors }) => {
  return (
    <section className={wrapperClass}>
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
    </section>
  );
};
