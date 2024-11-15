// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Disableable is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    bool public disabled = false;

    modifier notDisabled() {
        require(!disabled, "Contract is disabled");
        _;
    }

    function disable() external onlyOwner {
        disabled = true;
    }

    function enable() external onlyOwner {
        disabled = false;
    }

    function protectedFunction() external notDisabled {
        // Lógica da função
    }

    function anotherProtectedFunction() public view notDisabled {
        // função exemplo para testar o modificador
    }
}
