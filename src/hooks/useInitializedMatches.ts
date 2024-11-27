import { useContractRead } from 'wagmi';
import { CONTRACTS } from '@/src/config/contracts';

const initializedMatchesAbi = [
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

interface InitializedMatch {
  id: string;
  name: string;
  participants: string;
  date: Date;
  isActive: boolean;
}

export function useInitializedMatches() {
  const { data: matches, isLoading, isError } = useContractRead({
    address: CONTRACTS.BETS as `0x${string}`,
    abi: initializedMatchesAbi,
    functionName: 'getInitializedMatches',
    watch: true,
  });

  const formattedMatches = matches?.map((match: any) => ({
    id: match.id,
    name: match.name,
    participants: match.participants,
    date: new Date(Number(match.date) * 1000),
    isActive: match.isActive
  })) || [];

  return {
    matches: formattedMatches as InitializedMatch[],
    isLoading,
    isError
  };
} 