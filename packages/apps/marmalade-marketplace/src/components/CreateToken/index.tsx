import React, { FormEvent, useEffect, useState } from 'react';
import { env } from '@/utils/env';
import * as styles from '@/styles/create-token.css';
import { useRouter } from 'next/navigation';
import { Stack, Button, Select, TextField, TextareaField, NumberField, SelectItem } from '@kadena/kode-ui';
import { MonoAutoFixHigh } from '@kadena/kode-icons';

// Import form components
import RoyaltyForm from '@/components/RoyaltyForm';
import GuardForm from '@/components/GuardForm';
import CollectionForm from '@/components/CollectionForm';
import PolicyForm from '@/components/PolicyForm';
import GenerateURIForm from '@/components/GenerateURIForm';
import CrudCard from '@/components/CrudCard';

// Import client
import { ChainId } from '@kadena/client';
import { createTokenId, createToken, ICreateTokenPolicyConfig } from '@kadena/client-utils/marmalade';
import { useAccount } from '@/hooks/account';
import { getPolicies, formatGuardInput, formatRoyaltyInput, createPrecision, formatAccount, generateSpireKeyGasCapability } from '@/utils/helper';
import { createSignWithSpireKey } from '@/utils/signWithSpireKey';
import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';

function CreateTokenComponent() {
  const router = useRouter();
  const { account, webauthnAccount } = useAccount();
  const { transaction, send, preview, poll } = useTransaction();

  const excluded = "[EXCLUDED]";

  const [walletKey, setWalletKey] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();
  const [base64Image, setBase64Image] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [collectionInput, setCollectionInput] = useState({ collectionId: '' });

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
    royaltyCreator: webauthnAccount?.account ?? '',
    royaltyGuard: walletKey,
    royaltyRate: '0.05',
  });

  useEffect(() => {
    if (webauthnAccount) {
      const key = webauthnAccount.guard.keys[0];

      setGuardInput({
        uriGuard: key,
        burnGuard: key,
        mintGuard: key,
        saleGuard: key,
        transferGuard: key,
      });

      setRoyaltyInput(prev => ({
        ...prev,
        royaltyCreator: webauthnAccount.account,
        royaltyGuard: key
      }));
      setWalletKey(key);
    }
  }, [webauthnAccount]);

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: tokenInput.chainId as ChainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };

  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleCheckboxChange = (name:string, checked:boolean) => {
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
      [name]: checked ? excluded : walletKey,
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

  const validateInputs = () => {
    if (!file) {
      throw new Error('Please select a file');
    }

    if (!tokenInput.metadataName || !tokenInput.metadataDescription) {
      throw new Error('Please provide metadata name and description');
    }

    if (policyConfig.hasRoyalty && (!royaltyInput.royaltyFungible || !royaltyInput.royaltyCreator || !royaltyInput.royaltyGuard || !royaltyInput.royaltyRate)) {
      throw new Error('Please provide all Royalty inputs');
    }

    if (policyConfig.collection && !collectionInput.collectionId) {
      throw new Error('Please provide all Collection inputs');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setUploading(true);
    try {
      if (!account) throw new Error("Connect Spirekey account");

      let updatedTokenInput = { ...tokenInput };

      const createInputs = () => ({
        ...formatInput(updatedTokenInput),
        policyConfig,
        policies: getPolicies(policyConfig),
        guards: formatGuardInput(guardInput),
        royalty: formatRoyaltyInput(royaltyInput),
        collection: collectionInput,
      });

      const processTokenCreation = async (inputs: any) => {
        try {
          const tokenIdCreated = await createTokenId({ ...inputs, networkId: config.networkId, host: config.host });
          // setTokenId(tokenIdCreated);

          await createToken(
            {
              ...inputs,
              tokenId: tokenIdCreated,
              capabilities: generateSpireKeyGasCapability(account.accountName ?? ''),
            },
            {
              ...config,
              defaults: { networkId: config.networkId, meta: { chainId: inputs.chainId } },
            }
          ).execute();
        } catch (error) {
          console.error(error);
          // Workaround for an incorrect signing error that is thrown by client-utils, transaction
          // signing isn't happening yet at this point
          if (!error.message.includes('Signing failed')) {
            setError(JSON.stringify(error.message));
          }
        }
      };

      const handleFileUpload = () => {
        return uploadFile(file)
          .then((imageUrl) => {
            if (!imageUrl) throw new Error('Error creating image URL');
            return uploadMetadata({ ...metadata, image: imageUrl });
          })
          .then((metadataUrl) => {
            if (!metadataUrl) throw new Error('Error creating metadata URL');
            updatedTokenInput = { ...updatedTokenInput, uri: metadataUrl };

            setTokenInput((prev) => ({ ...prev, uri: metadataUrl }));
          });
      };

    validateInputs();
    await handleFileUpload();
    const inputs = createInputs();
    await processTokenCreation(inputs);
    setUploading(false);

    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error.message));
      setUploading(false);
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
      return  `ipfs://${ipfsHash}`;
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
      setUploading(false);
      return `ipfs://${ipfsHash}`;
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const onCancelPress = () => {
    router.back();
  };

  const formatInput = (input: typeof tokenInput) => {
    return {
      ...input,
      chainId: input.chainId as ChainId,
      precision: createPrecision(input.precision),
      creator: formatAccount(account?.accountName || '', account?.credentials[0].publicKey || ''),
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
      <div>
        <Stack flex={1} flexDirection="column"  className={styles.container}>
          <CrudCard
            headingSize="h3"
            titleIcon={<MonoAutoFixHigh />}
            title="Create Token"
            description={[
              "Create a new token",
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
              "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
              "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"
            ]}
          >
            <div>
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
              <div className={styles.formContainer}>
                <TextField
                  label="Creation Guard"
                  name="CreationGuard"
                  value={walletKey}
                  disabled
                />
                <NumberField
                  label="Precision"
                  value={tokenInput.precision}
                  onValueChange={handlePrecisionChange}
                />
                <Select label="Chain" name="chainId" selectedKey={tokenInput.chainId} isDisabled>
                  {Array.from({ length: 20 }, (_, i) => i.toString()).map(option => (
                    <SelectItem key={option} textValue={option}>{option}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </CrudCard>
          <CrudCard
              title="Metadata"
              description={["Select the metadata input that will be stored as the uri"]}
            >
            <div className={styles.formContainer}>
              <TextField
                label="Name"
                name="metadataName"
                value={tokenInput.metadataName as string}
                onChange={handleTokenInputChange}
              />
              <TextareaField
                label="Description"
                name="metadataDescription"
                value={tokenInput.metadataDescription as string}
                onChange={handleTokenInputChange}
              />
            </div>
            {/* <TextField
              label="Author"
              name="metadataAuthors"
              value={tokenInput.metadataAuthors as string}
              onChange={handleTokenInputChange}
              info="(optional)"
            />
            <TextField
              label="Collection Name"
              name="metadataCollectionName"
              value={tokenInput.metadataCollectionName as string}
              onChange={handleTokenInputChange}
              info="(optional)"
            />
            <TextField
              label="Collection Family"
              name="metadataCollectionFamily"
              value={tokenInput.metadataCollectionFamily as string}
              onChange={handleTokenInputChange}
              info="(optional)"
            /> */}
          </CrudCard>
          <CrudCard
              title="Policies"
              description={["Select the metadata input that will be stored as the uri"]}
            >
            <PolicyForm handleCheckboxChange={handleCheckboxChange} />
          </CrudCard>
          {(policyConfig.guarded) && <GuardForm guardInput={guardInput} handleGuardInputChange={handleGuardInputChange} handleGuardExcludeChange={handleGuardExcludeChange} excluded={excluded} />}
          {policyConfig.hasRoyalty && <RoyaltyForm royaltyInput={royaltyInput} handleRoyaltyInputChange={handleRoyaltyInputChange} /> }
          {policyConfig.collection && <CollectionForm collectionInput={collectionInput} handleCollectionInputChange={handleCollectionInputChange} /> }
          {policyConfig.nonFungible && (<CrudCard
            title="Non-fungible"
            description={[
              "Enforces that token is non-fungible by setting max-supply to 1 and precision to 0"
            ]}
          >
            No data required
          </CrudCard>)}
          {policyConfig.nonUpdatableURI && (<CrudCard
            title="Non-upgradable URI"
            description={[
              "Enforces that token's URI is not updatable. If not selected, a URI guard is required"
            ]}
          >
            No data required
          </CrudCard>)}

          {error && (
            <div className={styles.errorBox}>
              <p>Error: {error}</p>
            </div>
          )}
        </Stack>
        <div className={styles.buttonRow}>
          <Button variant="outlined" onPress={onCancelPress}>
            Cancel
          </Button>
          <Button isDisabled={uploading}  loadingLabel="Creating Token..." isLoading={uploading} type="submit" onClick={handleSubmit}>
            Create Token
          </Button>
        </div>
      </div>
      ) : (
        <SendTransaction send={send} preview={preview} poll={poll} transaction={transaction} />
      )}
    </>
  );
}

export default function CreateToken() {
  return <CreateTokenComponent />;
}