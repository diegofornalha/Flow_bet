import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { betPatAbi } from "@/src/config/abis";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function BetPatTab() {
  const { data: volumeData } = useReadContract({
    address: CONTRACTS.BETPAT,
    abi: betPatAbi,
    functionName: "viewVolume",
  });

  const tokenA = volumeData?.[0] ? Number(volumeData[0]) : 0;
  const tokenB = volumeData?.[1] ? Number(volumeData[1]) : 0;
  const totalVolume = tokenA + tokenB;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Volume de Apostas (BetPat)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Brasil</p>
              <p className="text-lg font-bold">{tokenA} FLOW</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Argentina</p>
              <p className="text-lg font-bold">{tokenB} FLOW</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Volume Total</p>
            <p className="text-xl font-bold">{totalVolume} FLOW</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 