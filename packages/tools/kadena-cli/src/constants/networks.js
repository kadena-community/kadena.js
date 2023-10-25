/**
 * @const networkDefaults
 * Provides the default network configurations for the mainnet, testnet, and custom created networks.
 */
export const networkDefaults = {
    mainnet: {
        network: 'mainnet',
        networkId: 'mainnet01',
        networkHost: 'https://api.chainweb.com',
        networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
    },
    testnet: {
        network: 'testnet',
        networkId: 'testnet04',
        networkHost: 'https://api.testnet.chainweb.com',
        networkExplorerUrl: 'https://explorer.chainweb.com/testnet/tx/',
    },
    other: {
        network: '',
        networkId: '',
        networkHost: '',
        networkExplorerUrl: '',
    },
};
export const defaultNetworksPath = `${process.cwd()}/.kadena/networks`;
export const standardNetworks = ['mainnet', 'testnet'];
export const defaultNetwork = 'testnet';
