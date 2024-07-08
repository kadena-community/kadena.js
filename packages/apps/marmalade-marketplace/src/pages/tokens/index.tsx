import React, { useState, FormEvent } from 'react';
import { Heading , Select, SelectItem} from '@kadena/kode-ui';
import Layout from '@/components/Layout';
import CreateToken from '@/components/CreateToken';

import MintToken from '@/components/MintToken';

export default function TokenPages() {
  const [tokenFunction, setTokenFunction] = useState("Create")
  return (
    <>
      <title>{tokenFunction}</title>
      <Select description="Select Function" size="sm" label="Token Function" name="Token Function" selectedKey={tokenFunction}  onSelectionChange={e => setTokenFunction((e as string))}>
        <SelectItem key="Create" textValue="Create">Create Token</SelectItem>
        <SelectItem key="Mint" textValue="Mint">Mint Token</SelectItem>
      </Select>
      <Layout>
        <Heading> {tokenFunction} Token </Heading>
        {tokenFunction==="Create"?  <CreateToken/> : <MintToken/>}
     </Layout>
    </>
);
}
