// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Oracle.sol";
import "./BetPayout.sol";
import "./Disableable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Bets Contract
/// @notice Este contrato permite criar partidas e apostar em times.
/// @dev Todas as funções críticas são protegidas por um modificador onlyOwner.
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

    /// @notice Construtor que define o dono do contrato.
    constructor(
        address _oracle,
        address _betPayout,
        address initialOwner
    ) Disableable(initialOwner) {
        oracle = Oracle(_oracle);
        betPayout = BetPayout(_betPayout);
    }

    /// @notice Cria uma nova partida com volumes iniciais para ambos os times.
    /// @param matchId O ID único da partida.
    function createMatch(bytes32 matchId) public onlyOwner {
        require(matches[matchId].totalPool == 0, "Match already exists");
        require(oracle.matchExists(matchId), "Match does not exist in Oracle");

        matches[matchId].teamAVolume = initialVolume;
        matches[matchId].teamBVolume = initialVolume;
        matches[matchId].totalPool = initialVolume * 2;
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

        if (team) {
            uint256 currentPrice = (matchDetails.teamAVolume * 1e18) /
                matchDetails.totalPool;
            uint256 shares = (uint256(amount) * 1e18) / currentPrice;

            matchDetails.teamAVolume += amount;
            matchDetails.totalPool += amount;
            userSharesA[matchId][msg.sender] += shares;
        } else {
            uint256 currentPrice = (matchDetails.teamBVolume * 1e18) /
                matchDetails.totalPool;
            uint256 shares = (uint256(amount) * 1e18) / currentPrice;

            matchDetails.teamBVolume += amount;
            matchDetails.totalPool += amount;
            userSharesB[matchId][msg.sender] += shares;
        }
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
