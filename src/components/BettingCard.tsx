"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReadContract, useWriteContract } from "wagmi";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import brasilLogo from "@/src/public/assets/brasil.png";
import argentinaLogo from "@/src/public/assets/argentina.png";

const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getB",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "placeBets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "placeBetsJag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "A string deve conter pelo menos 1 caractere." })
    .max(200)
    .refine((value) => !isNaN(Number(value))),
});

export function BettingCard() {
  const { data } = useReadContract({
    address: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
    abi,
    functionName: "viewVolume",
    args: [],
  });

  const tokenA = data?.[0] ? parseInt(data[0].toString()) : 0;
  const tokenB = data?.[1] ? parseInt(data[1].toString()) : 0;
  const priceA = 100 * (tokenA / (tokenA + tokenB));
  const priceB = 100 * (tokenB / (tokenA + tokenB));

  const { writeContract } = useWriteContract();
  const [selectedTeam, setSelectedTeam] = useState<string>("BRZ");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(true);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setTransactionStatus(null); // Reset status before new transaction
    try {
      const tx = await writeContract({
        address: "0x6224f3e0c3deDB6Da90A9545A9528cbed5DD7E53",
        abi: abi,
        functionName: "placeBets",
        args: [BigInt(values.amount)],
      });

      if (tx) { // Verifique se tx não é undefined
        // Aguardar a confirmação da transação
        await tx.wait();
        setTransactionStatus("Aposta enviada com sucesso!");
      } else {
        throw new Error("Transação não foi criada.");
      }
    } catch (error) {
      console.error("Erro ao executar o contrato:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectTeam = (team: string) => {
    setSelectedTeam(team);
  };

  const calculateShares = (amount: number, price: number) => {
    return price > 0 ? (amount * 100) / price : 0;
  };

  const calculatePotentialReturn = (amount: number, price: number) => {
    if (price > 0) {
      const shares = calculateShares(amount, price);
      const potentialReturn = shares - amount;
      return {
        value: shares.toFixed(2),
        percentage: ((potentialReturn / amount) * 100).toFixed(2),
      };
    }
    return { value: "0.00", percentage: "0.00" };
  };

  const getSelectedPrice = () => {
    return selectedTeam === "BRZ" ? priceA : selectedTeam === "ARZ" ? priceB : 0;
  };

  return (
    <Card className="w-[300px] bg-white text-black shadow-lg fixed right-5 bottom-5 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Boa Sorte</CardTitle>
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-sm bg-green-500 hover:bg-green-400 text-white transition-all duration-300"
          >
            {isMinimized ? "Expandir" : "Minimizar"}
          </Button>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <Image
                src={brasilLogo}
                alt="Logo Brasil"
                width={24}
                height={24}
                className="mr-2"
              />
              <Button
                onClick={() => selectTeam("BRZ")}
                className={`w-[60%] transition-colors duration-300 ${
                  selectedTeam === "BRZ" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
                } border border-gray-300 rounded-md shadow-sm hover:bg-green-500 hover:text-white flex items-center justify-center`}
              >
                <span className="block text-sm font-semibold">${priceA.toFixed(2)}</span>
              </Button>
            </div>
            <div className="flex items-center">
              <Image
                src={argentinaLogo}
                alt="Logo Argentina"
                width={24}
                height={24}
                className="mr-2"
              />
              <Button
                onClick={() => selectTeam("ARZ")}
                className={`w-[60%] transition-colors duration-300 ${
                  selectedTeam === "ARZ" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
                } border border-gray-300 rounded-md shadow-sm hover:bg-green-500 hover:text-white flex items-center justify-center`}
              >
                <span className="block text-sm font-semibold">${priceB.toFixed(2)}</span>
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
            </form>
          </Form>

          <div className="space-y-2">
            <p>Preço Médio: ${getSelectedPrice().toFixed(2)}</p>
            <p>
              Ações:{" "}
              {calculateShares(Number(form.watch("amount") || 0), getSelectedPrice()).toFixed(2)}
            </p>
            {Number(form.watch("amount") || 0) > 0 && (
              <p>
                Retorno Potencial: ${""}
                {calculatePotentialReturn(Number(form.watch("amount") || 0), getSelectedPrice()).value}
                {" ("}
                <span className="text-green-600">
                  {calculatePotentialReturn(Number(form.watch("amount") || 0), getSelectedPrice()).percentage}
                </span>
                {"%) "}
              </p>
            )}
          </div>

          <Button
            onClick={() => onSubmit({ amount: form.getValues("amount") })}
            className={`w-full bg-green-500 hover:bg-green-400 text-white transition-all duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Fazer Aposta"}
          </Button>

          {transactionStatus && (
            <p className="mt-4 text-center text-sm text-gray-700">{transactionStatus}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
