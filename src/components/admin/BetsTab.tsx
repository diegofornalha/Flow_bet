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
  FormDescription,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { generateMatchId } from "@/src/utils/generateId";

const betsAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "createMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "enable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "matchId", type: "bytes32" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "team", type: "bool" }
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

const createMatchSchema = z.object({
  matchId: z.string().startsWith("0x", "ID deve começar com 0x"),
});

type FormData = z.infer<typeof createMatchSchema>;

export function BetsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [matchNumber, setMatchNumber] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<{ id: string; isDisabled: boolean } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      matchId: "",
    },
  });

  const { data: matchesData } = useContractRead({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "disabled",
  });

  const { write: writeContract } = useContractWrite({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "createMatch",
  });

  // Criar nova partida
  const handleCreateMatch = async (values: FormData) => {
    try {
      setIsLoading(true);
      const hash = await writeContract({
        args: [values.matchId as `0x${string}`],
      });

      setStatus("Partida criada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao criar partida:", error);
      setStatus("Erro ao criar partida");
    } finally {
      setIsLoading(false);
    }
  };

  // Habilitar/Desabilitar partida
  const handleToggleMatch = async (matchId: string, disable: boolean) => {
    try {
      setIsLoading(true);
      await writeContract({
        args: [matchId as `0x${string}`, disable],
      });
      setStatus(`Partida ${disable ? "desabilitada" : "habilitada"} com sucesso!`);
    } catch (error) {
      console.error("Erro ao alterar status da partida:", error);
      setStatus("Erro ao alterar status da partida");
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
                name="matchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Partida</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="0x..."
                          className="font-mono"
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newId = generateMatchId(weekNumber, matchNumber);
                          form.setValue("matchId", newId);
                        }}
                      >
                        Gerar ID
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Criando..." : "Criar Partida"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Status Messages */}
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