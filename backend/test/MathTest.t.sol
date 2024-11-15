// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Math.sol";

contract MathTest is Test {
    function testAdd() public pure {
        uint256 a = 1;
        uint256 b = 2;
        uint256 result = Math.add(a, b);
        assertEq(result, 3);
    }

    function testSub() public pure {
        uint256 a = 3;
        uint256 b = 2;
        uint256 result = Math.sub(a, b);
        assertEq(result, 1);
    }
}
