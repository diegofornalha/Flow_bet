// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title BetPayout Contract
/// @notice Este contrato gerencia o pagamento de apostas e distribuição de ganhos
/// @dev Implementa a lógica de pagamento para apostadores vencedores
contract BetPayout {
    /// @notice Calcula e paga os ganhos para um usuário
    /// @param user O endereço do usuário que receberá o pagamento
    /// @param amount O valor a ser pago ao usuário
    /// @dev Deve verificar o saldo do contrato antes do pagamento
    function payOutWinnings(address user, uint amount) external {
        // Implementação da função
    }

    /// @notice Transfere o saldo restante para a casa de apostas
    /// @dev Deve ser chamada apenas após todos os pagamentos aos vencedores
    function transferToHouse() external {
        // Implementação da função
    }
}
