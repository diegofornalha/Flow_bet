export const betsAbi = [
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInitializedMatches",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "id", type: "bytes32" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "participants", type: "string" },
          { internalType: "uint256", name: "date", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" }
        ],
        internalType: "struct Bets.Match[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const betPayoutAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "hash", type: "bytes32" }],
    name: "checkPayout",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const oracleAbi = [
  {
    inputs: [
      { internalType: "string", name: "championshipName", type: "string" },
      { internalType: "string", name: "teamA", type: "string" },
      { internalType: "string", name: "teamB", type: "string" },
      { internalType: "uint256", name: "matchDate", type: "uint256" },
      { internalType: "uint256", name: "matchTime", type: "uint256" }
    ],
    name: "createMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllMatches",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "id", type: "bytes32" },
          { internalType: "string", name: "championshipName", type: "string" },
          { internalType: "string", name: "teamA", type: "string" },
          { internalType: "string", name: "teamB", type: "string" },
          { internalType: "uint256", name: "matchDate", type: "uint256" },
          { internalType: "uint256", name: "matchTime", type: "uint256" },
          { internalType: "enum Oracle.MatchOutcome", name: "outcome", type: "uint8" }
        ],
        internalType: "struct Oracle.Match[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "matchExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "_matchId", type: "bytes32" }],
    name: "getMatch",
    outputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "participants", type: "string" },
      { internalType: "uint8", name: "participantCount", type: "uint8" },
      { internalType: "uint256", name: "date", type: "uint256" },
      { internalType: "uint8", name: "outcome", type: "uint8" },
      { internalType: "int8", name: "winner", type: "int8" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const disableableAbi = [
  {
    inputs: [],
    name: "isDisabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const betPatAbi = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "placeBets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "placeBetsJag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getA",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getB",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  }
] as const; 