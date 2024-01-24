export const DEVNET_CONFIG = {
  API: 'localhost:8080',
  NETWORKS: {
    DEVNET: 'devnet',
  },
  apiHost: ({ networkId, chainId }) =>
    `http://${DEVNET_CONFIG.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  estatsHost: () => '',
}
