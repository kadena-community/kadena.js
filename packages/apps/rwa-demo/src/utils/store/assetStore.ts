import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { get, off, onValue, ref, set } from 'firebase/database';
import { getAssetFolder } from '.';
import { database } from './firebase';

export const AssetStore = (organisation: IOrganisation) => {
  if (!organisation) {
    throw new Error('no organisation or user found');
  }
  const dbLocationString = `/organisations/${organisation.id}/assets`;

  const listenToAssets = (setDataCallback: (assets: IAsset[]) => void) => {
    const assetsRef = ref(database, dbLocationString);
    onValue(assetsRef, async (snapshot) => {
      const data = { ...snapshot.val() } as IAsset[];

      const newData = Object.entries(data ?? {})?.map(([, val]) => {
        return val;
      });

      setDataCallback(newData);
    });

    return () => off(assetsRef);
  };

  const listenToAsset = (
    asset: IAsset,
    setDataCallback: (assets: IAsset) => void,
  ) => {
    const assetFolderName = getAssetFolder(asset);
    if (!assetFolderName) return;
    const assetRef = ref(database, `${dbLocationString}/${assetFolderName}`);
    onValue(assetRef, async (snapshot) => {
      const val = snapshot.val();
      if (!val) return;
      const data = { ...val } as IAsset;
      setDataCallback(data);
    });

    return () => off(assetRef);
  };

  const addAsset = async (asset: IAsset) => {
    const assetFolderName = getAssetFolder(asset);
    if (!assetFolderName || !asset.namespace || !asset.contractName) return;

    const existingAsset = await get(
      ref(database, `${dbLocationString}/${assetFolderName}`),
    );

    return await set(ref(database, `${dbLocationString}/${assetFolderName}`), {
      ...(existingAsset.toJSON() ?? {}),
      ...asset,
    });
  };

  const updateAsset = async (asset: IAsset) => {
    return addAsset(asset);
  };

  const removeAsset = async (asset: IAsset) => {
    const assetFolderName = getAssetFolder(asset);
    if (!assetFolderName) return;

    return await set(
      ref(database, `${dbLocationString}/${assetFolderName}`),
      null,
    );
  };

  const getAsset = async (asset: IAsset) => {
    const assetFolderName = getAssetFolder(asset);
    if (!assetFolderName) return;

    return await get(ref(database, `${dbLocationString}/${assetFolderName}`));
  };

  return {
    listenToAssets,
    listenToAsset,
    addAsset,
    removeAsset,
    updateAsset,
    getAsset,
  };
};
