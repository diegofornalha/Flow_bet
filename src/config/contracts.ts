export const CONTRACTS = {
  BETS: "0xF794E7EA997EaB751A1D49Bc9b67A8F46fB7BcB9",
  ORACLE: "0xd4DE988ab59299d1bc120d379C131375c4633146",
  BETPAT: "0x5B63C199c7391a88538DDF611a1D033b87677d1D",
  DISABLEABLE: "0x9dB84A7D253B53eE575AbEc1a4e26685f957A836",
  BETPAYOUT: "0xcc351f6816830da02B29d7a174df0DDEaEfe0921",
  OWNER: "0x8F0e2980701E313665cB40460d552d7Ad7f1BBB8"
} as const;

export const CHAIN_CONFIG = {
  testnet: {
    name: 'Flow Testnet',
    chainId: 'flow-testnet',
    rpcUrl: 'https://rest-testnet.onflow.org'
  },
  mainnet: {
    name: 'Flow Mainnet',
    chainId: 'flow-mainnet',
    rpcUrl: 'https://rest-mainnet.onflow.org'
  }
} as const; 