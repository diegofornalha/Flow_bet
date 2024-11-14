// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Oracle Contract
/// @notice Este contrato fornece funcionalidades de oráculo para partidas.
abstract contract Oracle {
    /// @notice Enumeração dos possíveis resultados de uma partida.
    enum MatchOutcome {
        Pending, // A partida ainda não foi decidida
        Underway, // A partida começou e está em andamento
        Draw, // A partida terminou sem um vencedor claro
        Decided // Índice do participante que é o vencedor
    }

    /// @notice Retorna as partidas pendentes.
    /// @return Uma lista de IDs de partidas pendentes.
    function getPendingMatches() public view virtual returns (bytes32[] memory);

    /// @notice Retorna todas as partidas.
    /// @return Uma lista de IDs de todas as partidas.
    function getAllMatches() public view virtual returns (bytes32[] memory);

    /// @notice Verifica se uma partida existe.
    /// @param _matchId O ID da partida.
    /// @return Verdadeiro se a partida existir, falso caso contrário.
    function matchExists(bytes32 _matchId) public view virtual returns (bool);

    /// @notice Retorna os detalhes de uma partida.
    /// @param _matchId O ID da partida.
    /// @return id ID único da partida
    /// @return name Nome da partida
    /// @return participants Lista de participantes
    /// @return participantCount Número de participantes
    /// @return date Data da partida
    /// @return outcome Resultado atual da partida
    /// @return winner Índice do vencedor (-1 se não houver)
    function getMatch(
        bytes32 _matchId
    )
        public
        view
        virtual
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        );

    /// @notice Retorna a partida mais recente.
    /// @param _pending Indica se deve retornar a partida mais recente pendente.
    /// @return id ID único da partida
    /// @return name Nome da partida
    /// @return participants Lista de participantes
    /// @return participantCount Número de participantes
    /// @return date Data da partida
    /// @return outcome Resultado atual da partida
    /// @return winner Índice do vencedor
    function getMostRecentMatch(
        bool _pending
    )
        public
        view
        virtual
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        );

    /// @notice Testa a conexão com o oráculo.
    /// @return Verdadeiro se a conexão for bem-sucedida.
    function testConnection() public pure virtual returns (bool);

    /// @notice Adiciona dados de teste ao oráculo.
    function addTestData() public virtual;
}
