'use client';

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { BettingModal } from "@/src/components/betting/BettingModal";
import { AdminModal } from "@/src/components/admin/AdminModal";
import { useAdmin } from "@/src/hooks/useAdmin";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Importação dinâmica do ConnectButton
const ConnectButtonDynamic = dynamic(
  () => import('@rainbow-me/rainbowkit').then(mod => mod.ConnectButton),
  { ssr: false }
);

const Home: NextPage = () => {
  const [isBettingModalOpen, setBettingModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAdmin = useAdmin();

  // Evitar erro de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image 
                src="/assets/images/flow.png" 
                alt="Flow Logo" 
                width={42} 
                height={42}
                priority
              />
              <h1 className="text-white text-xl font-bold">Flow Betting</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setBettingModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Faça sua Aposta
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => setIsAdminModalOpen(true)}
                >
                  Painel Admin
                </Button>
              )}
              <ConnectButtonDynamic />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Apostas Esportivas na Blockchain Flow
            </h1>
            <p className="text-xl text-gray-300">
              Faça suas apostas de forma segura e transparente
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      <BettingModal 
        isOpen={isBettingModalOpen} 
        onOpenChange={setBettingModalOpen}
      />
      <AdminModal 
        isOpen={isAdminModalOpen} 
        onOpenChange={setIsAdminModalOpen}
      />
    </div>
  );
};

export default Home;