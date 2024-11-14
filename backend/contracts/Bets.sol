// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Bets {
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

    address private immutable owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o dono pode chamar esta funcao");
        _;
    }

    function createMatch(bytes32 matchId) public {
        require(matches[matchId].totalPool == 0, "Match already exists");
        matches[matchId].teamAVolume = initialVolume;
        matches[matchId].teamBVolume = initialVolume;
        matches[matchId].totalPool = initialVolume * 2;
    }

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
            uint256 currentPrice = matchDetails.teamAVolume /
                matchDetails.totalPool;
            matchDetails.teamAVolume += amount;
            uint shares = amount / currentPrice;
            userSharesA[matchId][msg.sender] += shares;
        } else {
            uint256 currentPrice = matchDetails.teamBVolume /
                matchDetails.totalPool;
            matchDetails.teamBVolume += amount;
            uint shares = amount / currentPrice;
            userSharesB[matchId][msg.sender] += shares;
        }

        matchDetails.totalPool += amount;
    }

    function getTeamAPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamAVolume / matchDetails.totalPool;
    }

    function getTeamBPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamBVolume / matchDetails.totalPool;
    }

    function getTeamAPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamAVolume * 100) / matchDetails.totalPool;
    }

    function getTeamBPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamBVolume * 100) / matchDetails.totalPool;
    }

    function getTotalPool(bytes32 matchId) public view returns (uint) {
        return matches[matchId].totalPool;
    }

    function getTeamAVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamAVolume;
    }

    function getTeamBVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamBVolume;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nenhum saldo para sacar");

        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
