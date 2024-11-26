import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACTS } from "@/src/config/contracts";
import { oracleAbi } from "@/src/config/abis";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

export function OracleTab() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: isActive } = useContractRead({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "isActive",
  });

  const { write: activateOracle } = useContractWrite({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "activate",
  });

  const { write: deactivateOracle } = useContractWrite({
    address: CONTRACTS.ORACLE,
    abi: oracleAbi,
    functionName: "deactivate",
  });

  const handleActivate = async () => {
    try {
      setIsLoading(true);
      await activateOracle();
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setIsLoading(true);
      await deactivateOracle();
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Status do Oracle</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: {isActive ? "Ativo" : "Inativo"}</p>
          <Button 
            onClick={isActive ? handleDeactivate : handleActivate}
            disabled={isLoading}
            className="mt-4"
          >
            {isActive ? "Desativar Oracle" : "Ativar Oracle"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 