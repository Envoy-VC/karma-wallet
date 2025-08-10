// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import {IEntryPoint} from "@eth-infinitism/account-abstraction/contracts/interfaces/IEntryPoint.sol";

import "./KarmaAccount.sol";

import {IOracleAdaptor} from "./interfaces/IOracleAdaptor.sol";

contract KarmaAccountFactory {
    KarmaAccount public immutable accountImplementation;
    IOracleAdaptor public _oracleAdaptor;

    constructor(IEntryPoint _entryPoint, IOracleAdaptor oracleAdaptor_) {
        _oracleAdaptor = oracleAdaptor_;
        accountImplementation = new KarmaAccount(_entryPoint);
    }

    function createAccount(address owner, uint256 salt) public returns (KarmaAccount ret) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return KarmaAccount(payable(addr));
        }
        ret = KarmaAccount(
            payable(
                new ERC1967Proxy{salt: bytes32(salt)}(
                    address(accountImplementation),
                    abi.encodeCall(KarmaAccount.initialize, (owner, address(_oracleAdaptor)))
                )
            )
        );
    }

    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(
            bytes32(salt),
            keccak256(
                abi.encodePacked(
                    type(ERC1967Proxy).creationCode,
                    abi.encode(
                        address(accountImplementation),
                        abi.encodeCall(KarmaAccount.initialize, (owner, address(_oracleAdaptor)))
                    )
                )
            )
        );
    }
}
