import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  onOpenBetting?: () => void;
  onOpenAdmin?: () => void;
}

export function Layout({ children, onOpenBetting, onOpenAdmin }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Header 
        onOpenBetting={onOpenBetting || (() => {})} 
        onOpenAdmin={onOpenAdmin || (() => {})} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 