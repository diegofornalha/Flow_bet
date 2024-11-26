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
  FormDescription,
} from "../ui/form";

const tokenAbi = [
  {
    inputs: [{ internalType: "address", name: "tokenAddress", type: "address" }],
    name: "setPaymentToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPaymentToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

const tokenSchema = z.object({
  tokenAddress: z.string().startsWith("0x", "Endereço deve começar com 0x"),
});

export function TokenTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { writeContract } = useWriteContract();

  // Lê o token atual
  const { data: currentToken } = useReadContract({
    address: CONTRACTS.DISABLEABLE,
    abi: tokenAbi,
    functionName: "getPaymentToken",
  });

  const form = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      tokenAddress: "",
    },
  });

  // Alterar token de pagamento
  const handleChangeToken = async (values: z.infer<typeof tokenSchema>) => {
    try {
      setIsLoading(true);
      await writeContract({
        address: CONTRACTS.DISABLEABLE,
        abi: tokenAbi,
        functionName: "setPaymentToken",
        args: [values.tokenAddress as `0x${string}`],
      });
      setStatus("Token de pagamento alterado com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao alterar token:", error);
      setStatus("Erro ao alterar token de pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Atual */}
      <Card>
        <CardHeader>
          <CardTitle>Token de Pagamento Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-mono text-sm break-all">
              {currentToken || "Token nativo (FLOW)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alterar Token */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Token de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangeToken)} className="space-y-4">
              <FormField
                control={form.control}
                name="tokenAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do Novo Token</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0x..." 
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormDescription>
                      Insira o endereço do contrato do token ERC20 que deseja usar para apostas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Alterando..." : "Alterar Token"}
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