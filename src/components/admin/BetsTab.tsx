import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { oracleAbi, betsAbi } from "@/src/config/abis";

interface OracleMatch {
  id: string;
  teamA: string;
  teamB: string;
  exists: boolean;
  finished: boolean;
  teamAWon: boolean;
}

export function BetsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Lê as partidas do Oracle
  const { data: oracleMatches } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "getAllMatches",
  });

  // Lê as partidas do Bets
  const { data: betsMatches } = useContractRead({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "getAllMatches",
  });

  // Hook de escrita para criar partida no Bets
  const { write: createMatch } = useContractWrite({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "createMatch",
    mode: 'prepared',
  });

  // Sincroniza uma partida do Oracle com o Bets
  const handleSyncMatch = async (match: OracleMatch) => {
    try {
      setIsLoading(true);
      await createMatch?.({
        args: [match.id as `0x${string}`, match.teamA, match.teamB],
      });
      setStatus(`Partida ${match.teamA} vs ${match.teamB} sincronizada com sucesso!`);
    } catch (error) {
      console.error("Erro ao sincronizar partida:", error);
      setStatus("Erro ao sincronizar partida");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra partidas que existem no Oracle mas não no Bets
  const pendingMatches = oracleMatches?.filter(match => 
    match.exists && !betsMatches?.includes(match.id)
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partidas Pendentes de Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingMatches.length === 0 ? (
            <p className="text-gray-500">Não há partidas pendentes de sincronização.</p>
          ) : (
            <div className="space-y-4">
              {pendingMatches.map((match) => (
                <div 
                  key={match.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                    <p className="text-sm text-gray-500">ID: {match.id.slice(0, 10)}...</p>
                  </div>
                  <Button
                    onClick={() => handleSyncMatch(match)}
                    disabled={isLoading}
                  >
                    Sincronizar
                  </Button>
                </div>
              ))}
            </div>
          )}

          {status && (
            <div className={`mt-4 p-4 rounded-md ${
              status.includes("sucesso") 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {status}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 