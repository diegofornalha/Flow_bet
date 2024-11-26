import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useState } from "react";
import { useReadContract } from "wagmi";
import Image, { StaticImageData } from "next/image";
import { BettingCard } from "@/src/components/BettingCard"; // Importando o BettingCard
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

import flow from "@/src/public/assets/flow.png";
import brasilLogo from "@/src/public/assets/brasil.png";
import argentinaLogo from "@/src/public/assets/argentina.png";
import { useAdmin } from "@/src/hooks/useAdmin";
import { AdminModal } from "@/src/components/AdminModal";

// Object mapping team names to their logo URLs
const teamLogos: Record<string, StaticImageData> = {
  Brasil: brasilLogo,
  Argentina: argentinaLogo,
};

// Hook personalizado para lógica de contrato
function useNFLGames() {
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

  const { data } = useReadContract({
    address: "0xe652bC36eb4D8F40F245ba9Aa3282CeB1dDe7796",
    abi,
    functionName: "viewVolume",
    args: [],
  });

  const tokenA = data?.[0] ? parseInt(data[0].toString()) : 0;
  const tokenB = data?.[1] ? parseInt(data[1].toString()) : 0;
  const total = tokenA + tokenB;
  const priceA = total > 0 ? 100 * (tokenA / total) : 0;
  const priceB = total > 0 ? 100 * (tokenB / total) : 0;

  return { total, priceA, priceB };
}

const Home: NextPage = () => {
  const { total, priceA, priceB } = useNFLGames();
  const [selectedGame, setSelectedGame] = useState<{
    game: string;
    team: string;
  } | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const isAdmin = useAdmin();

  const copaAmericaGames = [
    {
      time: "6:30 AM",
      volume: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      teams: [
        { name: "Brasil", record: "0-0", price: priceA },
        { name: "Argentina", record: "0-0", price: priceB },
      ],
    },
    // ... other games if needed ...
  ];

  const selectTeam = (game: string, team: string) => {
    setSelectedGame({ game, team });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f5f5f7",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Cabeçalho com Logo e Botões */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "40px",
          padding: "0 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image src={flow} alt="Logo Flow" width={42} height={42} />
            <h1>FlowBets</h1>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Button 
              variant="outline"
              onClick={() => setIsAdminModalOpen(true)}
            >
              Painel Admin
            </Button>
            <ConnectButton />
          </div>
        </div>

        {/* Container Principal */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}>
          {/* Coluna dos Jogos */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              flex: "2",
            }}
          >
            <h2 style={{ 
              marginBottom: "24px",
              fontSize: "24px",
              color: "#1a1a1a",
            }}>
              Jogos Copa America - Semana 1
            </h2>

            {copaAmericaGames.map((game, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "24px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "20px",
                }}
              >
                {/* Horário e Volume */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    padding: "0 12px",
                    color: "#666",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <span>Horário: {game.time}</span>
                  <span>Volume: {game.volume} FLOW</span>
                </div>

                {/* Times */}
                <div style={{ 
                  display: "flex",
                  gap: "12px",
                  marginTop: "12px",
                }}>
                  {game.teams.map((team, teamIndex) => (
                    <div
                      key={teamIndex}
                      style={{
                        flex: "1",
                        backgroundColor: selectedGame?.game === game.time &&
                          selectedGame?.team === team.name
                          ? "#d1fae5"
                          : "#f3f4f6",
                        color: selectedGame?.game === game.time &&
                          selectedGame?.team === team.name
                          ? "#065f46"
                          : "#1f2937",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={() => selectTeam(game.time, team.name)}
                    >
                      <Image
                        src={teamLogos[team.name]}
                        alt={`Logo ${team.name}`}
                        width={32}
                        height={32}
                        style={{ marginRight: "12px" }}
                      />
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1",
                        overflow: "hidden", // Garante que o texto não saia do botão
                      }}>
                        <span style={{ fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.name}</span>
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          Histórico: {team.record}
                        </span>
                      </div>
                      <span style={{ 
                        fontWeight: "bold",
                        fontSize: "18px" 
                      }}>
                        ${isNaN(team.price) ? "0.00" : team.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BettingCard */}
          <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
            <BettingCard />
          </div>
        </div>
      </div>

      <AdminModal 
        isOpen={isAdminModalOpen} 
        onOpenChange={setIsAdminModalOpen}
      />
    </>
  );
}

export default Home;