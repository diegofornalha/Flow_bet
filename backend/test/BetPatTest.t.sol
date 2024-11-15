// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BetPat.sol";

contract BetPatTest is Test {
    BetPat betPat;

    function setUp() public {
        betPat = new BetPat();
    }

    function testInitialAmounts() public {
        uint256 amountA = betPat.getA();
        uint256 amountB = betPat.getB();
        assertEq(amountA, 100);
        assertEq(amountB, 100);
    }
}
