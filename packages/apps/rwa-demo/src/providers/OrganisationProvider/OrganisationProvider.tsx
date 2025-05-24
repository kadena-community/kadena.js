'use client';

import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { OrganisationStore } from '@/utils/store/organisationStore';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

export const OrganisationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();

  const orgStore = useMemo(() => {
    const id = localStorage.getItem(getLocalStorageKey('orgId')) ?? '';
    return OrganisationStore(id);
  }, []);

  const init = async () => {
    orgStore.listenToOrganisation(setOrganisation);
  };

  useEffect(() => {
    if (!orgStore) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [orgStore]);

  return (
    <OrganisationContext.Provider value={{ organisation }}>
      {children}
    </OrganisationContext.Provider>
  );
};
