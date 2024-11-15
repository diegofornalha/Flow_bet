# Projeto de Apostas em Solidity

Este projeto consiste em um conjunto de contratos inteligentes desenvolvidos em Solidity, projetados para gerenciar apostas em eventos esportivos. As funcionalidades incluem a criação de partidas, a colocação de apostas e a gestão de pagamentos de forma eficiente e segura.

## Visão Geral

- **BetPat.sol**: Contrato responsável por permitir a visualização e a colocação de apostas em dois times distintos.
- **BetPayout.sol**: Gerencia o processo de pagamento das apostas e a distribuição dos ganhos de forma justa.
- **Bets.sol**: Habilita a criação de novas partidas e a realização de apostas nos times participantes.
- **Disable.sol**: Oferece funcionalidades para desativar e reativar contratos conforme necessário.
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
