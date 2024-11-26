"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { z } from "zod";
import { CONTRACTS } from "@/src/config/contracts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { useMatch } from '@/src/hooks/useMatch';
import { Uint256Input } from "../ui/uint256-input";

const abi = [
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "placeBets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "placeBetsJag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

const formSchema = z.object({
  amount: z.string()
    .min(1, "Valor é obrigatório")
    .transform((val) => {
      try {
        return BigInt(val);
      } catch {
        return null;
      }
    })
    .refine((val) => val !== null && val > 0n, {
      message: "Valor deve ser maior que zero",
    }),
});

export function BettingCard() {
  const [selectedTeam, setSelectedTeam] = useState<string>("BRZ");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const { data } = useContractRead({
    address: CONTRACTS.BETS,
    abi,
    functionName: "viewVolume",
  });

  const tokenA = data?.[0] ? parseInt(data[0].toString()) : 0;
  const tokenB = data?.[1] ? parseInt(data[1].toString()) : 0;
  const totalTokens = tokenA + tokenB;

  const calculatePrices = () => {
    const BASE_PRICE = 100;
    
    if (totalTokens === 0) {
      return {
        priceA: BASE_PRICE,
        priceB: BASE_PRICE,
        oddsA: 2.0,
        oddsB: 2.0
      };
    }

    const priceA = (tokenA / totalTokens) * 200;
    const priceB = (tokenB / totalTokens) * 200;

    const oddsA = (200 / priceA).toFixed(2);
    const oddsB = (200 / priceB).toFixed(2);

    return {
      priceA,
      priceB,
      oddsA,
      oddsB
    };
  };

  const prices = calculatePrices();

  const calculateProbabilities = () => {
    if (totalTokens === 0) {
      return {
        teamA: 33.33,
        draw: 33.33,
        teamB: 33.33
      };
    }

    const teamA = (tokenA / totalTokens) * 100;
    const teamB = (tokenB / totalTokens) * 100;
    const draw = 100 - (teamA + teamB);

    return {
      teamA: Number(teamA.toFixed(2)),
      draw: Number(draw.toFixed(2)),
      teamB: Number(teamB.toFixed(2))
    };
  };

  const probabilities = calculateProbabilities();

  const { 
    writeAsync: placeBet,
    data: placeBetData,
    isLoading: isPlacingBet,
    isSuccess: placeBetSuccess,
    error: placeBetError 
  } = useContractWrite({
    address: CONTRACTS.BETS,
    abi,
    functionName: selectedTeam === "BRZ" ? "placeBets" : "placeBetsJag",
    mode: 'prepared',
  });

  const { 
    isLoading: isWaitingTransaction,
    isSuccess: transactionSuccess,
    error: transactionError
  } = useWaitForTransaction({
    hash: placeBetData?.hash,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!placeBet) {
        throw new Error("Contrato não está pronto");
      }

      const tx = await placeBet({
        args: [BigInt(values.amount)],
        overrides: {
          gasLimit: BigInt(500000),
        }
      });

      setTransactionStatus("Transação enviada! Aguardando confirmação...");
      await tx.wait();
      setTransactionStatus("Aposta realizada com sucesso!");
      form.reset();

    } catch (error) {
      console.error("Erro ao enviar transação:", error);
      setTransactionStatus(`Erro ao fazer aposta: ${(error as Error).message}`);
    }
  }

  const selectTeam = (team: string) => {
    setSelectedTeam(team);
  };

  const getSelectedOdds = () => {
    return selectedTeam === "BRZ" ? prices.oddsA : prices.oddsB;
  };

  const getTransactionStatus = () => {
    if (isPlacingBet || isWaitingTransaction) {
      return (
        <div className="mt-4 text-center">
          <div className="animate-pulse text-blue-600">
            {isPlacingBet ? "Confirmando aposta..." : "Processando transação..."}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Por favor, aguarde a confirmação da sua carteira
          </p>
        </div>
      );
    }

    if (placeBetError || transactionError) {
      return (
        <div className="mt-4 text-center text-red-600">
          <p>Erro ao processar aposta:</p>
          <p className="text-sm">
            {(placeBetError || transactionError)?.message || "Tente novamente"}
          </p>
        </div>
      );
    }

    if (transactionSuccess) {
      return (
        <div className="mt-4 text-center text-green-600">
          <p className="font-bold">Aposta confirmada com sucesso!</p>
          <a 
            href={`https://evm-testnet.flowscan.org/tx/${placeBetData?.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline mt-1 block"
          >
            Ver transação no FlowScan
          </a>
        </div>
      );
    }

    return null;
  };

  const matchId = "0xc1bfcab9873c24b7adb4047d80994d931c294f6c9daae37f2bb400c03c4aa8ec";
  const match = useMatch(matchId);

  return (
    <Card className="w-full bg-white text-black shadow-lg">
      <CardHeader>
        {match && !match.isLoading && match.date && (
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{match.name}</h2>
            <p className="text-sm text-gray-600">{match.participants}</p>
            <p className="text-sm text-gray-500">
              {match.date instanceof Date ? match.date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
              }) : 'Data não disponível'}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/assets/images/brasil.png"
              alt="Logo Brasil"
              width={32}
              height={32}
              className="mr-2"
            />
            <Button
              onClick={() => selectTeam("BRZ")}
              className={`w-full transition-colors duration-300 ${
                selectedTeam === "BRZ" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
              } border border-gray-300 rounded-md shadow-sm hover:bg-green-500 hover:text-white`}
            >
              Brasil
            </Button>
          </div>
          <div className="flex items-center">
            <Image
              src="/assets/images/argentina.png"
              alt="Logo Argentina"
              width={32}
              height={32}
              className="mr-2"
            />
            <Button
              onClick={() => selectTeam("ARZ")}
              className={`w-full transition-colors duration-300 ${
                selectedTeam === "ARZ" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
              } border border-gray-300 rounded-md shadow-sm hover:bg-green-500 hover:text-white`}
            >
              Argentina
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Quantia em Flow</FormLabel>
                  <FormControl>
                    <Uint256Input
                      placeholder="Digite a quantia"
                      value={field.value ? BigInt(field.value) : null}
                      onChange={(value) => field.onChange(value?.toString() || '')}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira a quantia que deseja apostar em tokens Flow.
                  </FormDescription>
                  <FormMessage>
                    {fieldState.error ? fieldState.error.message : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Probabilidade de Vitória</h3>
              <div className="space-y-2">
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  
                  <div 
                    className="h-full bg-green-500 transition-all duration-700 ease-in-out transform flex items-center justify-center text-xs text-white font-bold relative group"
                    style={{ 
                      width: `${probabilities.teamA}%`,
                      transform: selectedTeam === "BRZ" ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {probabilities.teamA > 10 && (
                      <span className="relative z-10 group-hover:scale-110 transition-transform">
                        {probabilities.teamA}%
                      </span>
                    )}
                    {selectedTeam === "BRZ" && (
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    )}
                  </div>
                  
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-700 ease-in-out flex items-center justify-center text-xs text-white font-bold relative group"
                    style={{ width: `${probabilities.draw}%` }}
                  >
                    {probabilities.draw > 10 && (
                      <span className="relative z-10 group-hover:scale-110 transition-transform">
                        {probabilities.draw}%
                      </span>
                    )}
                  </div>
                  
                  <div 
                    className="h-full bg-blue-500 transition-all duration-700 ease-in-out transform flex items-center justify-center text-xs text-white font-bold relative group"
                    style={{ 
                      width: `${probabilities.teamB}%`,
                      transform: selectedTeam === "ARZ" ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {probabilities.teamB > 10 && (
                      <span className="relative z-10 group-hover:scale-110 transition-transform">
                        {probabilities.teamB}%
                      </span>
                    )}
                    {selectedTeam === "ARZ" && (
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Brasil</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Empate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Argentina</span>
                  </div>
                </div>
              </div>
            </div>

            {form.watch("amount") && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Retorno Potencial</h3>
                <p>Valor Apostado: {form.watch("amount")} FLOW</p>
                <p>Odds: {getSelectedOdds()}x</p>
                <p className="text-green-600 font-bold">
                  Retorno Possível: {(Number(form.watch("amount")) * Number(getSelectedOdds())).toFixed(2)} FLOW
                </p>
              </div>
            )}

            <Button
              type="submit"
              className={`w-full bg-green-500 hover:bg-green-400 text-white transition-all duration-300 ${
                (isPlacingBet || isWaitingTransaction) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPlacingBet || isWaitingTransaction}
            >
              {isPlacingBet 
                ? "Confirmando aposta..." 
                : isWaitingTransaction 
                  ? "Processando transação..." 
                  : "Fazer Aposta"
              }
            </Button>
          </form>
        </Form>

        {getTransactionStatus()}
      </CardContent>
    </Card>
  );
}