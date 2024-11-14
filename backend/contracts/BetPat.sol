// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract BetPat {
    uint256 constant INITIAL_AMOUNT = 100;
    uint256 private amountA;
    uint256 private amountB;

    constructor() {
        amountA = INITIAL_AMOUNT;
        amountB = INITIAL_AMOUNT;
    }

    function getA() external view returns (uint256) {
        return amountA;
    }

    function getB() external view returns (uint256) {
        return amountB;
    }

    function viewVolume() external view returns (uint256, uint256) {
        return (amountA, amountB);
    }

    function placeBets(uint256 amount) external {
        require(amount > 0, "Quantidade deve ser maior que zero");
        amountA += amount;
    }

    function placeBetsJag(uint256 amount) external {
        require(amount > 0, "Quantidade deve ser maior que zero");
        amountB += amount;
    }
}
