import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { oracleAbi, betsAbi } from "@/src/config/abis";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  matchId: z.string().startsWith("0x", "ID deve começar com 0x"),
});

interface TransactionDetails {
  hash?: string;
  blockNumber?: number;
  from?: string;
  to?: string;
  gasUsed?: number;
  logs?: {
    matchId: string;
    initialVolume: string;
    championshipName: string;
    teams: string;
  }[];
}

export function BetsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchId: "",
    },
  });

  // Hook para ler dados da partida
  const { data: matchData, refetch: refetchMatch } = useContractRead({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: oracleAbi,
    functionName: "getMatch",
    args: form.watch("matchId") ? [form.watch("matchId") as `0x${string}`] : undefined,
    enabled: false, // Não buscar automaticamente
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

  // Função para buscar dados da partida
  const handleFetchMatch = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const matchId = form.getValues('matchId');
      if (!matchId) {
        setStatus("Por favor, insira um ID de partida");
        return;
      }

      const { data } = await refetchMatch();
      if (data) {
        setMatchDetails({
          id: data[0],
          name: data[1],
          participants: data[2],
          participantCount: Number(data[3]),
          date: Number(data[4]),
          outcome: Number(data[5]),
          winner: Number(data[6])
        });
        setStatus("Dados da partida carregados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da partida:", error);
      setStatus("Erro ao buscar dados da partida");
    }
  };

  // Inicializa uma partida no Bets
  const handleInitializeMatch = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setStatus("Iniciando transação...");
      setTxDetails(null);

      if (!initializeMatch) {
        throw new Error("Contrato não está pronto");
      }

      const tx = await initializeMatch({
        args: [values.matchId as `0x${string}`],
        overrides: {
          gasLimit: BigInt(500000),
        }
      });

      setStatus("Transação enviada! Aguardando confirmação...");
      
      const receipt = await tx.wait();
      
      // Decodifica os logs do evento MatchInitialized
      const matchInitializedEvent = receipt.logs[0];
      const decodedLogs = {
        matchId: matchInitializedEvent.topics[1],
        initialVolume: parseInt(matchInitializedEvent.data.slice(0, 66)),
        championshipName: matchDetails?.name || "",
        teams: matchDetails?.participants || "",
      };

      setTxDetails({
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        gasUsed: Number(receipt.gasUsed),
        logs: [decodedLogs]
      });

      setStatus(`Partida ${values.matchId.slice(0, 10)}... inicializada com sucesso!`);
      form.reset();
      setMatchDetails(null);

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
          <CardTitle>Inicializar Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInitializeMatch)} className="space-y-4">
              <FormField
                control={form.control}
                name="matchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Partida</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="0x..."
                          {...field}
                          className="font-mono"
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        onClick={handleFetchMatch}
                        variant="outline"
                      >
                        Buscar
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              {matchDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 font-mono text-sm">
                  <p><span className="font-semibold">ID:</span> {matchDetails.id}</p>
                  <p><span className="font-semibold">Nome:</span> {matchDetails.name}</p>
                  <p><span className="font-semibold">Participantes:</span> {matchDetails.participants}</p>
                  <p><span className="font-semibold">Nº Participantes:</span> {matchDetails.participantCount}</p>
                  <p><span className="font-semibold">Data:</span> {matchDetails.date}</p>
                  <p><span className="font-semibold">Status:</span> {matchDetails.outcome}</p>
                  <p><span className="font-semibold">Vencedor:</span> {matchDetails.winner}</p>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isLoading || isInitializing || isWaitingTransaction}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isLoading || isInitializing 
                  ? "Inicializando..." 
                  : isWaitingTransaction 
                    ? "Confirmando..." 
                    : "Inicializar Partida"
                }
              </Button>
            </form>
          </Form>

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

      {/* Detalhes da Transação */}
      {txDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <p><span className="font-semibold">Status:</span> Transaction mined and execution succeed</p>
              <p><span className="font-semibold">Hash:</span> {txDetails.hash}</p>
              <p><span className="font-semibold">Block Number:</span> {txDetails.blockNumber}</p>
              <p><span className="font-semibold">From:</span> {txDetails.from}</p>
              <p><span className="font-semibold">To:</span> Bets.initializeMatch(bytes32) {txDetails.to}</p>
              <p><span className="font-semibold">Gas Used:</span> {txDetails.gasUsed} gas</p>
              
              {txDetails.logs && txDetails.logs.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Logs:</p>
                  <div className="pl-4 mt-2">
                    <p>Event: MatchInitialized</p>
                    <p>matchId: {txDetails.logs[0].matchId}</p>
                    <p>initialVolume: {txDetails.logs[0].initialVolume}</p>
                    <p>championshipName: {txDetails.logs[0].championshipName}</p>
                    <p>teams: {txDetails.logs[0].teams}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 