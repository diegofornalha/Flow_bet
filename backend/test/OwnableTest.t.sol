// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Owner.sol";

contract OwnableTest is Test {
    Ownable ownable;

    function setUp() public {
        ownable = new Ownable();
    }

    function testTransferOwnership() public {
        address newOwner = address(0x123);
        ownable.transferOwnership(newOwner);
        assertEq(ownable.owner(), newOwner);
    }
}
