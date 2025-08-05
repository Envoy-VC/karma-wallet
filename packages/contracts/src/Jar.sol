// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@eth-infinitism/account-abstraction/contracts/accounts/callback/TokenCallbackHandler.sol";
import {KarmaAccount} from "src/KarmaAccount.sol";

contract Jar is TokenCallbackHandler {
    error InsufficientBalance();
    error FailedToSendEther();
    error OnlySmartAccountOwner();

    KarmaAccount public _account;

    constructor(address payable account_) {
        _account = KarmaAccount(account_);
    }

    modifier onlyAccountOwner() {
        if (!(msg.sender == _account.owner() || msg.sender == address(_account))) {
            revert OnlySmartAccountOwner();
        }
        _;
    }

    receive() external payable {}
    fallback() external payable {}

    function withdraw(uint256 amount) public onlyAccountOwner {
        if (address(this).balance < amount) {
            revert InsufficientBalance();
        }
        (bool success,) = payable(msg.sender).call{value: amount}("");

        if (!success) {
            revert FailedToSendEther();
        }
    }
}
