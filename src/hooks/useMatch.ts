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
    const timestamp = Number(data[4]); // data[4] é o campo date do contrato
    const date = new Date(timestamp * 1000); // Converter de segundos para milissegundos

    return {
      id: data[0],
      name: data[1],
      participants: data[2],
      participantCount: Number(data[3]),
      date: date,
      outcome: Number(data[5]),
      winner: Number(data[6]),
      isLoading,
      isError
    };
  }

  return { isLoading, isError };
} 