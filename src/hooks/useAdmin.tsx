import { useAccount } from "wagmi";

const ADMIN_ADDRESS = "0x8F0e2980701E313665cB40460d552d7Ad7f1BBB8";

export function useAdmin() {
  const { address } = useAccount();
  
  return address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
} 