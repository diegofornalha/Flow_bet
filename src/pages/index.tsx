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

const Home: NextPage = () => {
  const [selectedGame, setSelectedGame] = useState<{
    game: string;
    team: string;
  } | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const isAdmin = useAdmin();

  // Dados estáticos para a primeira tela
  const copaAmericaGames = [
    {
      time: "6:30 AM",
      teams: [
        { name: "Brasil", record: "0-0" },
        { name: "Argentina", record: "0-0" }
      ],
    }
  ];

  const selectTeam = (game: string, team: string) => {
    setSelectedGame({ game, team });
  };

  return (
    <>
      <div style={{
        backgroundColor: "#f5f5f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "40px",
        position: "relative",
      }}>
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
                        backgroundColor: selectedGame?.team === team.name
                          ? "#d1fae5"
                          : "#f3f4f6",
                        padding: "16px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onClick={() => selectTeam(game.time, team.name)}
                    >
                      <Image
                        src={teamLogos[team.name]}
                        alt={`Logo ${team.name}`}
                        width={32}
                        height={32}
                      />
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1",
                        marginLeft: "12px",
                      }}>
                        <span style={{ fontWeight: "500" }}>{team.name}</span>
                        <span style={{ fontSize: "14px", color: "#666" }}>
                          {team.record}
                        </span>
                      </div>
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