import React, { useState, FormEvent } from 'react';
import { Heading , Select, SelectItem} from '@kadena/kode-ui';
import Layout from '@/components/Layout';
import Mint from '@/components/MintToken';

export default function MintTokenPages() {
  const [tokenFunction, setTokenFunction] = useState("Mint Token")
  return (
    <>
      <title>{tokenFunction}</title>
      <Mint/>
    </>
);
}
