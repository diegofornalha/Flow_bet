import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { oracleAbi, betsAbi } from "@/src/config/abis";

interface OracleMatch {
  id: `0x${string}`;
  name: string;
  participants: string;
  participantCount: number;
  date: bigint;
  outcome: number;
  winner: number;
}

export function BetsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Lê as partidas do Oracle
  const { data: matches } = useContractRead({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: oracleAbi,
    functionName: "getAllMatches",
    watch: true,
  });

  // Hook para inicializar partida no Bets
  const { 
    writeAsync: initializeMatch,
    data: initializeData,
    isLoading: isInitializing 
  } = useContractWrite({
    address: CONTRACTS.BETS as `0x${string}`,
    abi: betsAbi,
    functionName: "initializeMatch",
    mode: 'prepared',
  });

  // Hook para monitorar a transação
  const { isLoading: isWaitingTransaction } = useWaitForTransaction({
    hash: initializeData?.hash,
  });

  // Inicializa uma partida no Bets
  const handleInitializeMatch = async (matchId: `0x${string}`) => {
    try {
      setIsLoading(true);
      setStatus("Iniciando transação...");

      const tx = await initializeMatch({
        args: [matchId],
        overrides: {
          gasLimit: BigInt(500000),
        }
      });

      setStatus("Transação enviada! Aguardando confirmação...");
      await tx.wait();
      setStatus(`Partida ${matchId.slice(0, 10)}... inicializada com sucesso!`);

    } catch (error) {
      console.error("Erro ao inicializar partida:", error);
      setStatus(`Erro ao inicializar partida: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Partidas Pendentes de Inicialização</CardTitle>
        </CardHeader>
        <CardContent>
          {matches && matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((matchId) => (
                <div 
                  key={matchId}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-xs text-gray-500">ID: {matchId.slice(0, 10)}...</p>
                  </div>
                  <Button
                    onClick={() => handleInitializeMatch(matchId)}
                    disabled={isLoading || isInitializing || isWaitingTransaction}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isLoading || isInitializing 
                      ? "Inicializando..." 
                      : isWaitingTransaction 
                        ? "Confirmando..." 
                        : "Inicializar Partida"
                    }
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Nenhuma partida pendente de inicialização.
            </p>
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