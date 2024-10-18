import * as styles from '@/styles/create-token.css';
import { env } from '@/utils/env';
import { MonoAutoFixHigh } from '@kadena/kode-icons';
import {
  Button,
  Notification,
  NumberField,
  Select,
  SelectItem,
  Stack,
  Text,
  TextareaField,
  TextField,
} from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Import form components
import CollectionForm from '@/components/CollectionForm';

import GenerateURIForm from '@/components/GenerateURIForm';
import GuardForm from '@/components/GuardForm';
import PolicyForm from '@/components/PolicyForm';
import RoyaltyForm from '@/components/RoyaltyForm';

// Import client
import { useAccount } from '@/hooks/account';
import { useTransaction } from '@/hooks/transaction';
import {
  createPrecision,
  formatAccount,
  formatGuardInput,
  formatRoyaltyInput,
  generateSpireKeyGasCapability,
  getPolicies,
} from '@/utils/helper';
import { createSignWithSpireKeySDK } from '@/utils/signWithSpireKey';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import {
  createToken,
  createTokenId,
  ICreateTokenPolicyConfig,
} from '@kadena/client-utils/marmalade';
import {
  CardContentBlock,
  CardFixedContainer,
  CardFooterGroup,
} from '@kadena/kode-ui/patterns';

function CreateTokenComponent() {
  const router = useRouter();
  const { account } = useAccount();
  const { setTransaction } = useTransaction();

  const excluded = '[EXCLUDED]';
  let tokenId = '';

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
    uriGuard: account?.guard,
    burnGuard: account?.guard,
    mintGuard: account?.guard,
    saleGuard: account?.guard,
    transferGuard: account?.guard,
  });

  const [royaltyInput, setRoyaltyInput] = useState({
    royaltyFungible: 'coin',
    royaltyCreator: account?.accountName ?? '',
    royaltyGuard: account?.guard,
    royaltyRate: '0.05',
  });

  useEffect(() => {
    if (!account) return;
    const guard = account.guard;

    setGuardInput({
      uriGuard: guard,
      burnGuard: guard,
      mintGuard: guard,
      saleGuard: guard,
      transferGuard: guard,
    });

    setRoyaltyInput((prev) => ({
      ...prev,
      royaltyCreator: account.accountName,
      royaltyGuard: account.guard,
    }));
  }, [account]);

  const onTransactionSigned = (transaction: IUnsignedCommand | ICommand) => {
    setTransaction(transaction);
    router.push(`/transaction?returnUrl=/mint?tokenId=${tokenId}`);
  };

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: tokenInput.chainId as ChainId,
    sign: createSignWithSpireKeySDK([account], onTransactionSigned),
  };

  const handleTokenInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTokenInput((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrecisionChange = (value: number) => {
    if (Number.isInteger(value) && value >= 0) {
      setTokenInput((prev) => ({
        ...prev,
        precision: value,
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
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
      [name]: checked ? excluded : account?.guard,
    }));
  };

  const handleRoyaltyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoyaltyInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    if (
      policyConfig.hasRoyalty &&
      (!royaltyInput.royaltyFungible ||
        !royaltyInput.royaltyCreator ||
        !royaltyInput.royaltyGuard ||
        !royaltyInput.royaltyRate)
    ) {
      throw new Error('Please provide all Royalty inputs');
    }

    if (policyConfig.collection && !collectionInput.collectionId) {
      throw new Error('Please provide all Collection inputs');
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      if (!account) throw new Error('Connect Spirekey account');

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
          const tokenIdCreated = await createTokenId({
            ...inputs,
            networkId: config.networkId,
            host: config.host,
          });
          tokenId = tokenIdCreated;

          await createToken(
            {
              ...inputs,
              signerPublicKey: account?.devices[0].guard.keys[0],
              tokenId: tokenIdCreated,
            },
            {
              ...config,
              defaults: {
                networkId: config.networkId,
                meta: { chainId: inputs.chainId },
              },
            },
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
      const formData = new FormData();
      const metadataContent = JSON.stringify(metadata);
      const metadataBlob = new Blob([metadataContent], {
        type: 'application/json',
      });
      formData.append(
        'file',
        new File([metadataBlob], 'metadata.json', { type: 'application/json' }),
        'metadata.json',
      );

      const res = await fetch('/api/metadata', {
        method: 'POST',
        body: formData,
      });
      const ipfsHash = await res.text();
      return `ipfs://${ipfsHash}`;
    } catch (e) {
      console.error(e);
      alert('Trouble uploading file');
    }
  };

  const uploadFile = async (fileToUpload: any) => {
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      const ipfsHash = await res.text();
      return `ipfs://${ipfsHash}`;
    } catch (e) {
      console.error(e);
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
      creator: formatAccount(account?.accountName || '', account?.guard),
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
    <div>
      <CardFixedContainer>
        <CardContentBlock
          title="Create Token"
          visual={<MonoAutoFixHigh />}
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>Create a new token</Text>
            </Stack>
          }
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
                value={JSON.stringify(account?.guard)}
                disabled
              />
              <NumberField
                label="Precision"
                value={tokenInput.precision}
                onValueChange={handlePrecisionChange}
              />
              <Select
                label="Chain"
                name="chainId"
                selectedKey={tokenInput.chainId}
                isDisabled
              >
                {Array.from({ length: 20 }, (_, i) => i.toString()).map(
                  (option) => (
                    <SelectItem key={option} textValue={option}>
                      {option}
                    </SelectItem>
                  ),
                )}
              </Select>
            </div>
          </div>
        </CardContentBlock>

        <CardContentBlock
          title="Metadata"
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>
                Select the metadata input that will be stored as the uri
              </Text>
            </Stack>
          }
        >
          <Stack flexDirection="column" gap="md">
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
          </Stack>
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
        </CardContentBlock>

        <CardContentBlock
          title="Policies"
          supportingContent={
            <Stack flexDirection="column" width="100%" gap="md">
              <Text>
                Select the metadata input that will be stored as the uri
              </Text>
            </Stack>
          }
        >
          <PolicyForm handleCheckboxChange={handleCheckboxChange} />
        </CardContentBlock>

        {policyConfig.guarded && (
          <GuardForm
            guardInput={guardInput}
            handleGuardInputChange={handleGuardInputChange}
            handleGuardExcludeChange={handleGuardExcludeChange}
            excluded={excluded}
          />
        )}
        {policyConfig.hasRoyalty && (
          <RoyaltyForm
            royaltyInput={royaltyInput}
            handleRoyaltyInputChange={handleRoyaltyInputChange}
          />
        )}
        {policyConfig.collection && (
          <CollectionForm
            collectionInput={collectionInput}
            handleCollectionInputChange={handleCollectionInputChange}
          />
        )}
        {policyConfig.nonFungible && (
          <CardContentBlock
            title="Non-fungible"
            supportingContent={
              <Stack flexDirection="column" width="100%" gap="md">
                <Text>
                  Enforces that token is non-fungible by setting max-supply to 1
                  and precision to 0
                </Text>
              </Stack>
            }
          >
            No data required
          </CardContentBlock>
        )}
        {policyConfig.nonUpdatableURI && (
          <CardContentBlock
            title="Non-upgradable URI"
            supportingContent={
              <Stack flexDirection="column" width="100%" gap="md">
                <Text>
                  Enforces that token's URI is not updatable. If not selected, a
                  URI guard is required
                </Text>
              </Stack>
            }
          >
            No data required
          </CardContentBlock>
        )}

        {error && (
          <Notification intent="negative" role="status">
            Error: {error}
          </Notification>
        )}

        <CardFooterGroup>
          <Button variant="outlined" onPress={onCancelPress}>
            Cancel
          </Button>
          <Button
            isDisabled={uploading}
            loadingLabel="Creating Token..."
            isLoading={uploading}
            onPress={handleSubmit}
          >
            Create Token
          </Button>
        </CardFooterGroup>
      </CardFixedContainer>
    </div>
  );
}

export default function CreateToken() {
  return <CreateTokenComponent />;
}
