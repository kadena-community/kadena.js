'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const router = useRouter();
  return (
    <button {...props} type="button" onClick={() => router.back()}>
      &lt; Back
    </button>
  );
}
