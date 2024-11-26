import { Button } from "../ui/button";
import Image from "next/image";

interface HeroProps {
  onOpenBetting: () => void;
}

export function Hero({ onOpenBetting }: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Apostas Esportivas na Blockchain Flow
          </h1>
          <p className="text-xl text-gray-300">
            Faça suas apostas de forma segura e transparente usando a tecnologia blockchain.
            Aposte em seus times favoritos e acompanhe tudo em tempo real.
          </p>
          <div className="flex space-x-4">
            <Button
              size="lg"
              onClick={onOpenBetting}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Começar a Apostar
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Como Funciona
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <div className="relative w-[500px] h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/assets/images/hero-betting.jpg"
              alt="Betting Hero"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 