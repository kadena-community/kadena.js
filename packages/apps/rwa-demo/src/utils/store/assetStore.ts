import { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

const AssetStore = () => {
  const listenToAssets = (
    organisationId: IOrganisation['id'],
    setDataCallback: (assets: IAsset[]) => void,
  ) => {
    if (!organisationId) return;
    const assetsRef = ref(database, `organisations/${organisationId}/assets`);
    onValue(assetsRef, async (snapshot) => {
      const data = { ...snapshot.val() } as IAsset[];

      const newData = Object.entries(data ?? {})?.map(([, val]) => {
        return val;
      });

      setDataCallback(newData);
    });

    return () => off(assetsRef);
  };

  const addAsset = async (
    organisationId: IOrganisation['id'],
    asset: IAsset,
  ) => {
    return await set(
      ref(database, `/organisations/${organisationId}/assets/${asset.uuid}`),
      asset,
    );
  };

  return { listenToAssets, addAsset };
};

export const assetStore = AssetStore();
