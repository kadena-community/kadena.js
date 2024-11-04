import { AddToken } from '@/Components/Assets/AddToken';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';

const NewAsset = () => {
  const { setAsideTitle } = useLayout();

  useEffect(() => {
    setAsideTitle('Add new Asset');
  }, []);

  return <AddToken />;
};

export default NewAsset;
