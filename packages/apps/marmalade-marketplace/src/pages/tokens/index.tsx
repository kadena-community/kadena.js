import React, { useState, FormEvent } from 'react';
import { Heading } from '@kadena/react-ui';
import { Providers } from "@/providers/Providers";
import Layout from '@/components/Layout';
import CreateToken from '@/components/CreateToken';

export default function TokenPages() {
  return (
    <Providers>
      <Layout>
        <Heading>
            <title>Create Token</title>
        </Heading>
        <CreateToken/>
      </Layout>
    </Providers>
);
}