import { BreadcrumbsItem, Breadcrumbs as BreadcrumbsUI } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const BreadCrumbs: FC = () => {
  const { breadCrumbs } = useLayout();

  if (!breadCrumbs.length) return null;

  return (
    <BreadcrumbsUI icon={breadCrumbs[0].visual}>
      <>
        <BreadcrumbsItem component={Link} href="/">
          Dashboard
        </BreadcrumbsItem>
        {breadCrumbs.map((crumb) => (
          <BreadcrumbsItem key={crumb.url} component={Link} href={crumb.url}>
            {crumb.label}
          </BreadcrumbsItem>
        ))}
      </>
    </BreadcrumbsUI>
  );
};
