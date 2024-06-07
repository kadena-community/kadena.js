
import React, { useState, FormEvent } from 'react';
import { Heading, TextField, TextareaField, Button, Tabs, TabItem, Stack, Checkbox } from '@kadena/react-ui';
import { createTokenId, createToken, createCollection, createCollectionId } from "@kadena/client-utils/marmalade";
import { ICreateTokenPolicyConfig } from "@kadena/client-utils/marmalade/config";
import { PactNumber } from "@kadena/pactjs";
import { ChainId, BuiltInPredicate, createSignWithKeypair } from "@kadena/client";
import * as styles from '@/styles/create-token.css';
import Layout from '@/components/Layout';
import { env } from '@/utils/env';

const sender00Account =     {
  publicKey:
    '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  secretKey:
    '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
}

export default function CreateToken() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const [policyConfig, setPolicyConfig] = useState<ICreateTokenPolicyConfig>({
    customPolicies: false,
    updatableURI: false,
    guarded: false,
    nonFungible: false,
    hasRoyalty: false,
    collection: false,
  });

  const getPolicies = (policyConfig: ICreateTokenPolicyConfig) => {
    const policyMap = {
      updatableURI: "marmalade-v2.non-updatable-uri-policy-v1",
      customPolicies: "",
      guarded: "marmalade-v2.guard-policy-v1",
      nonFungible: "marmalade-v2.non-fungible-policy-v1",
      hasRoyalty: "marmalade-v2.royalty-policy-v1",
      collection: "marmalade-v2.collection-policy-v1",
    };

    return Object.entries(policyConfig)
      .filter(([key, value]) => value && policyMap[key])
      .map(([key]) => policyMap[key]);
  };

  const createPrecision = (n: string) => {
    return new PactNumber(n).toPactInteger();
  };

  const createKeyset = (key: string) => {
    return { "keyset": {
        "keys": [key],
        "pred": "keys-all" as BuiltInPredicate
      }}
  };

  const createRoyaltyInfo = ( tokenInput: { royaltyFungible: string; royaltyCreator: string; royaltyGuard: string; royaltyRate: number }) => {
    return {
      fungible: {
        refName: {
          name: royaltyInput.royaltyFungible,
          namespace: null,
        },
        refSpec: [
          {
            name: "fungible-v2",
            namespace: null,
          },
        ],
      },
      creator: {
        account: royaltyInput.royaltyCreator,
        keyset: {
          keys: [royaltyInput.royaltyGuard],
          pred: 'keys-all',
        },
      },
      royaltyRate: {"decimal": royaltyInput.royaltyRate},
    };
  };

  const createGuardInfo = (guardInput: { uriGuard: string; burnGuard: string; mintGuard: string; saleGuard: string; transferGuard: string }) => {

    return {
      uriGuard: createKeyset(guardInput.uriGuard),
      burnGuard: createKeyset(guardInput.burnGuard),
      mintGuard: createKeyset(guardInput.mintGuard),
      saleGuard: createKeyset(guardInput.saleGuard),
      transferGuard: createKeyset(guardInput.transferGuard),
    };
  };

  const [tokenInput, setTokenInput] = useState({
    uri: "",
    tokenId: "",
    precision: "0",
    chainId: "0",
    creatorGuard: "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
  });

  const [guardInput, setGuardInput] = useState({
    uriGuard: tokenInput.creatorGuard,
    burnGuard: tokenInput.creatorGuard,
    mintGuard: tokenInput.creatorGuard,
    saleGuard: tokenInput.creatorGuard,
    transferGuard: tokenInput.creatorGuard
  });

  const [royaltyInput, setRoyaltyInput] = useState({
    royaltyFungible: "coin",
    royaltyCreator: "k:" + tokenInput.creatorGuard,
    royaltyGuard: tokenInput.creatorGuard,
    royaltyRate: 0.05
  });

  const [collectionInput, setCollectionInput] = useState({
    collectionId: ""
  });

  const [createCollectionInput, setCreateCollectionInput] = useState({
    collectionName: "",
    collectionOperatorGuard: tokenInput.creatorGuard,
    collectionSize: 0,
    collectionChainId: "0" as ChainId
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

  const handleCreateCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateCollectionInput((prev) => ({ ...prev, [name]: value }));
  };

  const formatInput = (input: typeof tokenInput) => {
    return {
      ...input,
      chainId: input.chainId as ChainId,
      precision: createPrecision(input.precision),
      creator: createKeyset(input.creatorGuard)
    };
  };

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: tokenInput.chainId as ChainId,
    sign: createSignWithKeypair([sender00Account]),
  };

  const [tokenId, setTokenId] = useState<string>("");
  const [response, setResponse] = useState<any>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyConfig({
      ...policyConfig,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenInput((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const inputs = formatInput(tokenInput);

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
      setIsLoading(true)
      const result = await createToken({
        ...inputs, "policyConfig": policyConfig, "policies": getPolicies(policyConfig),  "tokenId": tokenIdCreated as string, guards:createGuardInfo(guardInput), royalty: createRoyaltyInfo(royaltyInput), collection:collectionInput,
        },
        { ...config,
          "defaults": { "networkId": config.networkId, meta: { "chainId": inputs.chainId } }
        }).execute();
      setTokenId(tokenIdCreated);
      setResponse(result);
      setIsLoading(true)
    } catch (error) {
      console.log(error);
      setResponse({ success: false, message: error.message });
    }
  };



  const handleSubmitCollection = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const collectionId = await createCollectionId({ "collectionName":createCollectionInput.collectionName, "operator":createKeyset(createCollectionInput.collectionOperatorGuard), "chainId": createCollectionInput.collectionChainId as ChainId ,"networkId": config.networkId, "host": config.host,});

      const result = await createCollection(
        { "name":createCollectionInput.collectionName as string, "id": collectionId as string, "operator": createKeyset(createCollectionInput.collectionOperatorGuard), "size": {"int": createCollectionInput.collectionSize.toString()}, "chainId": createCollectionInput.collectionChainId},
        { ...config,
          "defaults": { "networkId": config.networkId, meta: { "chainId": createCollectionInput.collectionChainId } }
        },
        ).execute();
      setResponse(result);
    } catch (error) {
      console.log(error);
      setResponse({ success: false, message: error.message });
    }
  };

  return (
    <Layout>
      <Heading>
        <title>Create Token</title>
      </Heading>
      <Stack flex={1} flexDirection="column">
        <h1>Create Token</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.twoColumnRow}>
            <div
              className={styles.formSection}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Uploaded Preview" style={{ maxWidth: '100%' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ margin: 0 }}>Upload Image</p>
                  <p style={{ margin: 0 }}>Drag/Drop or Select</p>
                </div>
              )}
            </div>
            <div className={styles.formSection}>
              <div className={styles.verticalForm}>
                <TextField label="URI" name="uri" value={tokenInput.uri} onChange={handleTokenInputChange} />
                <TextField label="Precision" name="precision" value={tokenInput.precision.toString()} onChange={handleTokenInputChange} />
                <TextField label="Chain" name="chainId" value={tokenInput.chainId} onChange={handleTokenInputChange} />
                <TextField label="Creator Key (to be replaced by wallet)" name="creatorKey" value={tokenInput.creatorGuard} onChange={handleTokenInputChange} />
              </div>
            </div>
          </div>

          <div className={styles.oneColumnRow}>
            <div className={styles.formSection}>
              <TextareaField label="Metadata" name="metadata" />
            </div>
          </div>

          <div className={styles.oneColumnRow}>
            <div className={styles.formSection}>
              <div className={styles.verticalForm}>
                <div className={styles.checkboxRow}>
                  <div className={styles.firstColumn}>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="customPolicies" name="customPolicies" checked={policyConfig.customPolicies} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="customPolicies">Custom Policies</label>
                    </div>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="updatableURI" name="updatableURI" checked={policyConfig.updatableURI} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="updatableURI">Updatable URI</label>
                    </div>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="guarded" name="guarded" checked={policyConfig.guarded} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="guarded">Guarded</label>
                    </div>
                  </div>
                  <div className={styles.secondColumn}>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="nonFungible" name="nonFungible" checked={policyConfig.nonFungible} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="nonFungible">Non Fungible</label>
                    </div>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="hasRoyalty" name="hasRoyalty" checked={policyConfig.hasRoyalty} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="hasRoyalty">Has Royalty</label>
                    </div>
                    <div className={styles.checkboxContainer}>
                      <input className={styles.checkboxInput} type="checkbox" id="collection" name="collection" checked={policyConfig.collection} onChange={handleCheckboxChange} />
                      <label className={styles.checkboxLabel} htmlFor="collection">Collection</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(policyConfig.guarded || policyConfig.collection || policyConfig.hasRoyalty || policyConfig.customPolicies) && (
            <div className={styles.oneColumnRow}>
              <div className={styles.formSection}>
                <Tabs>
                  {policyConfig.guarded && (
                    <TabItem title="Guards">
                      <div className={styles.verticalForm}>
                        <TextField label="URI Guard" name="uriGuard" value={guardInput.uriGuard} onChange={handleGuardInputChange} />
                        <TextField label="Mint Guard" name="mintGuard" value={guardInput.mintGuard} onChange={handleGuardInputChange} />
                        <TextField label="Burn Guard" name="burnGuard" value={guardInput.burnGuard} onChange={handleGuardInputChange} />
                        <TextField label="Sale Guard" name="saleGuard" value={guardInput.saleGuard} onChange={handleGuardInputChange} />
                        <TextField label="Transfer Guard" name="transferGuard" value={guardInput.transferGuard} onChange={handleGuardInputChange} />
                      </div>
                    </TabItem>
                  )}
                  {policyConfig.collection && (
                    <TabItem title="Collection">
                      <div className={styles.verticalForm}>
                        <TextField label="Collection ID" name="collectionId" value={collectionInput.collectionId} onChange={handleCollectionInputChange}/>
                      </div>
                    </TabItem>
                  )}
                  {policyConfig.hasRoyalty && (
                    <TabItem title="Royalty">
                      <div className={styles.verticalForm}>
                        <TextField label="Royalty Fungible" name="royaltyFungible" value={royaltyInput.royaltyFungible} onChange={handleRoyaltyInputChange} disabled />
                        <TextField label="Royalty Creator" name="royaltyCreator" value={royaltyInput.royaltyCreator} onChange={handleRoyaltyInputChange} />
                        <TextField label="Royalty Guard" name="royaltyGuard" value={royaltyInput.royaltyGuard} onChange={handleRoyaltyInputChange} />
                        <TextField label="Royalty Rate" name="royaltyRate" value={royaltyInput.royaltyRate} onChange={handleRoyaltyInputChange} />
                      </div>
                    </TabItem>
                  )}
                  {policyConfig.customPolicies && (
                    <TabItem title="Custom Policies">
                      <div className={styles.verticalForm}>
                        <TextField label="Custom Policy Name" name="customPolicyName" value=""  />
                        <TextareaField label="Custom Policy Data" name="customPolicyData" />
                      </div>
                    </TabItem>
                  )}
                </Tabs>
              </div>
            </div>
          )}
            <div className={styles.buttonRow}>
            <Button type="submit" isLoading={isLoading}>Create Token</Button>
          </div>
        </form>
        {policyConfig.collection && (
          <div className={styles.oneColumnRow}>
            <div className={styles.formSection}>
            <form onSubmit={handleSubmitCollection}>
              <TextField label="Collection Name" name="collectionName" value={createCollectionInput.collectionName} onChange={handleCreateCollectionInputChange}  />
              <TextField label="Collection Operator Guard" name="collectionOperatorGuard" value={createCollectionInput.collectionOperatorGuard} onChange={handleCreateCollectionInputChange} />
              <TextField label="Collection Size" name="collectionSize" value={createCollectionInput.collectionSize} onChange={handleCreateCollectionInputChange} />
              <TextField label="Collection Chain Id" name="collectionChainId" value={createCollectionInput.collectionChainId} onChange={handleCreateCollectionInputChange} />
              <Button type="submit">Create Collection</Button>
            </form>
            </div>
          </div>
        )}
        {response && (
          <div>
            {response.success ? (
              <p>Token Created: {tokenId}</p>
            ) : (
              <p>Error: {response.message}</p>
            )}
          </div>
        )}
      </Stack>
    </Layout>
  );
}
