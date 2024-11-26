// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BetPat.sol";

contract FuzzTest is Test {
    BetPat betPat;

    function setUp() public {
        betPat = new BetPat();
    }

    // Teste de fuzzing para a função placeBets
    function testFuzzPlaceBets(uint256 amount) public {
        // Assume que o valor da aposta é válido e não causa overflow
        vm.assume(amount > 0 && amount < type(uint256).max - betPat.getA());

        uint256 initialAmountA = betPat.getA();
        betPat.placeBets(amount);
        uint256 newAmountA = betPat.getA();

        assertEq(newAmountA, initialAmountA + amount);
    }

    // Teste de fuzzing para a função placeBetsJag
    function testFuzzPlaceBetsJag(uint256 amount) public {
        // Assume que o valor da aposta é válido e não causa overflow
        vm.assume(amount > 0 && amount < type(uint256).max - betPat.getB());

        uint256 initialAmountB = betPat.getB();
        betPat.placeBetsJag(amount);
        uint256 newAmountB = betPat.getB();

        assertEq(newAmountB, initialAmountB + amount);
    }
}
