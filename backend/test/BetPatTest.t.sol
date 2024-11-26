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

    function testPlaceBetsZeroAmount() public {
        vm.expectRevert("Quantidade deve ser maior que zero");
        betPat.placeBets(0);
    }

    function testPlaceBetsJagZeroAmount() public {
        vm.expectRevert("Quantidade deve ser maior que zero");
        betPat.placeBetsJag(0);
    }

    function testPlaceBetsMaxAmount() public {
        uint256 maxAmount = type(uint256).max - betPat.getA();
        betPat.placeBets(maxAmount);
        assertEq(betPat.getA(), type(uint256).max);
    }

    function testPlaceBetsJagMaxAmount() public {
        uint256 maxAmount = type(uint256).max - betPat.getB();
        betPat.placeBetsJag(maxAmount);
        assertEq(betPat.getB(), type(uint256).max);
    }

    function testViewVolume() public {
        (uint256 volumeA, uint256 volumeB) = betPat.viewVolume();
        assertEq(volumeA, 100);
        assertEq(volumeB, 100);

        betPat.placeBets(50);
        betPat.placeBetsJag(30);

        (volumeA, volumeB) = betPat.viewVolume();
        assertEq(volumeA, 150);
        assertEq(volumeB, 130);
    }
}
