// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Base Contract para Oráculo.
abstract contract Oracle {
    /// @notice Enumeração dos possíveis resultados de uma partida.
    enum MatchOutcome {
        Pending, // A partida ainda não foi decidida
        Underway, // A partida começou e está em andamento
        Draw, // A partida terminou sem um vencedor claro
        Decided // A partida terminou com um vencedor definido
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
    /// @return id ID único da partida.
    /// @return name Nome da partida.
    /// @return participants Lista de participantes.
    /// @return participantCount Número de participantes.
    /// @return date Data da partida.
    /// @return outcome Resultado atual da partida.
    /// @return winner Índice do vencedor (-1 se não houver).
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
    /// @return id ID único da partida.
    /// @return name Nome da partida.
    /// @return participants Lista de participantes.
    /// @return participantCount Número de participantes.
    /// @return date Data da partida.
    /// @return outcome Resultado atual da partida.
    /// @return winner Índice do vencedor.
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

    /// @notice Retorna data e hora formatados de uma partida
    /// @param matchId O ID da partida
    /// @return date Data em timestamp
    /// @return time Horário em segundos desde meia-noite
    /// @return formattedTime Horário formatado (HH:MM)
    /// @return timeZone Fuso horário
    function getMatchDateTime(
        bytes32 matchId
    )
        public
        view
        virtual
        returns (
            uint256 date,
            uint256 time,
            string memory formattedTime,
            string memory timeZone
        );
}

contract MyOracle is Oracle, Ownable {
    event MatchCreated(
        bytes32 indexed matchId,
        string championshipName,
        string teams,
        uint256 matchDate,
        uint256 matchTime
    );

    struct Match {
        bytes32 id;
        string championshipName; // Nome do campeonato
        string teamA; // Nome do Time A
        string teamB; // Nome do Time B
        uint8 participantCount;
        uint256 matchDate;
        uint256 matchTime;
        MatchOutcome outcome;
        int8 winner; // 0 para Time A, 1 para Time B, -1 para indefinido
    }

    mapping(bytes32 => Match) private matches;
    bytes32[] private matchIds;

    // Offset para Brasília (UTC-3) em segundos
    int256 constant BRASILIA_OFFSET = -3 * 3600; // -3 horas em segundos

    // Adicionar constante para data limite
    uint256 public constant SEASON_DEADLINE = 1735603200; // 31 de dezembro de 2024 00:00 UTC

    /// @notice Construtor que inicializa o contrato com dados de teste.
    constructor() Ownable(msg.sender) {}

    /// @notice Retorna as partidas pendentes.
    /// @return Uma lista de IDs de partidas pendentes.
    function getPendingMatches()
        public
        view
        override
        returns (bytes32[] memory)
    {
        bytes32[] memory pendingMatches = new bytes32[](matchIds.length);
        uint count = 0;
        for (uint i = 0; i < matchIds.length; i++) {
            if (matches[matchIds[i]].outcome == MatchOutcome.Pending) {
                pendingMatches[count] = matchIds[i];
                count++;
            }
        }
        return pendingMatches;
    }

    /// @notice Retorna todas as partidas.
    /// @return Uma lista de IDs de todas as partidas.
    function getAllMatches() public view override returns (bytes32[] memory) {
        return matchIds;
    }

    /// @notice Verifica se uma partida existe.
    /// @param _matchId O ID da partida.
    /// @return Verdadeiro se a partida existir, falso caso contrário.
    function matchExists(bytes32 _matchId) public view override returns (bool) {
        return matches[_matchId].id == _matchId;
    }

    /// @notice Retorna os detalhes de uma partida.
    /// @param _matchId O ID da partida.
    /// @return id ID único da partida.
    /// @return name Nome da partida.
    /// @return participants Lista de participantes.
    /// @return participantCount Número de participantes.
    /// @return date Data da partida.
    /// @return outcome Resultado atual da partida.
    /// @return winner Índice do vencedor (-1 se não houver).
    function getMatch(
        bytes32 _matchId
    )
        public
        view
        override
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        )
    {
        Match storage matchData = matches[_matchId];
        return (
            matchData.id,
            matchData.championshipName,
            string(abi.encodePacked(matchData.teamA, " vs ", matchData.teamB)),
            matchData.participantCount,
            matchData.matchDate,
            matchData.outcome,
            matchData.winner
        );
    }

    /// @notice Retorna a partida mais recente.
    /// @param _pending Indica se deve retornar a partida mais recente pendente.
    /// @return id ID único da partida.
    /// @return name Nome da partida.
    /// @return participants Lista de participantes.
    /// @return participantCount Número de participantes.
    /// @return date Data da partida.
    /// @return outcome Resultado atual da partida.
    /// @return winner Índice do vencedor.
    function getMostRecentMatch(
        bool _pending
    )
        public
        view
        override
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        )
    {
        for (uint i = matchIds.length; i > 0; i--) {
            if (
                !_pending ||
                matches[matchIds[i - 1]].outcome == MatchOutcome.Pending
            ) {
                return getMatch(matchIds[i - 1]);
            }
        }
        revert("No matches found");
    }

    /// @notice Testa a conexão com o oráculo.
    /// @return Verdadeiro se a conexão for bem-sucedida.
    function testConnection() public pure override returns (bool) {
        return true;
    }

    /// @notice Adiciona dados de teste ao oráculo.
    function addTestData() public override {
        // Função vazia para satisfazer o contrato base
    }

    /// @notice Cria uma nova partida real
    /// @param championshipName Nome do campeonato (ex: "Brasileirão Série A")
    /// @param teamA Time A (ex: "Fluminense")
    /// @param teamB Time B (ex: "Criciúma")
    /// @param matchDate Data da partida (timestamp)
    /// @param matchTime Horário em segundos (0-86400)
    function createMatch(
        string memory championshipName,
        string memory teamA, // Time A separado
        string memory teamB, // Time B separado
        uint256 matchDate,
        uint256 matchTime
    ) public onlyOwner {
        // Adiciona onlyOwner para segurança
        // Validações
        require(matchTime < 86400, "Horario invalido");
        require(bytes(championshipName).length > 0, "Nome do campeonato vazio");
        require(bytes(teamA).length > 0, "Nome do time A vazio");
        require(bytes(teamB).length > 0, "Nome do time B vazio");
        require(matchDate > block.timestamp, "Data deve ser futura");

        // Nova validação para data limite
        require(
            matchDate <= SEASON_DEADLINE,
            "Data alem do limite da temporada"
        );

        // Ajusta o timestamp para UTC
        uint256 utcMatchDate = matchDate - uint256(-BRASILIA_OFFSET);

        bytes32 matchId = keccak256(
            abi.encodePacked(
                championshipName,
                teamA,
                teamB,
                utcMatchDate,
                matchTime
            )
        );

        require(!matchExists(matchId), "Partida ja existe");

        // Cria a partida com times separados
        matches[matchId] = Match({
            id: matchId,
            championshipName: championshipName,
            teamA: teamA,
            teamB: teamB,
            participantCount: 2,
            matchDate: utcMatchDate,
            matchTime: matchTime,
            outcome: MatchOutcome.Pending,
            winner: -1
        });

        matchIds.push(matchId);

        emit MatchCreated(
            matchId,
            championshipName,
            string(abi.encodePacked(teamA, " vs ", teamB)),
            matchDate,
            matchTime
        );
    }

    function updateMatchStatus(
        bytes32 matchId,
        MatchOutcome newOutcome
    ) public onlyOwner {
        require(matchExists(matchId), "Match not found");
        matches[matchId].outcome = newOutcome;
    }

    // Função auxiliar para converter uint para string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Função auxiliar para converter timestamp em data legível
    function getMatchDateTime(
        bytes32 matchId
    )
        public
        view
        override
        returns (
            uint256 date,
            uint256 time,
            string memory formattedTime,
            string memory timeZone
        )
    {
        Match storage matchData = matches[matchId];

        date = matchData.matchDate + uint256(-BRASILIA_OFFSET);
        time = matchData.matchTime;

        uint256 hourValue = matchData.matchTime / 3600;
        uint256 minuteValue = (matchData.matchTime % 3600) / 60;

        formattedTime = string(
            abi.encodePacked(
                toString(hourValue),
                ":",
                minuteValue < 10 ? "0" : "",
                toString(minuteValue)
            )
        );

        timeZone = "BRT";
    }

    // Função auxiliar para obter os times separadamente
    function getTeams(
        bytes32 matchId
    ) public view returns (string memory teamA, string memory teamB) {
        require(matchExists(matchId), "Partida nao encontrada");
        Match storage matchData = matches[matchId];
        return (matchData.teamA, matchData.teamB);
    }
}
