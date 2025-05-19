'use client';

import { OrganisationContext } from '@/contexts/OrganisationContext/OrgainisationContext';
import type { FC, PropsWithChildren } from 'react';

export const OrganisationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <OrganisationContext.Provider value={{}}>
      {children}
    </OrganisationContext.Provider>
  );
};
