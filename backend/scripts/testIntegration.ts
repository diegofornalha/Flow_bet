import { createPublicClient, http, createWalletClient } from 'viem'
import { goerli } from 'viem/chains' // ajuste para sua testnet

// Importe os ABIs e endereços
import { CONTRACTS } from '../../src/lib/contracts'
import type { Abi } from 'viem'

// Importe os ABIs como tipos
const BetsABI = {
  abi: [] as Abi // Você precisará importar o ABI real aqui
}

const OracleABI = {
  abi: [] as Abi // Você precisará importar o ABI real aqui
}

async function testIntegration() {
  const client = createPublicClient({
    chain: goerli,
    transport: http()
  })

  try {
    // Exemplo de leitura do contrato
    const result = await client.readContract({
      address: CONTRACTS.BETS,
      abi: BetsABI.abi,
      functionName: 'seuMetodo'
    })

    console.log('Testes de integração concluídos com sucesso')
  } catch (error) {
    console.error('Erro nos testes:', error)
  }
}

testIntegration() 