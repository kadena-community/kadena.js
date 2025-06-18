'use client';
import { AdminsList } from '@/components/admin/AdminsList/AdminsList';
import { OrganisationInfoForm } from '@/components/admin/OrganisationInfoForm/OrganisationInfoForm';
import { UsersList } from '@/components/admin/UsersList/UsersList';
import { AdminButtonBar } from '@/components/AdminButtonBar/AdminButtonBar';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { Link as UILink } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Home = ({ params }: { params: { organisationId: string } }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();
  const searchParams = useSearchParams();
  const p = searchParams.get('p') || 'info';

  useEffect(() => {
    if (!params.organisationId) return;

    const init = async (organisationId: IOrganisation['id']) => {
      const orgStore = await OrganisationStore(organisationId);
      if (!orgStore) return;
      const data = await orgStore.getOrganisation();
      setOrganisation(data);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(params.organisationId);
  }, [params.organisationId]);

  if (!organisation) return null;
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin/root">
          root
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem
          component={Link}
          href={`/admin/root/organisations/${organisation?.id}`}
        >
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <AdminButtonBar>
        <UILink
          isCompact
          component={Link}
          href={`/admin/root/organisation/${organisation?.id}?p=info`}
          variant={p === 'info' ? 'primary' : 'outlined'}
        >
          Organisation info
        </UILink>

        <UILink
          isCompact
          component={Link}
          href={`/admin/root/organisation/${organisation?.id}?p=admins`}
          variant={p === 'admins' ? 'primary' : 'outlined'}
        >
          Admins
        </UILink>
        <UILink
          isCompact
          component={Link}
          href={`/admin/root/organisation/${organisation?.id}?p=users`}
          variant={p === 'users' ? 'primary' : 'outlined'}
        >
          Users
        </UILink>
      </AdminButtonBar>
      {p === 'info' && (
        <OrganisationInfoForm organisationId={organisation.id} />
      )}

      {p === 'admins' && <AdminsList organisationId={organisation?.id} />}
      {p === 'users' && <UsersList organisationId={organisation?.id} />}
    </>
  );
};

export default Home;
