// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
}

contract MyOracle is Oracle {
    struct Match {
        bytes32 id;
        string name;            // Nome do campeonato (ex: "Brasileirão Série A")
        string participants;    // Times (ex: "Fluminense vs Criciúma")
        uint8 participantCount;
        uint256 matchDate;     // Data da partida (timestamp)
        uint256 matchTime;     // Horário em segundos desde meia-noite (0-86400)
        MatchOutcome outcome;
        int8 winner;
    }

    mapping(bytes32 => Match) private matches;
    bytes32[] private matchIds;

    // Offset para Brasília (UTC-3) em segundos
    int256 constant BRASILIA_OFFSET = -3 * 3600; // -3 horas em segundos
    
    /// @notice Construtor que inicializa o contrato com dados de teste.
    constructor() {
        addTestData();
    }

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
            matchData.name,
            matchData.participants,
            matchData.participantCount,
            matchData.date,
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
        createMatch(
            "Brasileirão Série A",
            "São Paulo vs Grêmio",
            block.timestamp,
            68400  // 19:00
        );
    }

    /// @notice Cria uma nova partida com suporte a caracteres Unicode.
    /// @param championshipName Nome do campeonato (pode conter acentos).
    /// @param teams Lista de times (pode conter acentos).
    /// @param matchDate Timestamp UTC.
    /// @param matchTime Horário local em segundos.
    function createMatch(
        string memory championshipName,
        string memory teams,
        uint256 matchDate,
        uint256 matchTime
    ) public {
        require(matchTime < 86400, "Horario invalido");
        require(bytes(championshipName).length > 0, "Nome do campeonato vazio");
        require(bytes(teams).length > 0, "Nome dos times vazio");
        
        // Ajusta o timestamp para UTC
        uint256 utcMatchDate = matchDate - uint256(-BRASILIA_OFFSET);
        
        // O keccak256 já suporta naturalmente strings UTF-8
        bytes32 matchId = keccak256(
            abi.encodePacked(championshipName, teams, utcMatchDate, matchTime)
        );

        matches[matchId] = Match({
            id: matchId,
            name: championshipName,  // Strings UTF-8 são suportadas nativamente
            participants: teams,     // Suporta acentos e caracteres especiais
            participantCount: 2,
            matchDate: utcMatchDate,
            matchTime: matchTime,
            outcome: MatchOutcome.Pending,
            winner: -1
        });
        matchIds.push(matchId);
    }

    function updateMatchStatus(
        bytes32 matchId,
        MatchOutcome newOutcome
    ) public onlyOwner {
        require(matchExists(matchId), "Match not found");
        matches[matchId].outcome = newOutcome;
    }

    // Função auxiliar para converter timestamp em data legível
    function getMatchDateTime(bytes32 matchId) 
        public 
        view 
        returns (
            uint256 date,    // timestamp da data
            uint256 time,    // segundos desde meia-noite
            string memory formattedTime,  // horário formatado (HH:MM)
            string memory timeZone        // identificador do fuso horário
        ) 
    {
        Match storage matchData = matches[matchId];
        
        // Ajusta o timestamp de volta para horário de Brasília
        date = matchData.matchDate + uint256(-BRASILIA_OFFSET);
        time = matchData.matchTime;
        
        // Calcula horas e minutos
        uint256 hours = matchData.matchTime / 3600;
        uint256 minutes = (matchData.matchTime % 3600) / 60;
        
        // Formata o horário (HH:MM)
        formattedTime = string(
            abi.encodePacked(
                toString(hours),
                ":",
                minutes < 10 ? "0" : "",
                toString(minutes)
            )
        );

        timeZone = "BRT"; // Brasilia Time
    }
}
