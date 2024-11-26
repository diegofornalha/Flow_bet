import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { BetPatTab } from "./admin/BetPatTab";
import { OracleTab } from "./admin/OracleTab";
import { useAdmin } from "@/src/hooks/useAdmin";
import { useAccount } from "wagmi";
import { BetsTab } from "./admin/BetsTab";

interface AdminModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminModal({ isOpen, onOpenChange }: AdminModalProps) {
  const isAdmin = useAdmin();
  const { address } = useAccount();

  if (!isAdmin) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Acesso Negado
            </DialogTitle>
            <div className="mt-2">
              Apenas o administrador está autorizado a acessar este painel.
              {address && (
                <p className="mt-2 text-sm text-gray-500">
                  Seu endereço: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Painel Administrativo
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="bets" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bets">Bets</TabsTrigger>
            <TabsTrigger value="betpat">BetPat</TabsTrigger>
            <TabsTrigger value="oracle">Oracle</TabsTrigger>
            <TabsTrigger value="payout">Payout</TabsTrigger>
            <TabsTrigger value="disable">Sistema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bets">
            <BetsTab />
          </TabsContent>
          
          <TabsContent value="betpat">
            <BetPatTab />
          </TabsContent>
          
          <TabsContent value="oracle">
            <OracleTab />
          </TabsContent>
          
          {/* Adicione os outros TabsContent aqui */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 