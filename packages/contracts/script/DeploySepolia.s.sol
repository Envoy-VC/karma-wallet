// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";

import {PythAdaptor} from "src/oracle/PythAdaptor.sol";
import {KarmaAccountFactory} from "src/KarmaAccountFactory.sol";

import {IEntryPoint} from "@eth-infinitism/account-abstraction/contracts/interfaces/IEntryPoint.sol";

import {console2 as console} from "forge-std/console2.sol";

contract DeploySepolia is Script {
    PythAdaptor public oracle;
    KarmaAccountFactory public factory;

    function run() external {
        vm.startBroadcast();
        address deployerAddress = 0x9A36a8EDAF9605F7D4dDC72F4D81463fb6f841d8;

        bytes32 priceId = bytes32(0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace); // "ETH/USD"
        address pythAddress = 0xDd24F84d36BF92C65F92307595335bdFab5Bbd21;

        IEntryPoint entryPoint = IEntryPoint(0x0000000071727De22E5E9d8BAf0edAc6f37da032); // EntryPoint 0.7.0

        oracle = new PythAdaptor(deployerAddress, priceId, pythAddress);
        factory = new KarmaAccountFactory(entryPoint, oracle);

        console.log("PythAdaptor", address(oracle));
        console.log("KarmaAccountFactory", address(factory));
        address impl = address(factory.accountImplementation());
        console.log("KarmaAccountImplementation", impl);

        vm.stopBroadcast();
    }
}
