# Projeto de Apostas em Solidity

Este projeto consiste em um conjunto de contratos inteligentes desenvolvidos em Solidity, projetados para gerenciar apostas em eventos esportivos. As funcionalidades incluem a criação de partidas, a colocação de apostas e a gestão de pagamentos de forma eficiente e segura.

## Visão Geral

- **BetPat.sol**: Contrato responsável por permitir a visualização e a colocação de apostas em dois times distintos.
- **BetPayout.sol**: Gerencia o processo de pagamento das apostas e a distribuição dos ganhos de forma justa.
- **Bets.sol**: Habilita a criação de novas partidas e a realização de apostas nos times participantes.
- **Disableable.sol**: Oferece funcionalidades para desativar e reativar contratos conforme necessário.
- **Oracle.sol**: Fornece funcionalidades de oráculo para obter informações atualizadas sobre as partidas.

## Pré-requisitos

- Node.js e npm: Necessários para o gerenciamento de pacotes e execução de scripts.
- Foundry: Utilizado para testes e desenvolvimento de contratos em Solidity.
- OpenZeppelin Contracts: Biblioteca de contratos padrão para Solidity.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências do Node.js:

   ```bash
   npm install
   ```

3. Instale o Foundry:
   Siga as instruções de instalação disponíveis no [site oficial do Foundry](https://getfoundry.sh/).

4. Instale os contratos da OpenZeppelin:
   ```bash
   npm install @openzeppelin/contracts
   ```

## Uso

### Testes

Para compilar os contratos, use o comando:

```bash
forge build
```

### Executar os testes

Para executar os testes, use o comando:

```bash
forge test
```

### Executar os testes de fuzzing

```bash
   forge test --match-test testFuzz
```

### Executar o relatório de cobertura

```bash
forge coverage
```

# Relatório detalhado de gas

forge test --gas-report

# Relatório de cobertura em formato LCOV

forge coverage --report lcov

# Relatório de cobertura em HTML

forge coverage --report lcov && genhtml lcov.info -o coverage

# Relatório com debug traces

forge test -vvvv

# Relatório de gas por função

forge snapshot

# Relatório de gas comparativo

forge snapshot --diff

# Relatório de tamanho dos contratos

forge build --sizes

# Relatório de dependências

forge tree

# Relatório de verificação de segurança

forge audit

# Filtrar por contrato específico

forge test --match-contract ContractName --gas-report

# Filtrar por teste específico

forge test --match-test testName --gas-report

# Relatório com limite de gas

forge test --gas-report --gas-limit 1000000

# Exportar relatório para arquivo

forge test --gas-report > gas-report.txt

# Relatório de cobertura por contrato

forge coverage --match-contract BetPayoutTest --report summary | grep BetPayout

# Executar teste com debug (pra saber o que está acontecendo)

forge test --match-contract BetPayoutTest -vvv
