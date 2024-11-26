import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAdmin } from "@/src/hooks/useAdmin";

interface HeaderProps {
  onOpenBetting: () => void;
  onOpenAdmin: () => void;
}

export function Header({ onOpenBetting, onOpenAdmin }: HeaderProps) {
  const isAdmin = useAdmin();

  return (
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
              onClick={onOpenBetting}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Faça sua Aposta
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={onOpenAdmin}>
                Painel Admin
              </Button>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
} 