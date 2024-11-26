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

const betPayoutAbi = [
  {
    inputs: [],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "payOutWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "pendingPayouts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "house",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

const payoutSchema = z.object({
  userAddress: z.string().startsWith("0x"),
  amount: z.string().min(1).refine((val) => !isNaN(Number(val)), {
    message: "Deve ser um número válido",
  }),
});

const checkPayoutSchema = z.object({
  userAddress: z.string().startsWith("0x"),
});

export function BetPayoutTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [pendingAmount, setPendingAmount] = useState<string | null>(null);

  // Hooks de escrita
  const { write: payoutWrite } = useContractWrite({
    address: CONTRACTS.BETPAYOUT,
    abi: betPayoutAbi,
    functionName: "payOutWinnings",
  });

  // Form para pagamento
  const payoutForm = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      userAddress: "",
      amount: "",
    },
  });

  // Form para verificação
  const checkForm = useForm<z.infer<typeof checkPayoutSchema>>({
    resolver: zodResolver(checkPayoutSchema),
    defaultValues: {
      userAddress: "",
    },
  });

  // Pagar ganhos
  const handlePayout = async (values: z.infer<typeof payoutSchema>) => {
    try {
      setIsLoading(true);
      await payoutWrite({
        args: [values.userAddress as `0x${string}`, BigInt(values.amount)],
      });
      setStatus("Pagamento realizado com sucesso!");
      payoutForm.reset();
    } catch (error) {
      console.error("Erro ao realizar pagamento:", error);
      setStatus("Erro ao realizar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar pagamentos pendentes
  const handleCheckPending = async (values: z.infer<typeof checkPayoutSchema>) => {
    try {
      const { data } = await useContractRead({
        address: CONTRACTS.BETPAYOUT,
        abi: betPayoutAbi,
        functionName: "pendingPayouts",
        args: [values.userAddress as `0x${string}`],
      });
      
      setPendingAmount(data ? data.toString() : "0");
      setStatus("Consulta realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao consultar pagamentos pendentes:", error);
      setStatus("Erro ao consultar pagamentos pendentes");
    }
  };

  return (
    <div className="space-y-6">
      {/* Realizar Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Realizar Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...payoutForm}>
            <form onSubmit={payoutForm.handleSubmit(handlePayout)} className="space-y-4">
              <FormField
                control={payoutForm.control}
                name="userAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={payoutForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (FLOW)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Realizar Pagamento
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Verificar Pagamentos Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle>Verificar Pagamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...checkForm}>
            <form onSubmit={checkForm.handleSubmit(handleCheckPending)} className="space-y-4">
              <FormField
                control={checkForm.control}
                name="userAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Verificar Pendências
              </Button>
            </form>
          </Form>

          {pendingAmount && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-semibold">Valor Pendente:</p>
              <p className="text-lg">{pendingAmount} FLOW</p>
            </div>
          )}
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