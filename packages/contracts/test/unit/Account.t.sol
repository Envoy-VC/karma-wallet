// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";

import {console2 as console} from "forge-std/console2.sol";
import {KarmaAccount} from "src/KarmaAccount.sol";

import {SetUp} from "test/common/SetUp.sol";

contract CounterUnitTest is Test, SetUp {
    function setUp() public override {
        super.setUp();
    }

    function parseDecimal(uint256 number, uint8 numberDecimals, uint8 printDecimals)
        internal
        pure
        returns (string memory)
    {
        uint256 base = 10 ** numberDecimals;
        uint256 integerPart = number / base;

        // Scale the fractional part to printDecimals
        uint256 fracFull = number % base;
        uint256 fracScaled = (fracFull * (10 ** printDecimals)) / base;

        string memory paddedFraction = padFraction(fracScaled, printDecimals);
        string memory formatted = string(abi.encodePacked(vm.toString(integerPart), ".", paddedFraction));
        return formatted;
    }

    function padFraction(uint256 frac, uint8 decimals) internal pure returns (string memory) {
        string memory padded = vm.toString(frac);
        while (bytes(padded).length < decimals) {
            padded = string(abi.encodePacked("0", padded));
        }
        return padded;
    }

    function ethToUsd(uint256 _eth) internal pure returns (string memory) {
        uint256 ethPrice = 3000 * 1e18;
        uint256 usdPrice = (_eth * ethPrice) / 1e18;
        return parseDecimal(usdPrice, 18, 4);
    }

    function test_Execute() public {
        address senderCreator = address(entryPoint.senderCreator());
        vm.deal(senderCreator, 1 ether);

        address owner = accounts.richard.addr;

        vm.startBroadcast(senderCreator);
        KarmaAccount account = factory.createAccount(owner, block.timestamp);
        vm.stopBroadcast();

        vm.startBroadcast(owner);
        console.log("Richard Address", owner);
        console.log("Account Address", address(account));

        uint256 tipJarBalance = (account._tips());
        console.log("Tip Jar Balance Before Execution", ethToUsd(tipJarBalance));

        vm.deal(address(account), 100 ether);

        bytes memory data = bytes("0x");
        vm.txGasPrice(4 * 1e8);
        account.execute(accounts.gilfoyle.addr, 1 ether, data);

        tipJarBalance = account._tips();
        console.log("Tip Jar Balance After Execution", ethToUsd(tipJarBalance));
        vm.stopBroadcast();
    }
}
