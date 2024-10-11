import { uploadImageString } from '@/pages/api/uploadimage';
import { uploadMeta } from '@/pages/api/uploadmeta';
import type { ChainId } from '@kadena/client';
import {
  Pact,
  createSignWithChainweaver,
  isSignedTransaction,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import dotenv from 'dotenv';
import { getClient } from '../utils/client';
import { createManifest } from '../utils/createManifest';
import { createHashData } from '../utils/upload';

dotenv.config();

console.log(process.env.NEXT_PUBLIC_PINATA_DOMAIN);

// This account will be used to create the event, must be added to the keyset on testnet. Ask Jermaine
/* Often used keys:
Ghislain: dde39b7430db47ea354ec4b895535b58466c4c47ee620e44bce48f7648a4cc59
Steven: 1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f
*/
const creatorPublicKey =
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f';

// This account will be used to send the creation tx, must be different from the creatorPublicKey
/*
Often used keys:
Ghislain: f896955bc5ad89e40512ebe8cb4e61b3bc0c7205daf67c1bd648924c203c61c5
Steven: 805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f
*/
const senderPubKey =
  'db601702162a84e6561d4cd6011c420b63c65214151cf4c40aeaf526abc3a5f9';
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = process.env.NEXT_PUBLIC_CONNECTION_COLLECTIONID ?? '';

const eventName = 'Welcome Kadenian!';
const startTime = Math.round(new Date(2024, 9, 11, 10, 0).getTime() / 1000);
const endTime = Math.round(new Date(2199, 5, 15, 23, 15).getTime() / 1000);
const bgColor = '#0F1D2D';

console.log({
  startime: new Date(startTime * 1000),
  endtime: new Date(endTime * 1000),
});

const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAANIUlEQVR4nOzX/ffXdX3H8b7jq8yrVQjuIubFlNShiSaT3NTIYIrXF50KLWc45762EzUXnDQLJ5u6I2rOjcXUcyoWx9mxTrTJREwuFqkzNoYbQSyMa3GjwAwJ3F/xOKdzHrfbH/B4/fL5vO/nOfjart98S9LVaxZF9884ZH90/+mlF0T3Jz24I7o/8ZHl0f3TJtwe3T//uSuj+6NHXhXdn3DJWdH9h248Obq/9aZbo/uTv/NEdP/7150Z3f/uTVOj+2e+OiW6/0vRdQB+YQkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFKDB954OvrAKW//SnR/3a4R0f0vfXxbdH/qkrHR/Ys+vCa6v3r6UHR/6G3vi+4/+9+/G91/YtuY6P7jN+yP7h8/Ynt0/5y33hzdn33Pluj+xf/xWnT/Hx6/I7rvAgAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASg189/R/jT5wyI2nRPfHb/l6dP8vxy2K7q9+YFR0f8Gd66L7t94/K7r/5RVjo/vnLXg0uv+ZMRdH9zec8PvR/ZHf+Ovo/oHr3ojuf2/FPdH9bcMOi+5/9t+viO67AABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgNLnhsdfeDnf/xqdP/lYYPR/a0bn4juv//OI6L7P5l+YnT/hp37o/ur3jkxun/Rj/8uur9r57XR/U0vrY7u3777muj+yDm7o/uX/PLh0f2NH3oqun/HlHui+y4AgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKDUwNnHHBx94AsnnRvdP/maj0b3Zxz2O9H9D298MLr/63/11uj++Qctju7/fPP46P6llz0c3b9jaH50/7Prvxnd3757KLp/6gfGRPeP/FL2+/N7D9wc3d+x8E+j+y4AgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKDUwKyhqdEH9l24Obr/8HFvRvdXLc42cva3D43ujzrxg9H93e85Prp/2Unrovub9/5ndP/d0w5E9696/a7o/iMbvhbdn7F7X3R/7onHRfffP+n16P6Sl2ZE910AAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAECpgSWHrY0+8Mk7x0T3D7n436L7E771WHR/1Glbo/sjvn5pdH/uuvdG9+d96ujo/s7xj0b3l748Prp/zt//WXT/hfNHR/cnXDc8uv+zV46M7t/9X/uj+0+u/Vx03wUAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQauP6ZPdEH5h25Irq/8vmHovszP3l1dP+VA+dG9y8bNyq6P+qfz4zuP/or/xjdP+EdN0b3ty36SXR/4Y+WRPdnv/Z0dP/J5R+M7i8YeXx0f8Rt74ruf+bBidF9FwBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUGpg/c0nRB/Y+s4N0f1f/YMjo/sPHPpMdH/fGQdF98+6/dro/vw/+lx0/6Dhe6P7g3PeEd3/k9vGRfdHnTYtun/v4XdH96//4fej+9dMOia6v/LK86L718z5WXTfBQBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBp47/F3Rx+48OivRfcvnXpQdP8tFy2Nzj9101PR/e1vjozuf+rsBdH90ft/Gt2/b+EPo/s3PnVodP+na6ZE91fe8oXo/qf/cFl0f8Lgluj+SZfNie5fvWdmdN8FAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUGlz8yF9EH/jBES9E9/dumxLdP3HF9uj+pIM/Ed2/dfG06P6mNSui+5N3TY3un3L1wdH9xVvuje6vHRwX3R/xkWXR/VW/NjK6/09rPx/d3/TiBdH9I4aOie67AABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgNvf+J90Qemf3FYdH/aTedE9x9admx0f9zuT0f3R+26Krq/Z/Rd0f3FwzdE94dvujW6v2/i5uj+b33ikej+5789Jrr/LzveFt1/6W+eie6Pf/yr0f0f7PhodN8FAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUGpi18HvRB24ZNhTdnztvILr/5+d+KLp//owfR/fnvn55dP+uL54a3T98/pXR/ZN/Y1h0f+bYydH9Hf+7KLp/6Nwd0f2Prdsa3Z+28djo/s2Xz4ruzx76RnTfBQBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBpY+eJx0QeuH3tfdH/7bYdE95fNODi6/+zH3hPdn3P52dH9Owb+J7r/4umrovuLTvhydP+Kmd+J7r/5gfXR/YGXL4zu/98ZV0X3Pz4/+/8dOzz7+zzqsK9G910AAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAECpgXfv2x994F3zLoruH/XNs6P7j13ybHT/uQnPR/ePu29hdH/vecOj+1tnr4ruf2T+DdH9eUt3RvdnnXt0dP/+5VOi+0ddkv3+fGvYxOj+nr89K7o/8oUN0X0XAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQavCK5ZOjD/z26n3R/dNP/VF0f91jX4nuT7r24ej+ikfXR/fvvGBmdP/JBWOj+ysOrIzuP7bz3uj+G1tvie4fO/mV6P7cU6dH96c/vyW6f/3mp6P79096NbrvAgAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASv1/AAAA//9miYTy/WGvWgAAAABJRU5ErkJggg==';

const kadenaClient = getClient(process.env.NEXT_PUBLIC_CHAINWEBAPIURL ?? '');

const createEventId = async () => {
  const transaction = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event-id "${eventName}" ${startTime} ${endTime}
)`,
    )
    .setNetworkId(process.env.NEXT_PUBLIC_NETWORKID ?? '')
    .setMeta({
      chainId: process.env.NEXT_PUBLIC_CHAINID as ChainId,
    })
    .createTransaction();

  const result = await kadenaClient.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.result.status === 'success'
    ? (result.result.data as string)
    : null;
};

const createEvent = async () => {
  const eventId = await createEventId();

  const proofOfUs = {
    eventId,
    type: eventType,
    title: eventName,
    mintStatus: 'init',
    backgroundColor: bgColor,
    status: 3,
    date: startTime * 1000,
  };

  const imageDataResult = await uploadImageString(imageBase64Str);
  console.log({ imageDataResult });
  const imageData = createHashData(imageDataResult);
  console.log({ imageData });

  if (!imageData) {
    console.log('ERROR!  no imagedata');
    return;
  }

  // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
  const manifest = await createManifest(proofOfUs, [], imageData.url);
  const metadataResult = await uploadMeta(manifest);

  const metadata = createHashData(metadataResult);

  if (!metadata) {
    console.log('ERROR no metadata');
    return;
  }

  const unsignedTx = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event
            "${collectionId}" "${eventName}"
            "${metadata.url}"
            ${startTime}
            ${endTime}
            )`,
    )
    .addData('collection_id', collectionId)
    .addData('event_id', `${eventId}`)
    .addData('creator-guard', {
      pred: 'keys-any',
      keys: [creatorPublicKey],
    })
    .setNetworkId(process.env.NEXT_PUBLIC_NETWORKID ?? '')
    .setMeta({
      chainId: process.env.NEXT_PUBLIC_CHAINID as ChainId,
      senderAccount: `k:${senderPubKey}`,
    })
    .addSigner(creatorPublicKey, (withCap) => [
      withCap(
        `${namespace}.proof-of-us-gas-station.GAS_PAYER`,
        `k:${creatorPublicKey}`,
        new PactNumber(2500).toPactInteger(),
        new PactNumber(1).toPactDecimal(),
      ),
      withCap(
        `${namespace}.proof-of-us.EVENT`,
        collectionId,
        eventId,
        eventName,
        metadata.url,
      ),
    ])
    .addSigner(senderPubKey)
    .createTransaction();

  console.log({ unsignedTx });

  const signWithChainweaver = createSignWithChainweaver();
  const signedTx = await signWithChainweaver(unsignedTx);

  console.log(signedTx);

  if (!isSignedTransaction(signedTx)) throw Error('Not a signed transaction');

  const polldata = await kadenaClient.submit(signedTx);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);

  const { result } = (await kadenaClient.pollStatus(polldata))[
    polldata.requestKey
  ];

  if (result.status !== 'success') {
    console.log('ERROR', result);
    return;
  } else {
    console.log(`\n\nTOKEN CREATED!`, result.data);
    console.log(
      'Scan URL:',
      `https://devworld.kadena.io/scan/e/${result.data}`,
    );
    console.log(`\n\n`);
  }

  console.log('start upload');

  console.log({
    imageCid: imageData.data.cid.toString(),
    imageDataURL: imageData.url,
    metadataCid: metadata.data.cid.toString(),
    metadataURL: metadata.url,
  });
};

createEvent();
