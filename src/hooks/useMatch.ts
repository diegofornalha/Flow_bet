import { useContractRead } from 'wagmi';
import { CONTRACTS } from '@/src/config/contracts';
import { oracleAbi } from '@/src/config/abis';

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
      date: new Date(Number(data[4]) * 1000), // Converter timestamp para Date
      outcome: Number(data[5]),
      winner: Number(data[6]),
      isLoading,
      isError
    };
  }

  return { isLoading, isError };
} 