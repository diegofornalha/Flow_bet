export function generateMatchId(weekNumber: number, matchNumber: number): `0x${string}` {
  // Função para converter string para bytes32
  function stringToBytes32(str: string): `0x${string}` {
    // Converte a string para bytes e preenche com zeros
    const bytes = new TextEncoder().encode(str);
    const paddedBytes = new Uint8Array(32);
    paddedBytes.set(bytes);
    
    // Converte para hex
    const hex = Array.from(paddedBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return `0x${hex}` as `0x${string}`;
  }

  // Cria uma string única combinando semana, partida e timestamp
  const uniqueString = `W${weekNumber}M${matchNumber}T${Date.now()}`;
  return stringToBytes32(uniqueString);
} 