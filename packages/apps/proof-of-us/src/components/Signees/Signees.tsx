import type { FC } from 'react';
import { SigneeItem } from './SigneeItem';
import { wrapperClass } from './styles.css';

interface IProps {
  signees?: IProofOfUsSignee[];
  authors: { name: string }[];
}
export const Signees: FC<IProps> = ({ signees, authors }) => {
  console.log({ signees, authors });
  return (
    <section className={wrapperClass}>
      {signees
        ? signees.map((signee, idx) => (
            <SigneeItem
              key={signee.label}
              name={signee.label}
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
