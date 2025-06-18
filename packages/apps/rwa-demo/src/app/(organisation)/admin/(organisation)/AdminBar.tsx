import { AdminButtonBar } from '@/components/AdminButtonBar/AdminButtonBar';
import { Link as UILink } from '@kadena/kode-ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const AdminBar = () => {
  const searchParams = useSearchParams();
  const p = searchParams.get('p') || 'info';
  return (
    <AdminButtonBar>
      <UILink
        isCompact
        component={Link}
        href={`/admin?p=info`}
        variant={p === 'info' ? 'primary' : 'outlined'}
      >
        Organisation info
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin?p=admins`}
        variant={p === 'admins' ? 'primary' : 'outlined'}
      >
        Admins
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin/assets?p=assets`}
        variant={p === 'assets' ? 'primary' : 'outlined'}
      >
        Assets
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin/users?p=users`}
        variant={p === 'users' ? 'primary' : 'outlined'}
      >
        Users
      </UILink>
    </AdminButtonBar>
  );
};
