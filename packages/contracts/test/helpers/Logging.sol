// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {console2 as console} from "forge-std/console2.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

library Logging {
    using Strings for uint256;

    function parseDecimal(uint256 number, uint8 numberDecimals, uint8 printDecimals)
        public
        pure
        returns (string memory)
    {
        uint256 base = 10 ** numberDecimals;
        uint256 integerPart = number / base;

        // Scale the fractional part to printDecimals
        uint256 fracFull = number % base;
        uint256 fracScaled = (fracFull * (10 ** printDecimals)) / base;

        string memory paddedFraction = padFraction(fracScaled, printDecimals);
        string memory formatted = string(abi.encodePacked(integerPart.toString(), ".", paddedFraction));
        return formatted;
    }

    function padFraction(uint256 frac, uint8 decimals) public pure returns (string memory) {
        string memory padded = frac.toString();
        while (bytes(padded).length < decimals) {
            padded = string(abi.encodePacked("0", padded));
        }
        return padded;
    }
}
