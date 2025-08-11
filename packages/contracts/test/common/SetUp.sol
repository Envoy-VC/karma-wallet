// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";

import {MockOracle} from "src/mocks/MockOracle.sol";
import {EntryPoint} from "src/Entrypoint.sol";
import {KarmaAccountFactory} from "src/KarmaAccountFactory.sol";

contract SetUp is Test {
    struct Accounts {
        Vm.Wallet bundler;
        Vm.Wallet owner;
        Vm.Wallet deployer;
        Vm.Wallet user;
    }

    MockOracle public oracle;
    EntryPoint public entryPoint;
    KarmaAccountFactory public factory;

    Accounts public accounts;

    function setUp() public virtual {
        _setUpTestAccounts();

        oracle = new MockOracle(3000e18);
        entryPoint = new EntryPoint();
        factory = new KarmaAccountFactory(entryPoint, oracle);
    }

    function _setUpTestAccounts() internal {
        // Create Accounts
        accounts = Accounts({
            bundler: vm.createWallet("bundler"),
            owner: vm.createWallet("owner"),
            deployer: vm.createWallet("deployer"),
            user: vm.createWallet("user")
        });

        // Fund Accounts
        vm.deal(accounts.bundler.addr, 100 ether);
        vm.deal(accounts.owner.addr, 100 ether);
        vm.deal(accounts.deployer.addr, 100 ether);
    }
}
