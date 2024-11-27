export const betsAbi = [
  {
    inputs: [
      { internalType: "address", name: "_oracle", type: "address" },
      { internalType: "address", name: "_betPayout", type: "address" },
      { internalType: "address", name: "initialOwner", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "matchId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "bettor", type: "address" },
      { indexed: false, internalType: "bool", name: "teamA", type: "bool" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "shares", type: "uint256" },
      { indexed: false, internalType: "string", name: "teams", type: "string" }
    ],
    name: "BetPlaced",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "matchId", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "initialVolume", type: "uint256" },
      { indexed: false, internalType: "string", name: "championshipName", type: "string" },
      { indexed: false, internalType: "string", name: "teams", type: "string" }
    ],
    name: "MatchInitialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "MINIMUM_BET",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "disabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "enable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamAPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamAPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamAVolume",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamBPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamBPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeamBVolume",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTotalPool",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "initialVolume",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "initializeMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "matches",
    outputs: [
      { internalType: "uint256", name: "teamAVolume", type: "uint256" },
      { internalType: "uint256", name: "teamBVolume", type: "uint256" },
      { internalType: "uint256", name: "totalPool", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "matchId", type: "bytes32" },
      { internalType: "uint32", name: "amount", type: "uint32" },
      { internalType: "bool", name: "team", type: "bool" }
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "userSharesA",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "userSharesB",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "matchId",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "string",
        name: "championshipName",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "teams",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "matchDate",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "matchTime",
        type: "uint256"
      }
    ],
    name: "MatchCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "SEASON_DEADLINE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "addTestData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
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
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
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
      { internalType: "enum Oracle.MatchOutcome", name: "outcome", type: "uint8" },
      { internalType: "int8", name: "winner", type: "int8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getMatchDateTime",
    outputs: [
      { internalType: "uint256", name: "date", type: "uint256" },
      { internalType: "uint256", name: "time", type: "uint256" },
      { internalType: "string", name: "formattedTime", type: "string" },
      { internalType: "string", name: "timeZone", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bool", name: "_pending", type: "bool" }],
    name: "getMostRecentMatch",
    outputs: [
      { internalType: "bytes32", name: "id", type: "bytes32" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "participants", type: "string" },
      { internalType: "uint8", name: "participantCount", type: "uint8" },
      { internalType: "uint256", name: "date", type: "uint256" },
      { internalType: "enum Oracle.MatchOutcome", name: "outcome", type: "uint8" },
      { internalType: "int8", name: "winner", type: "int8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getPendingMatches",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "getTeams",
    outputs: [
      { internalType: "string", name: "teamA", type: "string" },
      { internalType: "string", name: "teamB", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "_matchId", type: "bytes32" }],
    name: "matchExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "testConnection",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "matchId", type: "bytes32" },
      { internalType: "enum Oracle.MatchOutcome", name: "newOutcome", type: "uint8" }
    ],
    name: "updateMatchStatus",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "getA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getB", 
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "placeBetsA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "placeBetsB",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const; 