// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "@eth-infinitism/account-abstraction/contracts/interfaces/ISenderCreator.sol";
import "./KarmaAccount.sol";

import {IOracleAdaptor} from "./interfaces/IOracleAdaptor.sol";

contract KarmaAccountFactory {
    KarmaAccount public immutable accountImplementation;
    ISenderCreator public immutable senderCreator;
    IOracleAdaptor public _oracleAdaptor;

    constructor(IEntryPoint _entryPoint, IOracleAdaptor oracleAdaptor_) {
        _oracleAdaptor = oracleAdaptor_;
        accountImplementation = new KarmaAccount(_entryPoint, _oracleAdaptor);
        senderCreator = _entryPoint.senderCreator();
    }

    /**
     * create an account, and return its address.
     * returns the address even if the account is already deployed.
     * Note that during UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation
     */
    function createAccount(address owner, uint256 salt) public returns (KarmaAccount ret) {
        require(msg.sender == address(senderCreator), "only callable from SenderCreator");
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return KarmaAccount(payable(addr));
        }
        ret = KarmaAccount(
            payable(
                new ERC1967Proxy{salt: bytes32(salt)}(
                    address(accountImplementation), abi.encodeCall(KarmaAccount.initialize, (owner))
                )
            )
        );
    }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(
            bytes32(salt),
            keccak256(
                abi.encodePacked(
                    type(ERC1967Proxy).creationCode,
                    abi.encode(address(accountImplementation), abi.encodeCall(KarmaAccount.initialize, (owner)))
                )
            )
        );
    }
}
