// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Oracle.sol";
import "./BetPayout.sol";
import "./Disableable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Bets Contract
/// @notice Este contrato permite criar partidas e apostar em times.
contract Bets is Disableable {
    using Math for uint256;
    Oracle private oracle;
    BetPayout private betPayout;

    struct Match {
        uint teamAVolume;
        uint teamBVolume;
        uint totalPool;
    }

    mapping(bytes32 => Match) public matches;
    uint256 public constant MINIMUM_BET = 1e12;

    mapping(bytes32 => mapping(address => uint)) public userSharesA;
    mapping(bytes32 => mapping(address => uint)) public userSharesB;

    uint public constant initialVolume = 100 wei;

    // Eventos
    event MatchInitialized(
        bytes32 indexed matchId,
        uint initialVolume,
        string championshipName,
        string teams
    );

    event BetPlaced(
        bytes32 indexed matchId,
        address indexed bettor,
        bool teamA,
        uint amount,
        uint shares,
        string teams
    );

    constructor(
        address _oracle,
        address _betPayout,
        address initialOwner
    ) Disableable(initialOwner) {
        oracle = Oracle(_oracle);
        betPayout = BetPayout(_betPayout);
    }

    /// @notice Inicializa uma partida no sistema de apostas.
    /// @param matchId O ID da partida.
    function initializeMatch(bytes32 matchId) public onlyOwner {
        require(oracle.matchExists(matchId), "Match does not exist in Oracle");
        require(matches[matchId].totalPool == 0, "Match already exists");

        // Obtém informações da partida do Oracle
        (
            ,
            // bytes32 id
            string memory championshipName,
            string memory teams, // uint8 participantCount
            // uint date
            ,
            ,
            Oracle.MatchOutcome outcome,

        ) = // int8 winner
            oracle.getMatch(matchId);

        require(
            outcome == Oracle.MatchOutcome.Pending,
            "Match must be in Pending state"
        );

        // Inicializa volumes
        matches[matchId].teamAVolume = initialVolume;
        matches[matchId].teamBVolume = initialVolume;
        matches[matchId].totalPool = initialVolume * 2;

        // Emite evento com informações detalhadas
        emit MatchInitialized(matchId, initialVolume, championshipName, teams);
    }

    /// @notice Coloca uma aposta em um time específico.
    /// @param matchId O ID da partida.
    /// @param amount A quantidade apostada.
    /// @param team Um booleano indicando o time (true para Time A, false para Time B).
    function placeBet(
        bytes32 matchId,
        uint32 amount,
        bool team
    ) public payable {
        require(msg.value >= MINIMUM_BET, "Valor menor que o minimo permitido");
        require(amount > 0, "Quantidade deve ser maior que zero");

        Match storage matchDetails = matches[matchId];
        require(matchDetails.totalPool > 0, "Match not found");

        // Verifica status da partida no Oracle
        (
            ,
            ,
            // bytes32 id
            // string memory name
            string memory teams, // uint8 participantCount
            // uint date
            ,
            ,
            Oracle.MatchOutcome outcome,

        ) = // int8 winner
            oracle.getMatch(matchId);

        require(
            outcome == Oracle.MatchOutcome.Pending,
            "Match not available for betting"
        );

        // Verifica se a partida já começou
        (uint256 matchDate, , , ) = oracle.getMatchDateTime(matchId);
        require(block.timestamp < matchDate, "Match already started");

        uint256 shares;
        if (team) {
            uint256 currentPrice = (matchDetails.teamAVolume * 1e18) /
                matchDetails.totalPool;
            shares = (uint256(amount) * 1e18) / currentPrice;

            matchDetails.teamAVolume += amount;
            matchDetails.totalPool += amount;
            userSharesA[matchId][msg.sender] += shares;
        } else {
            uint256 currentPrice = (matchDetails.teamBVolume * 1e18) /
                matchDetails.totalPool;
            shares = (uint256(amount) * 1e18) / currentPrice;

            matchDetails.teamBVolume += amount;
            matchDetails.totalPool += amount;
            userSharesB[matchId][msg.sender] += shares;
        }

        // Emite evento com informações detalhadas
        emit BetPlaced(matchId, msg.sender, team, amount, shares, teams);
    }

    /// @notice Retorna o preço atual das ações para o Time A.
    /// @param matchId O ID da partida.
    /// @return O preço das ações para o Time A.
    function getTeamAPrice(bytes32 matchId) public view returns (uint256) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamAVolume * 1e18) / matchDetails.totalPool;
    }

    /// @notice Retorna o preço atual das ações para o Time B.
    /// @param matchId O ID da partida.
    /// @return O preço das ações para o Time B.
    function getTeamBPrice(bytes32 matchId) public view returns (uint256) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamBVolume * 1e18) / matchDetails.totalPool;
    }

    /// @notice Retorna a porcentagem do volume total para o Time A.
    /// @param matchId O ID da partida.
    /// @return A porcentagem do volume total para o Time A.
    function getTeamAPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamAVolume * 100) / matchDetails.totalPool;
    }

    /// @notice Retorna a porcentagem do volume total para o Time B.
    /// @param matchId O ID da partida.
    /// @return A porcentagem do volume total para o Time B.
    function getTeamBPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamBVolume * 100) / matchDetails.totalPool;
    }

    /// @notice Retorna o pool total para uma partida.
    /// @param matchId O ID da partida.
    /// @return O pool total para a partida.
    function getTotalPool(bytes32 matchId) public view returns (uint) {
        return matches[matchId].totalPool;
    }

    /// @notice Retorna o volume atual para o Time A.
    /// @param matchId O ID da partida.
    /// @return O volume para o Time A.
    function getTeamAVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamAVolume;
    }

    /// @notice Retorna o volume atual para o Time B.
    /// @param matchId O ID da partida.
    /// @return O volume para o Time B.
    function getTeamBVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamBVolume;
    }

    /// @notice Permite que o dono retire o saldo do contrato.
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nenhum saldo para sacar");

        payable(owner()).transfer(balance);
    }

    /// @notice Retorna o saldo atual do contrato.
    /// @return O saldo do contrato.
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
