// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Disableable} from "../contracts/Disable.sol";

contract DisableableTest is Test {
    Disableable public disableable;
    address owner = address(1);
    address user = address(2);

    function setUp() public {
        vm.prank(owner);
        disableable = new Disableable();
    }

    function testProtectedFunctionWhenEnabled() public {
        vm.prank(owner);
        // Deve funcionar quando habilitado
        disableable.protectedFunction();
    }

    function testProtectedFunctionWhenDisabled() public {
        // Desabilita o contrato
        vm.prank(owner);
        disableable.disable();

        // Tenta executar função protegida
        vm.expectRevert("Contract is disabled");
        disableable.protectedFunction();

        // Reabilita o contrato
        vm.prank(owner);
        disableable.enable();

        // Deve funcionar após reabilitar
        disableable.protectedFunction();
    }

    function testOnlyOwnerCanDisable() public {
        // Usuário não-owner tenta desabilitar
        vm.prank(user);
        vm.expectRevert();
        disableable.disable();
    }
}
