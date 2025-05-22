import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResult } from 'firebase/auth';
import { get, off, onValue, ref, set } from 'firebase/database';
import { getAssetFolder } from '.';
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

  const listenToAsset = (
    organisationId: IOrganisation['id'],
    asset: IAsset,
    setDataCallback: (assets: IAsset) => void,
  ) => {
    const assetFolderName = getAssetFolder(asset);
    if (!organisationId || !assetFolderName) return;
    const assetRef = ref(
      database,
      `organisations/${organisationId}/assets/${assetFolderName}`,
    );
    onValue(assetRef, async (snapshot) => {
      const data = { ...snapshot.val() } as IAsset;

      setDataCallback(data);
    });

    return () => off(assetRef);
  };

  const addAsset = async (
    organisationId: IOrganisation['id'],
    asset: IAsset,
  ) => {
    const assetFolderName = getAssetFolder(asset);
    if (
      !organisationId ||
      !assetFolderName ||
      !asset.namespace ||
      !asset.contractName
    )
      return;
    return await set(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolderName}`,
      ),
      asset,
    );
  };

  const updateAsset = async (
    organisationId: IOrganisation['id'],
    asset: IAsset,
  ) => {
    return addAsset(organisationId, asset);
  };

  const removeAsset = async (
    organisationId: IOrganisation['id'],
    asset: IAsset,
    userToken?: IdTokenResult,
  ) => {
    if (!userToken?.claims.orgAdmin) return;

    const assetFolderName = getAssetFolder(asset);
    if (!organisationId || !assetFolderName) return;

    return await set(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolderName}`,
      ),
      null,
    );
  };

  const getAsset = async (
    organisationId: IOrganisation['id'],
    asset: IAsset,
  ) => {
    const assetFolderName = getAssetFolder(asset);
    if (!organisationId || !assetFolderName) return;

    return await get(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolderName}`,
      ),
    );
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

export const assetStore = AssetStore();
