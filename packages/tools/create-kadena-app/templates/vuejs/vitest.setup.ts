import { vi } from 'vitest';

// Mock canvas to avoid native binary issues
if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn((x, y, w, h) => ({ data: new Array(w * h * 4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    })),
  });
}

// Mock Image constructor
if (typeof global !== 'undefined') {
  global.Image = class {
    onload = null;
    onerror = null;
    src = '';
    width = 0;
    height = 0;
  } as any;
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock wallet adapters
vi.mock('@kadena/wallet-adapter-core', () => ({
  WalletAdapterClient: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    connect: vi.fn().mockResolvedValue({
      accountName: 'k:test-account',
      keyset: { keys: [], pred: 'keys-all' },
      existsOnChains: []
    }),
    isDetected: vi.fn().mockReturnValue(true),
    onAccountChange: vi.fn(),
    onNetworkChange: vi.fn(),
    getActiveNetwork: vi.fn().mockResolvedValue({
      network: 'testnet04',
      chainId: '1'
    }),
    signTransaction: vi.fn().mockResolvedValue({}),
    getAccount: vi.fn().mockResolvedValue({
      accountName: 'k:test-account',
      keyset: { keys: [], pred: 'keys-all' },
      existsOnChains: []
    })
  }))
}));

vi.mock('@kadena/wallet-adapter-ecko', () => ({
  createEckoAdapter: vi.fn().mockReturnValue({
    name: 'Ecko Wallet',
    detected: true
  })
}));

vi.mock('@kadena/wallet-adapter-chainweaver-legacy', () => ({
  createChainweaverLegacyAdapter: vi.fn().mockReturnValue({
    name: 'ChainweaverLegacy',
    detected: false
  })
}));

vi.mock('@kadena/wallet-adapter-walletconnect', () => ({
  createWalletConnectAdapter: vi.fn().mockReturnValue({
    name: 'WalletConnect',
    detected: false
  })
}));
