// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BetPat.sol";

contract BetPatTest is Test {
    BetPat betPat;

    function setUp() public {
        betPat = new BetPat();
    }

    function testInitialAmounts() public view {
        uint256 amountA = betPat.getA();
        uint256 amountB = betPat.getB();
        assertEq(amountA, 100);
        assertEq(amountB, 100);
    }

    function testPlaceBets() public {
        uint256 initialAmountA = betPat.getA();
        uint256 betAmount = 50;

        betPat.placeBets(betAmount);

        uint256 newAmountA = betPat.getA();
        assertEq(newAmountA, initialAmountA + betAmount);
    }

    function testPlaceBetsJag() public {
        uint256 initialAmountB = betPat.getB();
        uint256 betAmount = 30;

        betPat.placeBetsJag(betAmount);

        uint256 newAmountB = betPat.getB();
        assertEq(newAmountB, initialAmountB + betAmount);
    }
}
