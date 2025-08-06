// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IOracleAdaptor} from "../interfaces/IOracleAdaptor.sol";

contract MockOracle is IOracleAdaptor {
    uint256 public _latestEthPriceInUsd;

    constructor(uint256 latestEthPriceInUsd_) {
        _latestEthPriceInUsd = latestEthPriceInUsd_;
    }

    function getLatestEthPriceInUsd() external view returns (uint256) {
        return _latestEthPriceInUsd;
    }

    function updateLatestEthPriceInUsd(uint256 latestEthPriceInUsd_) external {
        _latestEthPriceInUsd = latestEthPriceInUsd_;
    }
}
