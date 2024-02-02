import fetch from 'node-fetch';

interface INameToAddressResponse {
  address: string;
}
interface IAddressToNameResponse {
  name: string;
}

export async function kdnResolveNameToAddress(name: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.kadenanames.com/api/v1/address/${name}`,
    );
    if (response.ok !== true) {
      throw new Error(
        `Error fetching address for name ${name}: ${response.status} ${response.statusText}`,
      );
    }
    const data = (await response.json()) as INameToAddressResponse;
    if (data.address === null) {
      throw new Error(`No name found for name ${name}`);
    }
    return data.address;
  } catch (error) {
    console.error('Error in kdnResolveNameToAddress:', error);
    throw error;
  }
}

export async function kdnResolveAddressToName(
  address: string,
): Promise<string> {
  try {
    const response = await fetch(
      `https://www.kadenanames.com/api/v1/name/${address}`,
    );
    if (response.ok !== true) {
      throw new Error(
        `Error fetching name for address ${address}: ${response.status} ${response.statusText}`,
      );
    }
    const data = (await response.json()) as IAddressToNameResponse;
    if (data.name === null) {
      throw new Error(`No name found for address ${address}`);
    }
    return data.name;
  } catch (error) {
    console.error('Error in kdnResolveAddressToName:', error);
    throw error;
  }
}
