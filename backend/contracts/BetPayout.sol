// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title BetPayout Contract
/// @notice Este contrato gerencia o pagamento de apostas e distribuição de ganhos
/// @dev Implementa a lógica de pagamento para apostadores vencedores
contract BetPayout {
    mapping(address => uint) public pendingPayouts;
    address public house;

    constructor() {
        house = msg.sender;
    }

    /// @notice Calcula e paga os ganhos para um usuário
    /// @param user O endereço do usuário que receberá o pagamento
    /// @param amount O valor a ser pago ao usuário
    /// @dev Deve verificar o saldo do contrato antes do pagamento
    function payOutWinnings(address user, uint amount) external {
        require(user != address(0), "Cannot pay to zero address");
        require(amount > 0, "Amount must be greater than 0");
        pendingPayouts[user] += amount;
    }

    /// @notice Transfere o saldo restante para a casa de apostas
    /// @dev Deve ser chamada apenas após todos os pagamentos aos vencedores
    function transferToHouse() external {
        require(msg.sender == house, "Only house can transfer");
        uint balance = address(this).balance;
        require(balance > 0, "No balance to transfer");
        payable(house).transfer(balance);
    }

    function claimWinnings() external {
        uint amount = pendingPayouts[msg.sender];
        require(amount > 0, "No winnings to claim");
        pendingPayouts[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
