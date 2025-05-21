'use client';

import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { orgStore } from '@/utils/store/organisationStore';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

export const OrganisationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();

  const init = async (id: string) => {
    orgStore.listenToOrganisation(id, setOrganisation);
  };

  useEffect(() => {
    const id = localStorage.getItem(getLocalStorageKey('orgId'));
    if (!id) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(id);
  }, []);

  return (
    <OrganisationContext.Provider value={{ organisation }}>
      {children}
    </OrganisationContext.Provider>
  );
};
