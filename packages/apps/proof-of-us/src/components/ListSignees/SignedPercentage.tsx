import { isReadyToMint } from '@/utils/isAlreadySigning';
import { Heading } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { notReadytoMintClass, readytoMintClass } from './style.css';

interface IProps extends PropsWithChildren {
  percentage: number;
  signees?: IProofOfUsSignee[];
}

export const SignedPercentage: FC<IProps> = ({ percentage, signees }) => {
  const readyToMint = useMemo(() => isReadyToMint(signees), [signees]);

  return (
    <Heading
      as="h6"
      className={classNames(
        readyToMint ? readytoMintClass : notReadytoMintClass,
      )}
    >
      {percentage * 100}%
    </Heading>
  );
};
