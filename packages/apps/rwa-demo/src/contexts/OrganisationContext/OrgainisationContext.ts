import { createContext } from 'react';

export interface IOrganisation {
  id: string;
  name: string;
}

export interface IOrganisationContext {
  organisation?: IOrganisation;
}

export const OrganisationContext = createContext<IOrganisationContext>({
  organisation: undefined,
});
