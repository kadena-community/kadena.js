import { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { IdTokenResult } from 'firebase/auth';
import { get, off, onValue, ref, set } from 'firebase/database';
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
    assetId: string,
    setDataCallback: (assets: IAsset) => void,
  ) => {
    if (!organisationId || !assetId) return;
    const assetRef = ref(
      database,
      `organisations/${organisationId}/assets/${assetId}`,
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
    return await set(
      ref(database, `/organisations/${organisationId}/assets/${asset.uuid}`),
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
    assetId: string,
    userToken?: IdTokenResult,
  ) => {
    if (!userToken?.claims.orgAdmin) return;

    return await set(
      ref(database, `/organisations/${organisationId}/assets/${assetId}`),
      null,
    );
  };

  const getAsset = async (
    organisationId: IOrganisation['id'],
    assetId: string,
  ) => {
    return await get(
      ref(database, `/organisations/${organisationId}/assets/${assetId}`),
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
