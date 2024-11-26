import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// Definindo Flow Mainnet EVM
const flowMainnet: Chain = {
  id: 747,
  name: 'EVM on Flow',
  network: 'flow-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    public: { http: ['https://mainnet.evm.nodes.onflow.org'] },
    default: { http: ['https://mainnet.evm.nodes.onflow.org'] },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm.flowscan.io' },
  },
  testnet: false,
};

// Definindo Flow Testnet EVM
const flowTestnet: Chain = {
  id: 545,
  name: 'EVM on Flow Testnet',
  network: 'flow-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    public: { http: ['https://testnet.evm.nodes.onflow.org'] },
    default: { http: ['https://testnet.evm.nodes.onflow.org'] },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [flowMainnet, flowTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'FlowBets',
  projectId: '5baff35427233022905a6376b28cfb13',
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const rainbowConfig = {
  chains,
  initialChain: flowTestnet, // Define Flow Testnet como padrão
  showRecentTransactions: true,
  appName: 'FlowBets',
  coolMode: true,
};