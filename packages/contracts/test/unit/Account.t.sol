// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";

import {console2 as console} from "forge-std/console2.sol";
import {KarmaAccount} from "src/KarmaAccount.sol";
import {Jar} from "src/Jar.sol";

import {SetUp} from "test/common/SetUp.sol";

import {Logging} from "test/helpers/Logging.sol";

contract CounterUnitTest is Test, SetUp {
    using Logging for *;

    function setUp() public override {
        super.setUp();
    }

    function ethToUsd(uint256 _eth) internal view returns (string memory) {
        uint256 ethPrice = oracle.getLatestEthPriceInUsd();
        uint256 usdPrice = (_eth * ethPrice) / 1e18;
        return Logging.parseDecimal(usdPrice, 18, 4);
    }

    function _createAccount(address owner) internal returns (KarmaAccount) {
        vm.startBroadcast(owner);
        KarmaAccount account = factory.createAccount(owner, block.timestamp);
        vm.stopBroadcast();
        vm.deal(address(account), 100 ether);
        return account;
    }

    function test_Execute() public {
        address owner = accounts.owner.addr;

        KarmaAccount account = _createAccount(owner);

        vm.startBroadcast(owner);

        uint256 tipJarBalance = address(account._jar()).balance;

        bytes memory data = bytes("0x");
        vm.txGasPrice(2 * 1e8);
        uint256 gasPre = gasleft();

        // Testing Event Emit
        vm.expectEmit(true, false, false, true);
        emit Jar.Deposit(address(account), 34723, 3055400000000, 1);

        account.execute(accounts.user.addr, 1 ether, data);
        uint256 gasPost = gasleft();
        uint256 gasUsed = gasPre - gasPost;

        uint256 gasCostInWei = gasUsed * tx.gasprice;
        string memory gasCostInUSD = ethToUsd(gasCostInWei);

        console.log("Gas Cost in USD", gasCostInUSD);

        tipJarBalance = address(account._jar()).balance;
        console.log("Tip Received in USD", ethToUsd(tipJarBalance));

        assert(tipJarBalance > 0);
        vm.stopBroadcast();
    }

    function test_Withdraw() public {
        address owner = accounts.owner.addr;

        KarmaAccount account = _createAccount(owner);

        vm.startBroadcast(owner);

        vm.txGasPrice(2 * 1e8);
        account.execute(accounts.user.addr, 1 ether, bytes("0x"));

        uint256 tipJarBalance = address(account._jar()).balance;
        uint256 ownerBalancePre = address(owner).balance;

        // Testing Withdraw Emit
        vm.expectEmit(true, false, false, true);
        emit Jar.Withdraw(address(owner), 3055400000000);

        account._jar().withdraw(tipJarBalance, owner);

        uint256 ownerBalancePost = address(owner).balance;

        assert(ownerBalancePost == (ownerBalancePre + tipJarBalance));
        vm.stopBroadcast();
    }
}
