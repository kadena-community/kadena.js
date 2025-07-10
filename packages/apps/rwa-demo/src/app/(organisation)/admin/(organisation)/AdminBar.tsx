import { AdminButtonBar } from '@/components/AdminButtonBar/AdminButtonBar';
import { Link as UILink } from '@kadena/kode-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminBar = () => {
  const pathname = usePathname();

  return (
    <AdminButtonBar>
      <UILink
        isCompact
        component={Link}
        href={`/admin`}
        variant={pathname === '/admin' ? 'primary' : 'outlined'}
      >
        Organisation info
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin/admins`}
        variant={pathname === '/admin/admins' ? 'primary' : 'outlined'}
      >
        Admins
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin/assets`}
        variant={pathname === '/admin/assets' ? 'primary' : 'outlined'}
      >
        Assets
      </UILink>
      <UILink
        isCompact
        component={Link}
        href={`/admin/users`}
        variant={pathname === '/admin/users' ? 'primary' : 'outlined'}
      >
        Users
      </UILink>
    </AdminButtonBar>
  );
};
