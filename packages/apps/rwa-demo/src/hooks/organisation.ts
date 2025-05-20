import type { IOrganisationContext } from '@/contexts/OrganisationContext/OrgainisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrgainisationContext';
import { useContext } from 'react';

export const useOrganisation = (): IOrganisationContext =>
  useContext(OrganisationContext);
