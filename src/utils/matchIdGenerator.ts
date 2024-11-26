export function generateMatchId(weekNumber: number, matchNumber: number): `0x${string}` {
  // Combina o número da semana e o número da partida em uma string
  const combined = `${weekNumber}${matchNumber}${Date.now()}`;
  
  // Converte para bytes32 (preenche com zeros à esquerda até ter 64 caracteres)
  const paddedHex = combined.padStart(64, '0');
  
  return `0x${paddedHex}` as `0x${string}`;
} 