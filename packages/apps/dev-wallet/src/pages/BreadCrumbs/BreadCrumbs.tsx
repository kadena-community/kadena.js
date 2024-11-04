import { BreadcrumbsItem, Breadcrumbs as BreadcrumbsUI } from '@kadena/kode-ui';
import { useSideBar } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const BreadCrumbs: FC = () => {
  const { breadCrumbs } = useSideBar();

  if (!breadCrumbs.length) return null;

  return (
    <BreadcrumbsUI icon={breadCrumbs[0].visual}>
      <>
        {breadCrumbs.map((crumb) => (
          <BreadcrumbsItem key={crumb.url} component={Link} href={crumb.url}>
            {crumb.label}
          </BreadcrumbsItem>
        ))}
      </>
    </BreadcrumbsUI>
  );
};
