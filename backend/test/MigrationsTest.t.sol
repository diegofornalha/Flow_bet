// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/Migrations.sol";

contract MigrationsTest is Test {
    Migrations migrations;

    function setUp() public {
        migrations = new Migrations();
    }

    function testSetCompleted() public {
        migrations.setCompleted(1);
        assertEq(migrations.lastCompletedMigration(), 1);
    }
}
