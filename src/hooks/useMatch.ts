import { useContractRead } from 'wagmi';
import { CONTRACTS } from '@/src/config/contracts';

const oracleAbi = [
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

export function useMatch(matchId: string) {
  const { data, isError, isLoading } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: 'getMatch',
    args: [matchId as `0x${string}`],
  });

  if (data) {
    return {
      id: data[0],
      name: data[1],
      participants: data[2],
      participantCount: Number(data[3]),
      date: new Date(Number(data[4]) * 1000),
      outcome: Number(data[5]),
      winner: Number(data[6]),
      isLoading,
      isError
    };
  }

  return { isLoading, isError };
} 