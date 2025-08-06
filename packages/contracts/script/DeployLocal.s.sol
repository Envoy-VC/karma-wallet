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
        vm.startBroadcast(0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6);

        oracle = new MockOracle(3000e18);
        entryPoint = new EntryPoint();
        factory = new KarmaAccountFactory(entryPoint, oracle);

        console.log("MockOracle", address(oracle));
        console.log("EntryPoint", address(entryPoint));
        console.log("KarmaAccountFactory", address(factory));
        address impl = address(factory.accountImplementation());
        console.log("KarmaAccountImplementation", impl);

        address testAddress = 0xc0d86456F6f2930b892f3DAD007CDBE32c081FE6;
        // Fund the test address
        (bool success,) = testAddress.call{value: 1 ether}("");
        require(success, "Failed to send Ether");

        vm.stopBroadcast();
    }
}
