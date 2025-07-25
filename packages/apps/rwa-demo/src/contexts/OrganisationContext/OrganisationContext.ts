import { createContext } from 'react';

export interface IOrganisation {
  id: string;
  name: string;
  domains: { value: string }[];
  sendEmail: string;
}

export interface IOrganisationContext {
  organisation?: IOrganisation;
}

export const OrganisationContext = createContext<IOrganisationContext | null>(
  null,
);
