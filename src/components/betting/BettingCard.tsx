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
  amount: z
    .string()
    .min(1, { message: "A string deve conter pelo menos 1 caractere." })
    .max(200)
    .refine((value) => !isNaN(Number(value))),
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

  const { 
    write: placeBet,
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
      placeBet?.({
        args: [BigInt(values.amount)],
      });
    } catch (error) {
      console.error("Erro ao enviar transação:", error);
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

  return (
    <Card className="w-full bg-white text-black shadow-lg">
      <CardHeader>
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
                    <Input
                      placeholder="Digite a quantia"
                      {...field}
                      className={`bg-gray-100 border-gray-300 text-black ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira a quantia que deseja apostar em tokens Flow.
                  </FormDescription>
                  <FormMessage>
                    {fieldState.error ? "Por favor, insira um número válido." : null}
                  </FormMessage>
                </FormItem>
              )}
            />

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
              {isPlacingBet || isWaitingTransaction ? "Processando..." : "Fazer Aposta"}
            </Button>
          </form>
        </Form>

        {getTransactionStatus()}
      </CardContent>
    </Card>
  );
}