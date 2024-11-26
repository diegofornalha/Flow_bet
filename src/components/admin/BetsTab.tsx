import { useReadContract, useWriteContract } from "wagmi";
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

const betsAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "matchId", type: "bytes32" }],
    name: "createMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
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
  matchId: z.string().min(1, "ID da partida é obrigatório"),
});

export function BetsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { writeContract } = useWriteContract();
  
  // Lê o status de disabled
  const { data: isDisabled } = useReadContract({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "disabled",
  });

  const form = useForm<z.infer<typeof createMatchSchema>>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      matchId: "",
    },
  });

  // Criar nova partida
  const handleCreateMatch = async (values: z.infer<typeof createMatchSchema>) => {
    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACTS.BETS,
        abi: betsAbi,
        functionName: "createMatch",
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

  // Habilitar/Desabilitar sistema
  const handleToggleSystem = async () => {
    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACTS.BETS,
        abi: betsAbi,
        functionName: isDisabled ? "enable" : "disable",
      });
      setStatus(`Sistema ${isDisabled ? "habilitado" : "desabilitado"} com sucesso!`);
    } catch (error) {
      console.error("Erro ao alterar status do sistema:", error);
      setStatus("Erro ao alterar status do sistema");
    } finally {
      setIsLoading(false);
    }
  };

  // Sacar fundos
  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACTS.BETS,
        abi: betsAbi,
        functionName: "withdraw",
      });
      setStatus("Saque realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao realizar saque:", error);
      setStatus("Erro ao realizar saque");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Sistema está: {isDisabled ? "Desabilitado" : "Habilitado"}</p>
            <Button 
              onClick={handleToggleSystem}
              disabled={isLoading}
            >
              {isDisabled ? "Habilitar Sistema" : "Desabilitar Sistema"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
                    <FormLabel>ID da Partida (bytes32)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Criar Partida
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Ações Administrativas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Administrativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full"
          >
            Sacar Fundos
          </Button>
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