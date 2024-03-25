import classNames from 'classnames';
import type { FC } from 'react';
import { multipleWrapperClass, wrapperClass } from '../ListSignees/style.css';
import { SigneeItem } from './SigneeItem';

interface IProps {
  signees?: IProofOfUsTokenSignee[];
  authors: { name: string }[];
}
export const Signees: FC<IProps> = ({ signees, authors }) => {
  const isMultiple = signees?.length && signees?.length > 2;
  console.log({ signees, isMultiple });
  return (
    <ul
      className={classNames(
        wrapperClass,
        isMultiple ? multipleWrapperClass : '',
      )}
    >
      {signees
        ? signees.map((signee, idx) => (
            <SigneeItem
              key={signee.name}
              name={signee.name}
              accountName={signee.accountName}
              idx={idx}
              socialLink={signee.socialLink}
              isMultiple={isMultiple}
            />
          ))
        : authors.map((author, idx) => (
            <SigneeItem
              key={author.name}
              name={author.name}
              idx={idx}
              isMultiple={isMultiple}
            />
          ))}
    </ul>
  );
};
