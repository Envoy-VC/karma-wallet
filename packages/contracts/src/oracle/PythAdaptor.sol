// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Interfaces
import {IOracleAdaptor} from "../interfaces/IOracleAdaptor.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PythAdaptor is IOracleAdaptor, Ownable {
    bytes32 public _priceId;
    IPyth public _pyth;

    constructor(address initialOwner, bytes32 priceId_, address pythAddress_) Ownable(initialOwner) {
        _priceId = priceId_;
        _pyth = IPyth(pythAddress_);
    }

    function getLatestEthPriceInUsd() public view returns (uint256) {
        PythStructs.Price memory price = _pyth.getPriceUnsafe(_priceId);

        uint32 expo = uint32(int32(18 + price.expo));
        return uint256(uint64(price.price)) * 10 ** expo;
    }

    function updatePriceId(bytes32 priceId_) external onlyOwner {
        _priceId = priceId_;
    }

    function updatePythAddress(address pythAddress_) external onlyOwner {
        _pyth = IPyth(pythAddress_);
    }
}
