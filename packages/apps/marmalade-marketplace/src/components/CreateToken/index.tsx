import React, { FormEvent , useState} from 'react';

import { env } from '@/utils/env';
import * as styles from '@/styles/create-token.css';
import { useRouter } from 'next/navigation';
import { Stack, Heading, Tabs, TabItem, Button, TextareaField, TextField} from '@kadena/react-ui';

//import form components
import RoyaltyForm from '@/components/RoyaltyForm';
import GuardForm from '@/components/GuardForm';
import CollectionForm from '@/components/CollectionForm';
import PolicyForm from '@/components/PolicyForm';

//import client
import { ChainId, BuiltInPredicate } from "@kadena/client";
import { createTokenId, createToken, ICreateTokenPolicyConfig } from "@kadena/client-utils/marmalade";

import { useAccount } from '@/hooks/account';
import { getPolicies, formatGuardInput, formatRoyaltyInput, createAccountKeyset, createPrecision} from '@/utils/getPolicies';

import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import { Blob, File, NFTStorage } from 'nft.storage';

import { createSignWithSpireKey } from '@/utils/signWithSpireKey';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';


function CreateTokenComponent() {
  const router = useRouter() as AppRouterInstance;
  const { account, isMounted, login, logout } = useAccount();
  
  const walletKeyset =  {
    "keys": account ? [account?.credentials[0].publicKey] : [],
    "pred": "keys-all" as BuiltInPredicate
  }

  const walletAccount = account ? account.accountName : "";

  const accountKeyset = {
    "account": walletAccount,
    "keyset": walletKeyset
  };

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState('');


  const formatInput = (input: typeof tokenInput) => {
    return {
      ...input,
      chainId: input.chainId as ChainId,
      precision: createPrecision(input.precision),
      creator: createAccountKeyset(input.creatorGuard)
    };
  };

  const convertToBase64 = (file:File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files) {
      const file = dataTransfer.files[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
      convertToBase64(file);    
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
      convertToBase64(file);
    } else {
      console.log('No files selected');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const [isFormValid, setIsFormValid] = useState(false);
    
  const [tokenInput, setTokenInput] = useState({
    uri: "",
    tokenId: "",
    precision: "0",
    chainId: "0",
    creatorGuard: accountKeyset.keyset.keys[0],
    metadataName:"", 
    metadataDescription:"", 
    metadataCollectionName: "", 
    metadataCollectionFamily: "", 
    metadataProperties: JSON.stringify({}), 
    metadataAuthors: ""
  });

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTokenInput((prev) => ({ ...prev, [name]: value }));
  };

  const metadata = {
    "name": tokenInput.metadataName,
    "description": tokenInput.metadataDescription,
    "image": "",
    "authors": [tokenInput.metadataAuthors],
    "properties": tokenInput.metadataProperties,
    "collection": {
      "name":tokenInput.metadataCollectionName,
      "family": tokenInput.metadataCollectionFamily
    }}
  

  const [policyConfig, setPolicyConfig] = useState<ICreateTokenPolicyConfig>({ 
    nonUpdatableURI: false,
    guarded: false,
    nonFungible: false,
    hasRoyalty: false,
    collection: false,
  });

  const [guardInput, setGuardInput] = useState({
    uriGuard: accountKeyset.keyset.keys[0],
    burnGuard: accountKeyset.keyset.keys[0],
    mintGuard: accountKeyset.keyset.keys[0],
    saleGuard: accountKeyset.keyset.keys[0],
    transferGuard: accountKeyset.keyset.keys[0]
  });

  const [royaltyInput, setRoyaltyInput] = useState({
    royaltyFungible: "coin",
    royaltyCreator: accountKeyset.account,
    royaltyGuard: accountKeyset.keyset.keys[0],
    royaltyRate: "0.05"
  });

  const [collectionInput, setCollectionInput] = useState({
    collectionId: ""
  });

  const handleRoyaltyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoyaltyInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuardInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollectionInput((prev) => ({ ...prev, [name]: value }));
  };

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: tokenInput.chainId as ChainId,
    sign: createSignWithSpireKey(router, {host: env.URL ?? ''}),
  };

  const [tokenId, setTokenId] = useState<string>("");

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyConfig({
      ...policyConfig,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const imageUrl = await createImageUrl(base64Image); 
    if (!imageUrl) { 
      throw new Error("Error creating image URL");
    }    
    const metadataUrl = await createMetaDataUrl({ ...metadata, image: imageUrl.url})
    if (!metadataUrl) { 
      throw new Error("Error creating metadata URL");
    }    
    const inputs = {...formatInput({...tokenInput, "uri": metadataUrl.url}), 
      policyConfig: policyConfig as ICreateTokenPolicyConfig , 
      policies: getPolicies(policyConfig),
      guards:formatGuardInput(guardInput), 
      royalty: formatRoyaltyInput(royaltyInput), 
      collection:collectionInput, 
      customPolicyData: {},
    };

    if (policyConfig.hasRoyalty && (!royaltyInput.royaltyFungible || !royaltyInput.royaltyCreator || !royaltyInput.royaltyGuard || !royaltyInput.royaltyRate)) {
      alert('Please provide all Royalty inputs');
      setIsFormValid(false);
      return;
    }

    if (policyConfig.collection && (!collectionInput.collectionId)) {
      alert('Please provide all Collection inputs');
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);

    try {
      const tokenIdCreated = await createTokenId({ ...inputs, "networkId": config.networkId, "host": config.host, "policyConfig": policyConfig, "policies": getPolicies(policyConfig) });
      setTokenId(tokenIdCreated);

      const result = await createToken({
        ...inputs, 
        "tokenId": tokenIdCreated as string, 
        },
        { ...config,
          "defaults": { "networkId": config.networkId, meta: { "chainId": inputs.chainId } }
        }).execute();
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event as unknown as FormEvent);
  };

  return (
    <Stack flex={1} flexDirection="column">
      <h1>Create Token</h1>
      <div className={styles.twoColumnRow}>
        <div className={styles.uploadContainer}>
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('fileInput')?.click()}
            style={{ width: '100%' }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded Preview" className={styles.uploadImage} />
            ) : (
              <div>
                <p className={styles.uploadText}>Upload Image</p>
                <p className={styles.uploadText}>Drag/Drop or Select</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.oneColumnRow}>
          <div className={styles.formSection}>
            <div className={styles.verticalForm}>
              <Heading as="h5">Token Information</Heading>
              <br/>
              <TextField label="URI" name="uri" value={tokenInput.uri} onChange={handleTokenInputChange} />
              <TextField label="Precision" name="precision" value={tokenInput.precision} onChange={handleTokenInputChange} />
              <TextField label="Chain" name="chainId" value={tokenInput.chainId} onChange={handleTokenInputChange} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.twoColumnRow}>
        <div className={styles.formSection}>
          <div className={styles.verticalForm}>
            <Heading as="h5">Metadata</Heading>
            <br/>
            <TextField label="Name" name="metadataName" value={tokenInput.metadataName} onChange={handleTokenInputChange} />
            <TextField label="Description" name="metadataDescription" value={tokenInput.metadataDescription} onChange={handleTokenInputChange} />
            <TextField label="Author" name="metadataAuthors" value={tokenInput.metadataAuthors} onChange={handleTokenInputChange} info="(optional)" />
            <TextField label="Collection Name" name="metadataCollectionName" value={tokenInput.metadataCollectionName} onChange={handleTokenInputChange} info="(optional)" />
            <TextField label="Collection Family" name="metadataCollectionFamily" value={tokenInput.metadataCollectionFamily} onChange={handleTokenInputChange} info="(optional)" />
            <TextareaField label="Properties" name="metadataProperties" value={tokenInput.metadataProperties} onChange={handleTokenInputChange} info="(optional)" />
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={styles.verticalForm}>
            <TextareaField  name="metadata" value={ JSON.stringify(metadata, null, 2)} size="lg" className={styles.textareaField} />
          </div>
        </div>
      </div>
      <PolicyForm policyConfig={policyConfig } handleCheckboxChange={handleCheckboxChange} />
      {(policyConfig.guarded || policyConfig.collection || policyConfig.hasRoyalty) && 
      (
        <div className={styles.formSection}>

      <Tabs className={styles.tabsContainer} >
        {policyConfig.guarded ? (
          <TabItem title="Guards" >
            <GuardForm guardInput={guardInput} handleGuardInputChange={handleGuardInputChange} />
          </TabItem>
        ):<TabItem><></></TabItem>}
        {policyConfig.collection ? (
          <TabItem title="Collection">
            <CollectionForm collectionInput={collectionInput} handleCollectionInputChange={handleCollectionInputChange}  />
          </TabItem>
        ):<TabItem><></></TabItem>}
        {policyConfig.hasRoyalty ? (
          <TabItem title="Royalty">
            <RoyaltyForm royaltyInput={royaltyInput} handleRoyaltyInputChange={handleRoyaltyInputChange} />
          </TabItem>
        ):<TabItem><></></TabItem>}
      </Tabs>
      </div>)}
      <div className={styles.buttonRow}>
        <Button type="submit"  onClick={handleButtonClick}>
            Create Token
        </Button>
      </div>
    </Stack>
  );
}

export default function CreateToken() {
  return (
    <CreateTokenComponent />
  );
}