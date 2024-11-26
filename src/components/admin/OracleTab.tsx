"use client";

import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Uint256Input } from "../ui/uint256-input";

// Enum para mapear os status das partidas
enum MatchOutcome {
  Pending,   // Partida ainda não começou
  Underway,  // Partida em andamento
  Draw,      // Empate
  Decided    // Vencedor definido
}

const oracleAbi = [
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
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "id", type: "bytes32" },
          { internalType: "string", name: "championshipName", type: "string" },
          { internalType: "string", name: "teamA", type: "string" },
          { internalType: "string", name: "teamB", type: "string" },
          { internalType: "uint256", name: "matchDate", type: "uint256" },
          { internalType: "uint256", name: "matchTime", type: "uint256" },
          { internalType: "enum Oracle.MatchOutcome", name: "outcome", type: "uint8" }
        ],
        internalType: "struct Oracle.Match[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

const betsAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "initializeMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

const matchSchema = z.object({
  championshipName: z.string().min(1, "Nome do campeonato é obrigatório"),
  teamA: z.string().min(1, "Nome do Time A é obrigatório"),
  teamB: z.string().min(1, "Nome do Time B é obrigatório"),
  matchDate: z.string()
    .min(1, "Data é obrigatória")
    .transform((val) => {
      try {
        return BigInt(val);
      } catch {
        return null;
      }
    })
    .refine((val) => val !== null && val > 0n, {
      message: "Data deve ser maior que zero",
    }),
  matchTime: z.string()
    .min(1, "Horário é obrigatório")
    .transform((val) => {
      try {
        return BigInt(val);
      } catch {
        return null;
      }
    })
    .refine((val) => val !== null && val >= 0n && val < 86400n, {
      message: "Horário deve estar entre 0 e 86399 (segundos em um dia)",
    }),
});

// Função para converter data e hora para timestamp e segundos desde meia-noite
function convertToMatchTime(date: string, time: string): { matchDate: number, matchTime: number } {
  const [hours, minutes] = time.split(':').map(Number);
  const matchTime = hours * 3600 + minutes * 60; // Converte para segundos desde meia-noite
  const matchDate = Math.floor(new Date(date).getTime() / 1000); // Timestamp em segundos

  return { matchDate, matchTime };
}

// Função para formatar data e hora no fuso de Brasília
function formatDateTime(timestamp: number): { date: string, time: string } {
  const date = new Date(timestamp * 1000); // Converte segundos para milissegundos
  
  return {
    date: date.toLocaleDateString('pt-BR', { 
      timeZone: 'America/Sao_Paulo' 
    }),
    time: date.toLocaleTimeString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

interface Match {
  id: string;
  name: string;
  description: string;
  matchDate: string;
  matchTime: string;
  outcome: number;
  active: boolean;
}

export function OracleTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Inicialização do formulário
  const form = useForm<z.infer<typeof matchSchema>>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      championshipName: "",
      teamA: "",
      teamB: "",
      matchDate: "",
      matchTime: ""
    }
  });

  // Lê todas as partidas do Oracle
  const { data: matches, refetch: refetchMatches } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "getAllMatches",
    watch: true,
  });

  // Hook para criar partida no Oracle
  const { write, isLoading: isCreateLoading } = useContractWrite({
    address: CONTRACTS.ORACLE as `0x${string}`,
    abi: oracleAbi,
    functionName: "createMatch",
    mode: 'prepared',
    onSuccess(data) {
      setStatus("Transação enviada! Aguardando confirmação...");
      data.wait().then(() => {
        setStatus("Partida criada com sucesso!");
        form.reset();
        refetchMatches?.();
      });
    },
    onError(error) {
      setStatus(`Erro ao criar partida: ${error.message}`);
    }
  });

  // Criar e inicializar nova partida
  const handleCreateMatch = async (values: z.infer<typeof matchSchema>) => {
    try {
      setIsLoading(true);

      write?.({
        args: [
          values.championshipName,
          values.teamA,
          values.teamB,
          values.matchDate,
          values.matchTime
        ],
      });

    } catch (error) {
      console.error("Erro ao criar partida:", error);
      setStatus(`Erro ao criar partida: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  };

  return (
    <div className="space-y-6">
      {/* Criar Nova Partida */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateMatch)} className="space-y-4">
              <FormField
                control={form.control}
                name="championshipName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Campeonato</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Brasileirão Série A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="teamA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time A</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Fluminense" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time B</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Criciúma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matchDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data (Unix Timestamp)</FormLabel>
                      <FormControl>
                        <Uint256Input
                          placeholder="Ex: 1703721600"
                          value={field.value ? BigInt(field.value) : null}
                          onChange={(value) => field.onChange(value?.toString() || '')}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        Timestamp em segundos desde 01/01/1970
                        <a 
                          href="https://www.unixtimestamp.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline ml-2"
                        >
                          Conversor
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matchTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário (Segundos)</FormLabel>
                      <FormControl>
                        <Uint256Input
                          placeholder="Ex: 43200 (12:00)"
                          value={field.value ? BigInt(field.value) : null}
                          onChange={(value) => field.onChange(value?.toString() || '')}
                          className="font-mono"
                          max={86399n} // 23:59:59 em segundos
                        />
                      </FormControl>
                      <FormDescription>
                        Segundos desde meia-noite (0-86399)
                        <a 
                          href="https://www.timeanddate.com/time/time-converter-calculator.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline ml-2"
                        >
                          Conversor
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || isCreateLoading}
                className="w-full"
              >
                {isLoading || isCreateLoading 
                  ? "Criando..." 
                  : "Criar Partida"
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de Partidas */}
      <Card>
        <CardHeader>
          <CardTitle>Partidas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches && matches.length > 0 ? (
              matches.map((match) => (
                <div 
                  key={match.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{match.championshipName}</p>
                      <p className="text-sm text-gray-600">
                        {match.teamA} vs {match.teamB}
                      </p>
                      <div className="flex space-x-4 mt-1">
                        <p className="text-sm text-gray-500">
                          Data: {formatDate(Number(match.matchDate))}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {getOutcomeText(Number(match.outcome))}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {match.id.slice(0, 10)}...
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma partida registrada.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {status && (
        <div className={`p-4 rounded-md ${
          status.includes("sucesso") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {status}
        </div>
      )}
    </div>
  );
} 