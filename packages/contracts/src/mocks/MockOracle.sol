// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IOracleAdaptor} from "../interfaces/IOracleAdaptor.sol";

contract MockOracle is IOracleAdaptor {
    function getLatestEthPriceInUsd() external pure returns (uint256) {
        return 3000e18;
    }
}
