import { useAdmin } from "@/src/hooks/useAdmin";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { betsAbi, oracleAbi, disableableAbi } from "@/src/config/abis";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function AdminPage() {
  const isAdmin = useAdmin();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Se não for admin, mostra mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600">
            Apenas o administrador está autorizado a acessar este painel.
          </p>
          {address && (
            <p className="text-sm text-gray-500">
              Seu endereço: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
          <Link href="/">
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Voltar para Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Leitura dos dados dos contratos
  const { data: volumeData } = useContractRead({
    address: CONTRACTS.BETS,
    abi: betsAbi,
    functionName: "viewVolume",
  });

  const { data: oracleStatus } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: disableableAbi,
    functionName: "isDisabled",
  });

  const { data: systemStatus } = useContractRead({
    address: CONTRACTS.DISABLEABLE,
    abi: disableableAbi,
    functionName: "isDisabled",
  });

  const tokenA = volumeData?.[0] ? Number(volumeData[0]) : 0;
  const tokenB = volumeData?.[1] ? Number(volumeData[1]) : 0;
  const totalVolume = tokenA + tokenB;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Link href="/">
          <Button variant="outline">Voltar para Página Inicial</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Oracle Ativo: {!oracleStatus ? "Sim" : "Não"}</p>
              <p>Sistema Desabilitado: {systemStatus ? "Sim" : "Não"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Volume de Apostas */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Time A: {tokenA} FLOW</p>
              <p>Time B: {tokenB} FLOW</p>
              <p className="font-bold">Total: {totalVolume} FLOW</p>
            </div>
          </CardContent>
        </Card>

        {/* Endereços dos Contratos */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>BETS: {CONTRACTS.BETS.slice(0, 8)}...</p>
              <p>ORACLE: {CONTRACTS.ORACLE.slice(0, 8)}...</p>
              <p>BETPAT: {CONTRACTS.BETPAT.slice(0, 8)}...</p>
              <p>BETPAYOUT: {CONTRACTS.BETPAYOUT.slice(0, 8)}...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Administrativas */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ações</h2>
        <div className="flex gap-4">
          <Button 
            onClick={() => {/* Implementar ação */}} 
            disabled={isLoading}
          >
            Pausar Sistema
          </Button>
          <Button 
            onClick={() => {/* Implementar ação */}} 
            disabled={isLoading}
          >
            Atualizar Oracle
          </Button>
          <Button 
            onClick={() => {/* Implementar ação */}} 
            disabled={isLoading}
          >
            Processar Pagamentos
          </Button>
        </div>
      </div>
    </div>
  );
} 