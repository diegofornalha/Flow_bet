import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, goerli } from 'wagmi/chains';

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
    default: {
      http: ['https://mainnet.evm.nodes.onflow.org'],
    },
    public: {
      http: ['https://mainnet.evm.nodes.onflow.org'],
    },
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
    default: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
    public: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
  },
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [flowMainnet, flowTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'FlowBets',
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const rainbowConfig = {
  chains,
  initialChain: flowTestnet,
};