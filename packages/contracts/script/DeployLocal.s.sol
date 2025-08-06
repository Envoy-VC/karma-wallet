// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";

import {MockOracle} from "src/mocks/MockOracle.sol";
import {EntryPoint} from "src/Entrypoint.sol";
import {KarmaAccountFactory} from "src/KarmaAccountFactory.sol";

import {console2 as console} from "forge-std/console2.sol";

contract DeployLocal is Script {
    MockOracle public oracle;
    EntryPoint public entryPoint;
    KarmaAccountFactory public factory;

    function run() external {
        vm.startBroadcast();

        oracle = new MockOracle(3000e18);
        entryPoint = new EntryPoint();
        factory = new KarmaAccountFactory(entryPoint, oracle);

        console.log("MockOracle", address(oracle));
        console.log("EntryPoint", address(entryPoint));
        console.log("KarmaAccountFactory", address(factory));

        vm.stopBroadcast();
    }
}
