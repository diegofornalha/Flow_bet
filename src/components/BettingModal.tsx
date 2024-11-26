import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { BettingCard } from "./BettingCard";

interface BettingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BettingModal({ isOpen, onOpenChange }: BettingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Faça sua Aposta
          </DialogTitle>
        </DialogHeader>
        <BettingCard />
      </DialogContent>
    </Dialog>
  );
} 