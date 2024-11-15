// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Main.sol";

contract MainTest is Test {
    Main main;

    function setUp() public {
        main = new Main();
    }

    function testGetAddress() public {
        assertEq(main.getAddress(), address(main));
    }
}
