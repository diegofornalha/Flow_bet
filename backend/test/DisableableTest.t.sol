// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Disableable.sol";

contract DisableableTest is Test {
    Disableable disableable;

    function setUp() public {
        disableable = new Disableable(address(this));
    }

    function testInitialDisabledState() public view {
        bool initialState = disableable.disabled();
        assertEq(initialState, false, "Initial state should be false");
    }

    function testDisableFunction() public {
        disableable.disable();
        bool stateAfterDisable = disableable.disabled();
        assertEq(stateAfterDisable, true, "State should be true after disable");
    }

    function testEnableFunction() public {
        disableable.disable();
        disableable.enable();
        bool stateAfterEnable = disableable.disabled();
        assertEq(stateAfterEnable, false, "State should be false after enable");
    }

    function testProtectedFunction() public {
        disableable.protectedFunction();
        disableable.disable();
        vm.expectRevert("Contract is disabled");
        disableable.protectedFunction();
    }

    function testAnotherProtectedFunction() public {
        disableable.anotherProtectedFunction();
        disableable.disable();
        vm.expectRevert("Contract is disabled");
        disableable.anotherProtectedFunction();
    }
}
