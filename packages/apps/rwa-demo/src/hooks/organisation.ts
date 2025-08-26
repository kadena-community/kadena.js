import type { IOrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { useContext } from 'react';

export const useOrganisation = (): IOrganisationContext => {
  const context = useContext(OrganisationContext);
  if (!context) {
    throw new Error(
      'useOrganisation must be used within a OrganisationContextProvider',
    );
  }
  return context;
};
