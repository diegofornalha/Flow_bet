// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title BetPat Contract
/// @notice Este contrato permite visualizar e colocar apostas em dois times.
contract BetPat {
    uint256 constant INITIAL_AMOUNT = 100;
    uint256 private amountA;
    uint256 private amountB;

    /// @notice Construtor que inicializa os montantes para ambos os times.
    constructor() {
        amountA = INITIAL_AMOUNT;
        amountB = INITIAL_AMOUNT;
    }

    /// @notice Retorna o montante atual para o Time A.
    /// @return O montante para o Time A.
    function getA() external view returns (uint256) {
        return amountA;
    }

    /// @notice Retorna o montante atual para o Time B.
    /// @return O montante para o Time B.
    function getB() external view returns (uint256) {
        return amountB;
    }

    /// @notice Retorna os volumes atuais para ambos os times.
    /// @return Os volumes para o Time A e Time B.
    function viewVolume() external view returns (uint256, uint256) {
        return (amountA, amountB);
    }

    /// @notice Adiciona uma aposta ao Time A.
    /// @param amount A quantidade a ser adicionada.
    function placeBets(uint256 amount) external {
        require(amount > 0, "Quantidade deve ser maior que zero");
        amountA += amount;
    }

    /// @notice Adiciona uma aposta ao Time B.
    /// @param amount A quantidade a ser adicionada.
    function placeBetsJag(uint256 amount) external {
        require(amount > 0, "Quantidade deve ser maior que zero");
        amountB += amount;
    }
}
