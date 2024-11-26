import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";

const matchesAbi = [
  {
    inputs: [],
    name: "getAllMatches",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

export function useMatches() {
  const { data: matches } = useReadContract({
    address: CONTRACTS.BETS,
    abi: matchesAbi,
    functionName: "getAllMatches",
  });

  // Organiza as partidas por semana
  const organizeMatchesByWeek = () => {
    if (!matches) return [];

    return matches.reduce((acc: any[], match, index) => {
      const weekNumber = Math.floor(index / 2) + 1; // 2 jogos por semana
      const weekExists = acc.find(week => week.weekNumber === weekNumber);

      if (weekExists) {
        weekExists.matches.push({
          id: match,
          time: "6:30 AM", // Você pode ajustar isso conforme necessário
          teams: [
            { name: "Brasil", record: "0-0" },
            { name: "Argentina", record: "0-0" }
          ]
        });
      } else {
        acc.push({
          weekNumber,
          matches: [{
            id: match,
            time: "6:30 AM",
            teams: [
              { name: "Brasil", record: "0-0" },
              { name: "Argentina", record: "0-0" }
            ]
          }]
        });
      }

      return acc;
    }, []);
  };

  return {
    weeks: organizeMatchesByWeek(),
    isLoading: !matches
  };
} 