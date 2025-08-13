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

    function weiToUsd(uint256 _eth) internal view returns (uint256) {
        uint256 ethPrice = oracle.getLatestEthPriceInUsd();
        return (_eth * ethPrice) / 1e18;
    }

    function usdToWei(uint256 _usd) internal view returns (uint256) {
        uint256 ethPrice = oracle.getLatestEthPriceInUsd();
        return (_usd * 1e18) / ethPrice;
    }

    function _calculateTip(uint256 gasUsed) internal view returns (uint256) {
        uint256 ethPriceUSD = oracle.getLatestEthPriceInUsd();

        uint256 gasCostInWei = gasUsed * tx.gasprice;
        uint256 gasCostInUSD = (gasCostInWei * ethPriceUSD) / 1e18;

        uint256 tipInUSD = 0;
        uint256 roundingMultipleUSD = 1e16; // For rounding to nearest $0.01
        if (gasCostInUSD > 0) {
            uint256 remainder = gasCostInUSD % roundingMultipleUSD;
            if (remainder > 0) {
                tipInUSD = roundingMultipleUSD - remainder;
            }
        }

        uint256 tipInWei = (tipInUSD * 1e18) / ethPriceUSD;

        return tipInWei;
    }

    function test_lessThanCentGasUsed() public {
        vm.txGasPrice(8.616804232e9);
        uint256 gasUsedInWei = 7211;
        uint256 gasUsedInUsd = weiToUsd(gasUsedInWei);
        uint256 tip = _calculateTip(gasUsedInWei);
        console.log("Gas Used in USD", Logging.parseDecimal(gasUsedInUsd, 18, 18));
        uint256 tipInUsd = weiToUsd(tip);
        console.log("Tip in USD", Logging.parseDecimal(tipInUsd, 18, 18));
        console.log("Tip in Wei", tip);

        // 2312000000000
        // 2551025562715215
    }
}
