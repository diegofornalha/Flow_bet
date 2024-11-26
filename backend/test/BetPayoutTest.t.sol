// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BetPayout.sol";

contract BetPayoutTest is Test {
    BetPayout betPayout;
    address constant TEST_USER = address(0x1234);
    uint256 constant TEST_AMOUNT = 1 ether;

    event WinningsPaid(address indexed user, uint256 amount);
    event WinningsClaimed(address indexed user, uint256 amount);
    event HouseTransfer(uint256 amount);

    function setUp() public {
        betPayout = new BetPayout();
        // Fundando o contrato para testes
        vm.deal(address(betPayout), 10 ether);
    }

    function testConstructor() public {
        assertEq(
            betPayout.house(),
            address(this),
            "House should be contract deployer"
        );
    }

    function testPayOutWinnings() public {
        betPayout.payOutWinnings(TEST_USER, TEST_AMOUNT);
        assertEq(
            betPayout.pendingPayouts(TEST_USER),
            TEST_AMOUNT,
            "Pending payout should be set"
        );
    }

    function testPayOutWinningsZeroAmount() public {
        vm.expectRevert("Amount must be greater than 0");
        betPayout.payOutWinnings(TEST_USER, 0);
    }

    function testTransferToHouse() public {
        uint256 initialBalance = address(this).balance;
        betPayout.transferToHouse();
        assertEq(
            address(this).balance - initialBalance,
            10 ether,
            "House should receive contract balance"
        );
    }

    function testTransferToHouseNotHouse() public {
        vm.prank(TEST_USER);
        vm.expectRevert("Only house can transfer");
        betPayout.transferToHouse();
    }

    function testTransferToHouseNoBalance() public {
        // Primeiro transfere todo o saldo
        betPayout.transferToHouse();

        // Tenta transferir novamente
        vm.expectRevert("No balance to transfer");
        betPayout.transferToHouse();
    }

    function testClaimWinnings() public {
        // Primeiro registra os ganhos
        betPayout.payOutWinnings(TEST_USER, TEST_AMOUNT);

        // Tenta reivindicar como usuário
        vm.prank(TEST_USER);
        uint256 initialBalance = TEST_USER.balance;
        betPayout.claimWinnings();

        assertEq(
            TEST_USER.balance - initialBalance,
            TEST_AMOUNT,
            "User should receive winnings"
        );
        assertEq(
            betPayout.pendingPayouts(TEST_USER),
            0,
            "Pending payout should be cleared"
        );
    }

    function testClaimWinningsNoWinnings() public {
        vm.prank(TEST_USER);
        vm.expectRevert("No winnings to claim");
        betPayout.claimWinnings();
    }

    function testMultiplePayouts() public {
        // Testa múltiplos pagamentos para o mesmo usuário
        betPayout.payOutWinnings(TEST_USER, TEST_AMOUNT);
        betPayout.payOutWinnings(TEST_USER, TEST_AMOUNT);

        assertEq(
            betPayout.pendingPayouts(TEST_USER),
            TEST_AMOUNT * 2,
            "Pending payout should accumulate"
        );
    }

    function testClaimWinningsInsufficientBalance() public {
        // Registra ganhos maiores que o saldo do contrato
        betPayout.payOutWinnings(TEST_USER, 20 ether);

        vm.prank(TEST_USER);
        vm.expectRevert();
        betPayout.claimWinnings();
    }

    function testPayOutWinningsToZeroAddress() public {
        vm.expectRevert("Cannot pay to zero address");
        betPayout.payOutWinnings(address(0), TEST_AMOUNT);
    }

    function testClaimWinningsMultipleTimes() public {
        // Primeiro pagamento
        betPayout.payOutWinnings(TEST_USER, TEST_AMOUNT);

        // Primeira reivindicação
        vm.prank(TEST_USER);
        betPayout.claimWinnings();

        // Segunda tentativa de reivindicação
        vm.prank(TEST_USER);
        vm.expectRevert("No winnings to claim");
        betPayout.claimWinnings();
    }

    // Função necessária para receber ETH
    receive() external payable {}
}
