export const CONTRACTS = {
  BETS: "0xe652bC36eb4D8F40F245ba9Aa3282CeB1dDe7796",
  ORACLE: "0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c",
  BETPAT: "0x65CbDc4dBa763878A47ca47AEfe7FC9011081A91",
  DISABLEABLE: "0x9dB84A7D253B53eE575AbEc1a4e26685f957A836",
  BETPAYOUT: "0x9d83e140330758a8fFD07F8Bd73e86ebcA8a5692",
  OWNER: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
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