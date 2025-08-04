// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IOracleAdaptor {
    /// @notice Get the latest ETH price in USD (18 decimals).
    /// @return The latest ETH price in USD (18 decimals).
    function getLatestEthPriceInUsd() external view returns (uint256);
}
