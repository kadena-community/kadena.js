import { isReadyToMint } from '@/utils/isAlreadySigning';
import { Heading } from '@kadena/kode-ui';
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
      {Math.round(percentage * 10000) / 100}%
    </Heading>
  );
};
