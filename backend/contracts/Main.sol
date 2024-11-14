// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/// @title Main Contract
/// @notice Este contrato serve como ponto de entrada principal.
contract Main {
    /// @notice Retorna o endereço deste contrato.
    /// @return O endereço do contrato.
    function getAddress() public view returns (address) {
        return address(this);
    }
}
