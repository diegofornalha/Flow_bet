// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Bets.sol";

contract BetsTest is Test {
    Bets bets;

    function setUp() public {
        address oracleAddress = address(0x123);
        address betPayoutAddress = address(0x456);
        address initialOwner = address(this);
        bets = new Bets(oracleAddress, betPayoutAddress, initialOwner);
    }

    function testCreateMatch() public {
        bytes32 matchId = keccak256(abi.encodePacked("match1"));
        bets.createMatch(matchId);

        (uint teamAVolume, uint teamBVolume, uint totalPool) = bets.matches(
            matchId
        );
        assertEq(teamAVolume, bets.initialVolume());
        assertEq(teamBVolume, bets.initialVolume());
        assertEq(totalPool, bets.initialVolume() * 2);
    }
}
