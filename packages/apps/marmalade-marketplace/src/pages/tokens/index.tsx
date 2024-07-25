import React, { useState } from 'react';
import CreateToken from '@/components/CreateToken';

export default function TokenPages() {
  const [tokenFunction, setTokenFunction] = useState("Create Token")
  return (
    <>
      <title>{tokenFunction}</title>
      <CreateToken/>
    </>
);
}