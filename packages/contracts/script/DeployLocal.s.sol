// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";

import {MockOracle} from "src/mocks/MockOracle.sol";
import {KarmaAccountFactory} from "src/KarmaAccountFactory.sol";
import {IEntryPoint} from "@eth-infinitism/account-abstraction/contracts/interfaces/IEntryPoint.sol";

import {console2 as console} from "forge-std/console2.sol";

contract DeployLocal is Script {
    MockOracle public oracle;
    KarmaAccountFactory public factory;

    function run() external {
        vm.startBroadcast(0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6);

        oracle = new MockOracle(4000e18);
        IEntryPoint entryPoint = IEntryPoint(0x0000000071727De22E5E9d8BAf0edAc6f37da032); // EntryPoint 0.7.0
        factory = new KarmaAccountFactory(entryPoint, oracle);

        console.log("MockOracle", address(oracle));
        console.log("KarmaAccountFactory", address(factory));

        address testAddress = 0xEac9179AE465a1579c198169682B9F47717a6134;
        // Fund the test address
        (bool success,) = testAddress.call{value: 1 ether}("");
        require(success, "Failed to send Ether");

        vm.stopBroadcast();
    }
}
