export const CONTRACTS = {
  BETS: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
  ORACLE: "0xfbB1f46f21129Ce841c6e755E2e97B275Bec0cC1",
  BETPAT: "0x65CbDc4dBa763878A47ca47AEfe7FC9011081A91",
  DISABLEABLE: "0x9dB84A7D253B53eE575AbEc1a4e26685f957A836",
  BETPAYOUT: "0xC6B56f99fCD697F0bC669C587420A3B5092e811d"
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