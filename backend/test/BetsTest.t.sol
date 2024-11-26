// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Bets.sol";
import "../contracts/Oracle.sol";
import "../contracts/BetPayout.sol";

contract BetsTest is Test {
    Bets bets;
    bytes32 constant TEST_MATCH_ID = keccak256(abi.encodePacked("match1"));
    address constant TEST_USER = address(0x1234);
    uint256 constant TEST_AMOUNT = 1e12; // MINIMUM_BET

    function setUp() public {
        // Deploy mock contracts
        MyOracle oracle = new MyOracle();
        BetPayout betPayout = new BetPayout();

        // Deploy main contract
        bets = new Bets(address(oracle), address(betPayout), address(this));
    }

    function testCreateMatch() public {
        bets.createMatch(TEST_MATCH_ID);

        (uint teamAVolume, uint teamBVolume, uint totalPool) = bets.matches(
            TEST_MATCH_ID
        );
        assertEq(teamAVolume, bets.initialVolume());
        assertEq(teamBVolume, bets.initialVolume());
        assertEq(totalPool, bets.initialVolume() * 2);
    }

    function testCreateMatchAlreadyExists() public {
        bets.createMatch(TEST_MATCH_ID);

        vm.expectRevert("Match already exists");
        bets.createMatch(TEST_MATCH_ID);
    }

    function testPlaceBetTeamA() public {
        bets.createMatch(TEST_MATCH_ID);

        // Primeiro, vamos verificar o volume inicial
        uint256 initialVolume = bets.getTeamAVolume(TEST_MATCH_ID);
        assertGt(initialVolume, 0, "Initial volume should be greater than 0");

        vm.deal(TEST_USER, TEST_AMOUNT);
        vm.prank(TEST_USER);
        bets.placeBet{value: TEST_AMOUNT}(
            TEST_MATCH_ID,
            uint32(TEST_AMOUNT),
            true
        );

        uint userShares = bets.userSharesA(TEST_MATCH_ID, TEST_USER);
        assertGt(userShares, 0, "User should have shares");
    }

    function testPlaceBetTeamB() public {
        bets.createMatch(TEST_MATCH_ID);

        // Primeiro, vamos verificar o volume inicial
        uint256 initialVolume = bets.getTeamBVolume(TEST_MATCH_ID);
        assertGt(initialVolume, 0, "Initial volume should be greater than 0");

        vm.deal(TEST_USER, TEST_AMOUNT);
        vm.prank(TEST_USER);
        bets.placeBet{value: TEST_AMOUNT}(
            TEST_MATCH_ID,
            uint32(TEST_AMOUNT),
            false
        );

        uint userShares = bets.userSharesB(TEST_MATCH_ID, TEST_USER);
        assertGt(userShares, 0, "User should have shares");
    }

    function testPlaceBetInvalidAmount() public {
        bets.createMatch(TEST_MATCH_ID);

        vm.deal(TEST_USER, TEST_AMOUNT);
        vm.prank(TEST_USER);
        vm.expectRevert("Valor menor que o minimo permitido");
        bets.placeBet{value: TEST_AMOUNT - 1}(
            TEST_MATCH_ID,
            uint32(TEST_AMOUNT),
            true
        );
    }

    function testPlaceBetZeroAmount() public {
        bets.createMatch(TEST_MATCH_ID);

        vm.deal(TEST_USER, TEST_AMOUNT);
        vm.prank(TEST_USER);
        vm.expectRevert("Quantidade deve ser maior que zero");
        bets.placeBet{value: TEST_AMOUNT}(TEST_MATCH_ID, 0, true);
    }

    function testPlaceBetMatchNotFound() public {
        vm.deal(TEST_USER, TEST_AMOUNT);
        vm.prank(TEST_USER);
        vm.expectRevert("Match not found");
        bets.placeBet{value: TEST_AMOUNT}(
            TEST_MATCH_ID,
            uint32(TEST_AMOUNT),
            true
        );
    }

    function testGetTeamPrices() public {
        bets.createMatch(TEST_MATCH_ID);

        // Primeiro, vamos verificar o pool total
        uint256 totalPool = bets.getTotalPool(TEST_MATCH_ID);
        assertGt(totalPool, 0, "Total pool should be greater than 0");

        uint256 priceA = bets.getTeamAPrice(TEST_MATCH_ID);
        uint256 priceB = bets.getTeamBPrice(TEST_MATCH_ID);

        // Verificar se os preços são calculados corretamente
        uint256 volumeA = bets.getTeamAVolume(TEST_MATCH_ID);
        uint256 volumeB = bets.getTeamBVolume(TEST_MATCH_ID);

        assertEq(
            priceA,
            (volumeA * 1e18) / totalPool,
            "Team A price calculation incorrect"
        );
        assertEq(
            priceB,
            (volumeB * 1e18) / totalPool,
            "Team B price calculation incorrect"
        );
    }

    function testGetTeamPercentages() public {
        bets.createMatch(TEST_MATCH_ID);

        uint percentA = bets.getTeamAPercentage(TEST_MATCH_ID);
        uint percentB = bets.getTeamBPercentage(TEST_MATCH_ID);

        assertEq(percentA + percentB, 100, "Percentages should sum to 100");
    }

    function testGetVolumes() public {
        bets.createMatch(TEST_MATCH_ID);

        uint volumeA = bets.getTeamAVolume(TEST_MATCH_ID);
        uint volumeB = bets.getTeamBVolume(TEST_MATCH_ID);
        uint totalPool = bets.getTotalPool(TEST_MATCH_ID);

        assertEq(
            volumeA + volumeB,
            totalPool,
            "Volumes should sum to total pool"
        );
    }

    function testWithdraw() public {
        // Fund contract
        vm.deal(address(bets), 1 ether);

        uint256 initialBalance = address(this).balance;
        bets.withdraw();
        uint256 finalBalance = address(this).balance;

        assertEq(
            finalBalance - initialBalance,
            1 ether,
            "Should withdraw all funds"
        );
    }

    function testWithdrawNoBalance() public {
        vm.expectRevert("Nenhum saldo para sacar");
        bets.withdraw();
    }

    function testGetContractBalance() public {
        vm.deal(address(bets), 1 ether);

        uint256 balance = bets.getContractBalance();
        assertEq(balance, 1 ether, "Should return correct balance");
    }

    // Função necessária para receber ETH
    receive() external payable {}
}
