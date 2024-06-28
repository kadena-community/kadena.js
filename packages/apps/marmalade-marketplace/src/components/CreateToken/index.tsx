import React, { FormEvent, useEffect, useState } from 'react';
import { env } from '@/utils/env';
import * as styles from '@/styles/create-token.css';
import { useRouter } from 'next/navigation';
import { Stack, Heading, Tabs, TabItem, Button, Select, TextField, NumberField, SelectItem } from '@kadena/react-ui';

// Import form components
import RoyaltyForm from '@/components/RoyaltyForm';
import GuardForm from '@/components/GuardForm';
import CollectionForm from '@/components/CollectionForm';
import PolicyForm from '@/components/PolicyForm';
import GenerateURIForm from '@/components/GenerateURIForm';

// Import client
import { ChainId, BuiltInPredicate } from '@kadena/client';
import { createTokenId, createToken, ICreateTokenPolicyConfig } from '@kadena/client-utils/marmalade';
import { useAccount } from '@/hooks/account';
import { getPolicies, formatGuardInput, formatRoyaltyInput, createPrecision, formatAccount, generateSpireKeyGasCapability } from '@/utils/helper';
import { createSignWithSpireKey } from '@/utils/signWithSpireKey';
import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';

function CreateTokenComponent() {
  const router = useRouter();
  const { account } = useAccount();
  
  const [walletKey, setWalletKey] = useState<string>('');
  const [walletAccount, setWalletAccount] = useState('');

  useEffect(() => {
    if (account) {
      setWalletKey(account.credentials[0].publicKey);
      setWalletAccount(account.accountName);
    }
  }, [account]);
  
  
  const excluded = "[EXCLUDED]";

  const { transaction, send, preview, poll } = useTransaction();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState('');
  const [error, setError] = useState('');
  const [cid, setCid] = useState('');
  const [uploading, setUploading] = useState(false);

  const [policyConfig, setPolicyConfig] = useState<ICreateTokenPolicyConfig>({
    nonUpdatableURI: false,
    guarded: false,
    nonFungible: false,
    hasRoyalty: false,
    collection: false,
  });

  const [tokenInput, setTokenInput] = useState({
    uri: '',
    tokenId: '',
    precision: 0,
    chainId: '8',
    creatorGuard: '',
    metadataName: '',
    metadataDescription: '',
    metadataCollectionName: '',
    metadataCollectionFamily: '',
    metadataProperties: {},
    metadataAuthors: '',
  });

  const [guardInput, setGuardInput] = useState({
    uriGuard: walletKey,
    burnGuard: walletKey,
    mintGuard: walletKey,
    saleGuard: walletKey,
    transferGuard: walletKey,
  });
  
  const [royaltyInput, setRoyaltyInput] = useState({
    royaltyFungible: 'coin',
    royaltyCreator: walletAccount,
    royaltyGuard: walletKey,
    royaltyRate: '0.05',
  });

  useEffect(() => {
    if (account) {
      setGuardInput({
        uriGuard: account.credentials[0].publicKey,
        burnGuard: account.credentials[0].publicKey,
        mintGuard: account.credentials[0].publicKey,
        saleGuard: account.credentials[0].publicKey,
        transferGuard: account.credentials[0].publicKey,
      });

      setRoyaltyInput(prev => ({
        ...prev,
        royaltyCreator: account.accountName,
        royaltyGuard: account.credentials[0].publicKey,
      }));
    }
  }, [account]);

  const [collectionInput, setCollectionInput] = useState({
    collectionId: '',
  });
  const [tokenId, setTokenId] = useState<string>('');


  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: tokenInput.chainId as ChainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };

  const toggle = () => {
    setIsOpen(!isOpen);
    setTokenInput({ ...tokenInput, uri: '' });
  };

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;  
    setTokenInput((prev) => ({ ...prev, [name]: value}));
  };

  const handlePrecisionChange = (value: number) => {
    if (Number.isInteger(value) && value >= 0) {
      setTokenInput((prev) => ({
        ...prev, 
        precision: value,
      }));
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'nonFungible' && checked) {
      setTokenInput({ ...tokenInput, precision: 0 });
    }
    setPolicyConfig((prev) => ({ ...prev, [name]: checked }));
  };

  const handleGuardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuardInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardExcludeChange = (name: string, checked: boolean) => {
    setGuardInput((prevState) => ({
      ...prevState,
      [name]: checked ? excluded : '',
    }));
  };

  const handleRoyaltyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoyaltyInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollectionInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {

      if (!account) throw new Error("Connect Spirekey account")
      if (isOpen) {
        const imageUrl = await uploadFile(file);
        if (!imageUrl) throw new Error('Error creating image URL');
        const metadataUrl = await uploadMetadata({...metadata, image: imageUrl});
        if (!metadataUrl) throw new Error('Error creating metadata URL');
        setTokenInput((prev) => ({ ...prev, uri: metadataUrl }));
      }

      if (policyConfig.hasRoyalty && (!royaltyInput.royaltyFungible || !royaltyInput.royaltyCreator || !royaltyInput.royaltyGuard || !royaltyInput.royaltyRate)) {
        throw new Error('Please provide all Royalty inputs');
      }

      if (policyConfig.collection && !collectionInput.collectionId) {
        throw new Error('Please provide all Collection inputs');
      }

      const inputs = {
        ...formatInput(tokenInput),
        policyConfig,
        policies: getPolicies(policyConfig),
        guards: formatGuardInput(guardInput),
        royalty: formatRoyaltyInput(royaltyInput),
        collection: collectionInput,
      };
      
      const tokenIdCreated = await createTokenId({ ...inputs, networkId: config.networkId, host: config.host });
      setTokenId(tokenIdCreated);

      await createToken(
        {
          ...inputs,
          tokenId: tokenIdCreated,
          capabilities: generateSpireKeyGasCapability(walletAccount)
        },
        {
          ...config,
          defaults: { networkId: config.networkId, meta: { chainId: inputs.chainId } },
        }
      ).execute();
    } catch (e) {
      setError(JSON.stringify(e.message));
    }
  };

  const uploadMetadata = async (metadata: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      const metadataContent = JSON.stringify(metadata);
      const metadataBlob = new Blob([metadataContent], { type: 'application/json' });
      formData.append('file', new File([metadataBlob], 'metadata.json', { type: 'application/json' }), 'metadata.json');

      const res = await fetch('/api/metadata', {
        method: 'POST',
        body: formData,
      });
      const ipfsHash = await res.text();
      setUploading(false);
      return  `https://${ipfsHash}.ipfs.nftstorage.link`;
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const uploadFile = async (fileToUpload: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      const ipfsHash = await res.text();
      setCid(ipfsHash);
      setUploading(false);
      return `https://${ipfsHash}.ipfs.nftstorage.link`;
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const formatInput = (input: typeof tokenInput) => {
    return {
      ...input,
      chainId: input.chainId as ChainId,
      precision: createPrecision(input.precision),
      creator: formatAccount(walletAccount, walletKey),
    };
  };

  const metadata = {
    name: tokenInput.metadataName,
    description: tokenInput.metadataDescription,
    image: '',
    authors: [tokenInput.metadataAuthors],
    properties: tokenInput.metadataProperties,
    collection: {
      name: tokenInput.metadataCollectionName,
      family: tokenInput.metadataCollectionFamily,
    },
  };

  return (
    <>
      {!transaction ? (
        <Stack flex={1} flexDirection="column">
          <div className={styles.twoColumnRow}>
            <div className={styles.oneColumnRow}>
              <div className={styles.formSection}>
                <div className={styles.verticalForm}>
                  <Heading as="h5" className={styles.formHeading}>Token Information</Heading>
                  <br />
                  <TextField
                    label="URI"
                    name="uri"
                    value={tokenInput.uri}
                    onChange={handleTokenInputChange}
                    isDisabled={isOpen}
                    endAddon={
                      <div>
                        <input
                          id="uriCheckbox"
                          type="checkbox"
                          checked={isOpen}
                          onChange={toggle}
                        />
                        <label htmlFor="uriCheckbox" style={{ color: 'black' }}>Don't have URI</label>
                      </div>
                    }
                  />
                  <Select label="Chain ID" name="chainId" selectedKey={tokenInput.chainId} isDisabled>
                    {Array.from({ length: 20 }, (_, i) => i.toString()).map(option => (
                      <SelectItem key={option} textValue={option}>{option}</SelectItem>
                    ))}
                  </Select>
                  <NumberField
                    label="Precision"
                    value={tokenInput.precision}
                    onValueChange={handlePrecisionChange}
                  />
                </div>
              </div>
            </div>
            <PolicyForm policyConfig={policyConfig} handleCheckboxChange={handleCheckboxChange} />
          </div>
          {(policyConfig.guarded || policyConfig.collection || policyConfig.hasRoyalty) && (
            <div className={styles.formSection}>
              <Heading as="h5" className={styles.formHeading}>Policy Data</Heading>
              <br />
              <Tabs className={styles.tabsContainer}>
                <TabItem title="Guards">
                  <GuardForm guardInput={guardInput} handleGuardInputChange={handleGuardInputChange} handleGuardExcludeChange={handleGuardExcludeChange} excluded={excluded} />
                </TabItem>
                <TabItem title="Royalty">
                  <RoyaltyForm royaltyInput={royaltyInput} handleRoyaltyInputChange={handleRoyaltyInputChange} />
                </TabItem>
                <TabItem title="Collection">
                  <CollectionForm collectionInput={collectionInput} handleCollectionInputChange={handleCollectionInputChange} />
                </TabItem>
              </Tabs>
            </div>
          )}
          {isOpen && (
            <GenerateURIForm
              handleTokenInputChange={handleTokenInputChange}
              tokenInput={tokenInput}
              setError={setError}
              file={file}
              setFile={setFile}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              base64Image={base64Image}
              setBase64Image={setBase64Image}
            />
          )}
          <div className={styles.buttonRow}>
            <Button type="submit" onClick={handleSubmit}>
              Create Token
            </Button>
          </div>
          {error && (
            <div className={styles.errorBox}>
              <p>Error: {error}</p>
            </div>
          )}
        </Stack>
      ) : (
        <SendTransaction send={send} preview={preview} poll={poll} transaction={transaction} />
      )}
    </>
  );
}

export default function CreateToken() {
  return <CreateTokenComponent />;
}
