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

const disableAbi = [
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
    inputs: [],
    name: "isDisabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

const ownershipSchema = z.object({
  newOwner: z.string().startsWith("0x", "Endereço deve começar com 0x"),
});

export function DisableTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Lê o status de disabled
  const { data: isDisabled } = useContractRead({
    address: CONTRACTS.DISABLEABLE,
    abi: disableAbi,
    functionName: "isDisabled",
  });

  // Hooks de escrita
  const { write: toggleSystem } = useContractWrite({
    address: CONTRACTS.DISABLEABLE,
    abi: disableAbi,
    functionName: isDisabled ? "enable" : "disable",
  });

  const { write: transferOwnership } = useContractWrite({
    address: CONTRACTS.DISABLEABLE,
    abi: disableAbi,
    functionName: "transferOwnership",
  });

  const { write: renounceOwnership } = useContractWrite({
    address: CONTRACTS.DISABLEABLE,
    abi: disableAbi,
    functionName: "renounceOwnership",
  });

  const form = useForm<z.infer<typeof ownershipSchema>>({
    resolver: zodResolver(ownershipSchema),
    defaultValues: {
      newOwner: "",
    },
  });

  // Habilitar/Desabilitar sistema
  const handleToggleSystem = async () => {
    try {
      setIsLoading(true);
      await toggleSystem();
      setStatus(`Sistema ${isDisabled ? "habilitado" : "desabilitado"} com sucesso!`);
    } catch (error) {
      console.error("Erro ao alterar status do sistema:", error);
      setStatus("Erro ao alterar status do sistema");
    } finally {
      setIsLoading(false);
    }
  };

  // Transferir propriedade
  const handleTransferOwnership = async (values: z.infer<typeof ownershipSchema>) => {
    try {
      setIsLoading(true);
      await transferOwnership({
        args: [values.newOwner as `0x${string}`],
      });
      setStatus("Propriedade transferida com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao transferir propriedade:", error);
      setStatus("Erro ao transferir propriedade");
    } finally {
      setIsLoading(false);
    }
  };

  // Renunciar propriedade
  const handleRenounceOwnership = async () => {
    try {
      setIsLoading(true);
      await renounceOwnership();
      setStatus("Propriedade renunciada com sucesso!");
    } catch (error) {
      console.error("Erro ao renunciar propriedade:", error);
      setStatus("Erro ao renunciar propriedade");
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
            <p className={`text-lg ${isDisabled ? "text-red-600" : "text-green-600"}`}>
              Sistema está: {isDisabled ? "Desabilitado" : "Habilitado"}
            </p>
            <Button 
              onClick={handleToggleSystem}
              disabled={isLoading}
              className={isDisabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              {isDisabled ? "Habilitar Sistema" : "Desabilitar Sistema"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Propriedade */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Propriedade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Transferir Propriedade */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Transferir Propriedade</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleTransferOwnership)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newOwner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Novo Proprietário</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0x..." 
                            {...field}
                            className="font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    Transferir Propriedade
                  </Button>
                </form>
              </Form>
            </div>

            {/* Renunciar Propriedade */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Renunciar Propriedade</h3>
              <div className="space-y-2">
                <p className="text-sm text-red-600">
                  Atenção: Esta ação é irreversível e você perderá todos os direitos de administrador.
                </p>
                <Button 
                  onClick={handleRenounceOwnership}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  Renunciar Propriedade
                </Button>
              </div>
            </div>
          </div>
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