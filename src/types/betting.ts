export interface Bet {
  id: string;
  amount: number;
  team: string;
  timestamp: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  odds: {
    teamA: number;
    teamB: number;
  };
  status: 'active' | 'disabled' | 'finished';
} 