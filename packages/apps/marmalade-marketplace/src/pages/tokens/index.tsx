import React, { useState, FormEvent } from 'react';
import { Heading , Select, SelectItem} from '@kadena/kode-ui';
import Layout from '@/components/Layout';
import CreateToken from '@/components/CreateToken';

import MintToken from '@/components/MintToken';

export default function TokenPages() {
  const [tokenFunction, setTokenFunction] = useState("Create Token")
  return (
    <>
      <title>{tokenFunction}</title>
      <CreateToken/>
    </>
);
}
