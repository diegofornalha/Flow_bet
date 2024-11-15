// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/BetPayout.sol";

contract BetPayoutTest is Test {
    BetPayout betPayout;

    function setUp() public {
        betPayout = new BetPayout();
    }

    function testPayOutWinnings() public {
        // Suponha que a função payOutWinnings está implementada
        // Adicione lógica de teste aqui para verificar o pagamento de ganhos
    }

    function testTransferToHouse() public {
        // Suponha que a função transferToHouse está implementada
        // Adicione lógica de teste aqui para verificar a transferência para a casa
    }
}
