// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Disable.sol";

contract DisableableTest is Test {
    Disableable disableable;

    function setUp() public {
        disableable = new Disableable();
    }

    function testDisableEnable() public {
        disableable.disable();
        vm.expectRevert("Contract is disabled");
        disableable.protectedFunction();
        disableable.enable();
        disableable.protectedFunction();
    }
}
