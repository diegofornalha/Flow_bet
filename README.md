# Sistema de Apostas em Blockchain

Este projeto implementa um sistema de apostas descentralizado usando contratos inteligentes na rede Ethereum.

## Estrutura do Projeto

```
backend/
├── contracts/
│   ├── BetPat.sol
│   ├── BetPayout.sol
│   ├── Bets.sol
│   ├── Disableable.sol
│   ├── Main.sol
│   ├── Math.sol
│   ├── Migrations.sol
│   ├── Oracle.sol
```

## Fluxo de Deploy

Para implantar corretamente os contratos, siga a ordem abaixo:

1. **Contratos Base**

   - Deploy do `Owner.sol` - Contrato base para controle de acesso
   - Deploy do `Disable.sol` - Adiciona funcionalidade de desativação

2. **Contratos de Infraestrutura**

   - Deploy do `Math.sol` - Biblioteca de operações matemáticas
   - Deploy do `Oracle.sol` - Implementação do Oracle para dados externos
   - Deploy do `Migrations.sol` (se estiver usando Truffle)

3. **Contratos de Negócio**

   - Deploy do `BetPayout.sol` - Gerencia pagamentos
   - Deploy do `BetPat.sol` - Gerencia apostas específicas
   - Deploy do `Bets.sol` - Contrato principal de apostas
     - Passar endereço do Oracle no construtor
     - Passar endereço do BetPayout no construtor

4. **Contrato Principal**
   - Deploy do `Main.sol`
     - Passar endereços dos contratos:
       - Bets
       - BetPat
       - BetPayout
       - Oracle

## Configuração Pós-Deploy

Após o deploy, execute as seguintes configurações:

1. Configure as permissões necessárias em cada contrato
2. Verifique se o Oracle está funcionando corretamente
3. Teste as integrações entre os contratos
4. Configure os eventos e callbacks necessários

## Exemplo de Script de Deploy

```

## Verificação do Deploy

Para verificar se o deploy foi bem-sucedido:

1. Confirme se todos os contratos foram deployados corretamente
2. Verifique se os endereços foram configurados corretamente
3. Execute os testes de integração
4. Verifique se as permissões estão corretas

## Notas Importantes

- Certifique-se de ter ETH suficiente para o deploy
- Mantenha os endereços dos contratos deployados em um lugar seguro
- Verifique o código dos contratos no Etherscan após o deploy
- Faça testes na testnet antes de fazer deploy na mainnet

## Segurança

- Todos os contratos herdam funcionalidades de controle de acesso do `Owner.sol`
- O sistema pode ser pausado através do contrato `Disable.sol`
- Operações matemáticas são protegidas pela biblioteca `Math.sol`
```
