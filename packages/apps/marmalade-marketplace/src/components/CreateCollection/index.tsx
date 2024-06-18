import React, { FormEvent } from 'react';
import { Stack , Tabs, TabItem, Button, TextareaField, TextField} from '@kadena/react-ui';
import { useAccount } from '@/hooks/account';
import { useRouter } from 'next/navigation';
//import form components
import RoyaltyForm from '@/components/RoyaltyForm';
import GuardForm from '@/components/GuardForm';
import CollectionForm from '@/components/CollectionForm';
import PolicyForm from '@/components/PolicyForm';

import { CreateCollectionId, CreateCollection, createCollection, createCollectionId, ICreateCollectionPolicyConfig } from "@kadena/client-utils/marmalade";

import { PactNumber } from "@kadena/pactjs";
import { ChainId, BuiltInPredicate } from "@kadena/client";
import { createImageUrl, createMetaDataUrl, convertToBase64 } from '@/utils/upload';
import { env } from '@/utils/env';
import LoadingButton from '@/components/LoadingButton';
import ResponseMessage from '@/components/ResponseMessage';
import * as styles from '@/styles/create-token.css';
import { createSignWithSpireKey, parseTx } from '@/utils/signWithSpireKey';

function CreateCollectionComponent() {

  const [createCollectionInput, setCreateCollectionInput] = useState({
    collectionName: "",
    collectionOperatorGuard: tokenInput.creatorGuard,
    collectionSize: 0,
    collectionChainId: "0" as ChainId
  });

  const handleSubmitCollection = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const collectionId = await createCollectionId({ "collectionName":createCollectionInput.collectionName, "operator":createAccountKeyset(createCollectionInput.collectionOperatorGuard), "chainId": createCollectionInput.collectionChainId as ChainId ,"networkId": config.networkId, "host": config.host,});

      const result = await createCollection(
        { "name":createCollectionInput.collectionName as string, "id": collectionId as string, "operator": createAccountKeyset(createCollectionInput.collectionOperatorGuard), "size": {"int": createCollectionInput.collectionSize.toString()}, "chainId": createCollectionInput.collectionChainId},
        { ...config,
          "defaults": { "networkId": config.networkId, meta: { "chainId": createCollectionInput.collectionChainId } }
        },
        ).execute();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.formSection}>
    <form onSubmit={handleSubmitCollection}>
        <TextField label="Collection Name" name="collectionName" value={createCollectionInput.collectionName} onChange={handleCreateCollectionInputChange}  />
        <TextField label="Collection Operator Guard" name="collectionOperatorGuard" value={createCollectionInput.collectionOperatorGuard} onChange={handleCreateCollectionInputChange} />
        <TextField label="Collection Size" name="collectionSize" value={createCollectionInput.collectionSize.toString()} onChange={handleCreateCollectionInputChange} />
        <TextField label="Collection Chain Id" name="collectionChainId" value={createCollectionInput.collectionChainId} onChange={handleCreateCollectionInputChange} />
        <Button type="submit">Create Collection</Button>
    </form>
    </div>
  );
}

export default function CreateCollection() {
  return (
    <CreateCollectionComponent />
  );
}