import { createContext } from 'react';

export interface IOrganisationContext {
  organisationId?: string;
}

export const OrganisationContext = createContext<IOrganisationContext>({
  organisationId: undefined,
});
