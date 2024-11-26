"use client";

import { useContractRead, useContractWrite } from "wagmi";
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
} from "../ui/form";

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
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" }
    ],
    name: "createMatch",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "active", type: "bool" }],
    name: "getMostRecentMatch",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMatches",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "id", type: "bytes32" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "enum Oracle.MatchOutcome", name: "outcome", type: "uint8" },
          { internalType: "bool", name: "active", type: "bool" }
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
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  matchDate: z.string().min(1, "Data é obrigatória"),
  matchTime: z.string().min(1, "Horário é obrigatório"),
});

// Função para converter data/hora local para UTC
function localToUTC(date: string, time: string): number {
  const localDateTime = new Date(`${date}T${time}`);
  return Math.floor(localDateTime.getTime() / 1000); // Converte para timestamp UTC em segundos
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

  // Lê todas as partidas do Oracle
  const { data: matches, refetch: refetchMatches } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "getAllMatches",
  });

  // Hook para criar partida no Oracle
  const { write: createMatch } = useContractWrite({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "createMatch",
    mode: 'prepared',
  });

  // Hook para inicializar partida no sistema de apostas
  const { write: initializeMatch } = useContractWrite({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "initializeMatch",
    mode: 'prepared',
  });

  // Form para criar nova partida
  const form = useForm<z.infer<typeof matchSchema>>({
    resolver: zodResolver(matchSchema),
  });

  // Função para traduzir o enum MatchOutcome
  const getOutcomeText = (outcome: number) => {
    switch (outcome) {
      case MatchOutcome.Pending: return "Aguardando Início";
      case MatchOutcome.Underway: return "Em Andamento";
      case MatchOutcome.Draw: return "Empate";
      case MatchOutcome.Decided: return "Finalizada";
      default: return "Desconhecido";
    }
  };

  // Criar e inicializar nova partida
  const handleCreateMatch = async (values: z.infer<typeof matchSchema>) => {
    try {
      setIsLoading(true);
      
      // Converte data e hora local para timestamp UTC
      const matchTimestamp = localToUTC(values.matchDate, values.matchTime);
      
      // 1. Criar partida no Oracle com timestamp
      await createMatch?.({
        args: [
          values.name, 
          values.description,
          BigInt(matchTimestamp) // Envia o timestamp UTC para a blockchain
        ],
      });

      // 2. Esperar um pouco para a transação ser minerada
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Obter ID da partida mais recente
      const { data: matchId } = await useContractRead({
        address: CONTRACTS.ORACLE,
        abi: oracleAbi,
        functionName: "getMostRecentMatch",
        args: [true],
      });

      if (matchId) {
        // 4. Inicializar partida no sistema de apostas
        await initializeMatch?.({
          args: [matchId],
        });

        setStatus("Partida criada e inicializada com sucesso!");
        form.reset();
        refetchMatches();
      }

    } catch (error) {
      console.error("Erro ao criar partida:", error);
      setStatus("Erro ao criar partida. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Partida</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Brasil vs Argentina" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Final da Copa América 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matchDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Partida</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          min={new Date().toISOString().split('T')[0]} // Data mínima é hoje
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matchTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Criando..." : "Criar Partida"}
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
            {matches?.map((match) => {
              const { date, time } = formatDateTime(Number(match.timestamp));
              return (
                <div 
                  key={match.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{match.name}</p>
                      <p className="text-sm text-gray-500">{match.description}</p>
                      <div className="flex space-x-4 mt-1">
                        <p className="text-sm text-gray-500">
                          Data: {date}
                        </p>
                        <p className="text-sm text-gray-500">
                          Horário: {time}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {getOutcomeText(match.outcome)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {match.id.slice(0, 10)}...
                    </div>
                  </div>
                </div>
              );
            })}
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