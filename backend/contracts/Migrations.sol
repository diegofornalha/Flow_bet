// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title Migrations Contract
/// @notice Este contrato gerencia a migração de contratos.
contract Migrations {
    address public immutable owner;
    uint public lastCompletedMigration;

    /// @notice Construtor que define o dono do contrato.
    constructor() {
        owner = msg.sender;
    }

    /// @notice Modificador que restringe a execução a apenas o dono.
    modifier restricted() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// @notice Define a última migração concluída.
    /// @param completed O número da migração concluída.
    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }

    /// @notice Atualiza o contrato de migração para um novo endereço.
    /// @param newAddress O endereço do novo contrato de migração.
    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }

    /// @notice Retorna o número da próxima migração a ser executada.
    /// @return O número da próxima migração.
    function getLastMigratedVersion() public view returns (uint256) {
        return lastCompletedMigration + 1;
    }
}
