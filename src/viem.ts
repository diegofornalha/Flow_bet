import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { flowTestnet } from './chains';

// Cliente público para leitura
export const publicClient = createPublicClient({
  chain: flowTestnet,
  transport: http()
});

// Cliente para carteira (para transações)
export const createWalletClient = (provider: any) => {
  return createWalletClient({
    chain: flowTestnet,
    transport: custom(provider)
  });
};

// Configuração da chain Flow Testnet
export const flowTestnet = {
  id: 545,
  name: 'Flow Testnet',
  network: 'flow-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://flow-testnet.g.alchemy.com/v2/t36548u9axs6lod6'],
    },
    public: {
      http: ['https://flow-testnet.g.alchemy.com/v2/t36548u9axs6lod6'],
    },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
  },
  testnet: true,
} as const;