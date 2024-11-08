import { ChainId, IUnsignedCommand, Pact } from '@kadena/client';
import {
  getNamespaceModule,
  PRICE_MAP,
  VAULT,
} from '../constants/kadenaNamesConstants';
import { isNameExpired, transformPactDate } from '../utils/kadenanames/date';
import { parseChainResponse } from '../utils/kadenanames/transactionParser';
import { addExtentionToName } from '../utils/kadenanames/transform';
import { getClient } from './host';

interface NameInfo {
  price: number;
  marketPrice: number;
  isAvailable: boolean;
  isForSale: boolean;
  expiryDate?: string | Date | null;
  lastPrice?: number;
}

interface SaleState {
  sellable: boolean;
  price: number;
}

export const fetchSaleState = async (
  name: string,
  networkId: string,
  chainId: ChainId,
): Promise<SaleState> => {
  const client = getClient(networkId);
  const module = getNamespaceModule(networkId);

  try {
    const transaction = Pact.builder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .execution((Pact as any).modules[module]['get-sale-state'](name))
      .setMeta({
        chainId,
        senderAccount: 'account',
        gasLimit: 100000,
        gasPrice: 0.001,
        ttl: 600,
        creationTime: Math.floor(Date.now() / 1000),
      })
      .setNetworkId(networkId)
      .createTransaction();

    const response = await client.dirtyRead(transaction);
    return (
      parseChainResponse<SaleState>(response, 'sale state') || {
        sellable: false,
        price: 0,
      }
    );
  } catch (error) {
    console.error('Error in fetchSaleState:', error);
    return { sellable: false, price: 0 };
  }
};

// Fetch name info independently
export const fetchNameInfo = async (
  name: string,
  networkId: string,
  chainId: ChainId,
  owner: string,
): Promise<NameInfo> => {
  const formattedName = addExtentionToName(name.toLowerCase());
  const client = getClient(networkId);
  const module = getNamespaceModule(networkId);

  try {
    const transaction = Pact.builder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .execution((Pact as any).modules[module]['get-name-info'](formattedName))
      .setMeta({
        chainId,
        senderAccount: owner,
        gasLimit: 100000,
        gasPrice: 0.001,
        ttl: 600,
        creationTime: Math.floor(Date.now() / 1000),
      })
      .setNetworkId(networkId)
      .createTransaction();

    const response = await client.dirtyRead(transaction);
    const result = parseChainResponse<NameInfo | null>(
      response,
      'name info',
    ) || {
      price: 0,
      marketPrice: 0,
      isAvailable: true,
      isForSale: false,
    };

    const expiryDate = transformPactDate(result.expiryDate);
    if (expiryDate && isNameExpired(expiryDate.getTime())) {
      return {
        ...result,
        price: 0,
        marketPrice: 0,
        isAvailable: true,
        isForSale: false,
        expiryDate,
      };
    } else {
      const saleState = await fetchSaleState(formattedName, networkId, chainId);
      return {
        ...result,
        isAvailable: false,
        isForSale: saleState.sellable,
        price: saleState.price,
        marketPrice: saleState.price ?? result.lastPrice ?? 0,
        expiryDate,
      };
    }
  } catch (error) {
    console.error('Error in fetchNameInfo:', error);
    return {
      isAvailable: false,
      isForSale: false,
      price: 0,
      marketPrice: 0,
    };
  }
};

// Fetch price independently based on registration period
export const fetchPriceByPeriod = async (
  period: keyof typeof PRICE_MAP,
  networkId: string,
  chainId: ChainId,
  owner: string,
): Promise<number> => {
  const days = PRICE_MAP[period];
  const client = getClient(networkId);
  const module = getNamespaceModule(networkId);

  try {
    const transaction = Pact.builder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .execution((Pact as any).modules[module]['get-price']({ int: days }))
      .setMeta({
        chainId,
        senderAccount: owner,
        gasLimit: 600,
        gasPrice: 1.0e-6,
        ttl: 28800,
        creationTime: Math.floor(Date.now() / 1000),
      })
      .setNetworkId(networkId)
      .createTransaction();

    const response = await client.dirtyRead(transaction);
    return parseChainResponse<number>(response, 'price') || 0;
  } catch (error) {
    console.error('Error in fetchPriceByPeriod:', error);
    return 0;
  }
};

export const createRegisterNameTransaction = (
  owner: string,
  address: string,
  name: string,
  days: number,
  price: number,
  networkId: string,
  chainId: ChainId,
): IUnsignedCommand => {
  const module = getNamespaceModule(networkId);

  const transaction = Pact.builder
    .execution(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Pact as any).modules[module].register(
        owner,
        address,
        name,
        { int: days },
        '',
      ),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addSigner(owner, (withCapability: any) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', owner, VAULT, price),
      withCapability(`${module}.ACCOUNT_GUARD`, owner),
    ])
    .setMeta({
      chainId,
      senderAccount: owner,
      gasLimit: 60000,
      gasPrice: 0.00000001,
      ttl: 28800,
    })
    .setNetworkId(networkId)
    .createTransaction();

  return transaction;
};

export const executeCreateRegisterNameTransaction = async (
  owner: string,
  address: string,
  name: string,
  registrationPeriod: keyof typeof PRICE_MAP,
  networkId: string,
  chainId: ChainId,
): Promise<IUnsignedCommand | null> => {
  const days = PRICE_MAP[registrationPeriod];

  const { price: newPrice } = await fetchNameInfo(
    name,
    networkId,
    chainId,
    owner,
  );

  const storedPrice = await fetchPriceByPeriod(
    registrationPeriod,
    networkId,
    chainId,
    owner,
  );

  const price =
    newPrice > 0 && newPrice !== storedPrice ? newPrice : storedPrice;

  const transaction = createRegisterNameTransaction(
    owner,
    address,
    name,
    days,
    price,
    networkId,
    chainId,
  );

  return transaction;
};
