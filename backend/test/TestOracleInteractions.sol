// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../contracts/Oracle.sol";

contract TestOracleInteractions {
    MyOracle public oracle;

    constructor() {
        oracle = new MyOracle();
    }

    // Função para obter todas as partidas
    function getAllMatchesTest() public view returns (bytes32[] memory) {
        return oracle.getAllMatches();
    }

    // Função para obter detalhes de uma partida específica
    function getMatchDetailsTest(
        bytes32 matchId
    )
        public
        view
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            Oracle.MatchOutcome outcome,
            int8 winner
        )
    {
        return oracle.getMatch(matchId);
    }

    // Função para obter a partida mais recente
    function getMostRecentMatchTest(
        bool pending
    )
        public
        view
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            Oracle.MatchOutcome outcome,
            int8 winner
        )
    {
        return oracle.getMostRecentMatch(pending);
    }

    // Função para testar a conexão
    function testConnectionTest() public view returns (bool) {
        return oracle.testConnection();
    }

    // Função para adicionar dados de teste
    function addTestDataTest() public {
        oracle.addTestData();
    }
}
