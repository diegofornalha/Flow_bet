// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Owner.sol";

contract Disableable is Ownable {
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
}
