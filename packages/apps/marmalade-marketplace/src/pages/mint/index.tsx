import Mint from '@/components/MintToken';
import { Step, Stepper } from '@kadena/kode-ui';
import React from 'react';

const MintTokenPages = () => {
  return (
    <>
      <Stepper direction="horizontal">
        <Step>Create Token</Step>
        <Step active>Mint Token</Step>
      </Stepper>
      <Mint />
    </>
  );
};

export default MintTokenPages;
