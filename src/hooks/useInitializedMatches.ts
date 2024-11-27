import { useContractRead } from 'wagmi';
import { CONTRACTS } from '@/src/config/contracts';
import { betsAbi } from '@/src/config/abis';

export function useInitializedMatches() {
  const { data: matches, isLoading, isError } = useContractRead({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: 'getInitializedMatches',
    watch: true,
  });

  if (matches) {
    return {
      matches: matches.map((match: any) => ({
        id: match.id,
        name: match.name,
        participants: match.participants,
        date: new Date(Number(match.date) * 1000),
        isActive: match.isActive
      })),
      isLoading,
      isError
    };
  }

  return { matches: [], isLoading, isError };
} 