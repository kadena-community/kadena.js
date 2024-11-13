'use client';
import { SecurityForm } from '@/components/SecurityForm/SecurityForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoAdd } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';

const Home = () => {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const handleCheckNewSecurity = () => {
    setIsRightAsideExpanded(true);
  };

  return (
    <div>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/">Tokens</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      {isRightAsideExpanded && <SecurityForm />}
      <Button startVisual={<MonoAdd />} onClick={handleCheckNewSecurity}>
        Create New Security
      </Button>
    </div>
  );
};

export default Home;
