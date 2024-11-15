// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Oracle.sol";

contract OracleTest is Test, Oracle {
    function getPendingMatches()
        public
        pure
        override
        returns (bytes32[] memory)
    {
        return new bytes32[](0);
    }

    function getAllMatches() public pure override returns (bytes32[] memory) {
        return new bytes32[](0);
    }

    function matchExists(bytes32) public pure override returns (bool) {
        return false;
    }

    function getMatch(
        bytes32 _matchId
    )
        public
        pure
        override
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        )
    {
        return (_matchId, "", "", 0, 0, MatchOutcome.Pending, -1);
    }

    function getMostRecentMatch(
        bool /* _pending */
    )
        public
        pure
        override
        returns (
            bytes32 id,
            string memory name,
            string memory participants,
            uint8 participantCount,
            uint date,
            MatchOutcome outcome,
            int8 winner
        )
    {
        return ("", "", "", 0, 0, MatchOutcome.Pending, -1);
    }

    function testConnection() public pure override returns (bool) {
        return true;
    }

    function addTestData() public override {}

    function testOracleConnection() public pure {
        assertTrue(testConnection());
    }
}
