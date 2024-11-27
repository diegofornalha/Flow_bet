"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { BettingCard } from "./BettingCard";
import { useContractRead } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useInitializedMatches } from '@/src/hooks/useInitializedMatches';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BettingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const volumeAbi = [
  {
    inputs: [],
    name: "viewVolume",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  }
] as const;

export function BettingModal({ isOpen, onOpenChange }: BettingModalProps) {
  // Lê o volume total de apostas
  const { data: volumeData } = useContractRead({
    address: CONTRACTS.BETS,
    abi: volumeAbi,
    functionName: "viewVolume",
  });

  const tokenA = volumeData?.[0] ? Number(volumeData[0]) : 0;
  const tokenB = volumeData?.[1] ? Number(volumeData[1]) : 0;
  const totalTokens = tokenA + tokenB;

  // Calcula as odds
  const calculateOdds = () => {
    if (totalTokens === 0) return { oddsA: 2, oddsB: 2 };
    
    const oddsA = totalTokens / (tokenA || 1);
    const oddsB = totalTokens / (tokenB || 1);
    
    return {
      oddsA: Number(oddsA.toFixed(2)),
      oddsB: Number(oddsB.toFixed(2))
    };
  };

  const odds = calculateOdds();

  const { matches: initializedMatches, isLoading: isLoadingMatches } = useInitializedMatches();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold mb-4">
            Faça sua Aposta
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="brasil-argentina" className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-3">
            <TabsTrigger value="brasil-argentina">Brasil vs Argentina</TabsTrigger>
            <TabsTrigger value="em-breve">Em Breve</TabsTrigger>
            <TabsTrigger value="proximos">Próximos Jogos</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-1">
              {/* Tab Brasil vs Argentina */}
              <TabsContent value="brasil-argentina" className="mt-0">
                <BettingCard />
              </TabsContent>

              {/* Tab Em Breve */}
              <TabsContent value="em-breve" className="mt-0">
                <Card className="mb-6 relative">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Brasil</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Volume: {tokenA} FLOW</p>
                          <p className="text-sm text-gray-600">Odds: {odds.oddsA}x</p>
                          <p className="text-sm text-gray-600">
                            Participação: {totalTokens ? ((tokenA / totalTokens) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Argentina</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Volume: {tokenB} FLOW</p>
                          <p className="text-sm text-gray-600">Odds: {odds.oddsB}x</p>
                          <p className="text-sm text-gray-600">
                            Participação: {totalTokens ? ((tokenB / totalTokens) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Volume Total:</span> {totalTokens} FLOW
                      </p>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        size="lg"
                      >
                        APOSTAR
                      </Button>
                    </div>

                    {/* Overlay "Em Breve" */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white text-3xl font-bold tracking-wider animate-pulse">
                        EM BREVE
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Próximos Jogos */}
              <TabsContent value="proximos" className="mt-0">
                {isLoadingMatches ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-green-500 rounded-full border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-gray-500">Carregando partidas...</p>
                  </div>
                ) : initializedMatches?.length > 0 ? (
                  <div className="space-y-4">
                    {initializedMatches.map((match) => (
                      <Card key={match.id} className="relative overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">{match.name}</h3>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{match.participants}</p>
                            <p className="text-sm text-gray-500">
                              {format(match.date, "EEEE, d 'de' MMMM 'às' HH:mm", {
                                locale: ptBR
                              })}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              ID: {match.id.slice(0, 10)}...
                            </div>
                            <Button
                              onClick={() => {/* Implementar lógica de aposta */}}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Apostar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Nenhuma partida disponível no momento.
                  </div>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 