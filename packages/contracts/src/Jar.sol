// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@eth-infinitism/account-abstraction/contracts/samples/callback/TokenCallbackHandler.sol";
import {KarmaAccount} from "src/KarmaAccount.sol";
import {console2 as console} from "forge-std/console2.sol";

contract Jar is TokenCallbackHandler {
    error InsufficientBalance();
    error FailedToSendEther();
    error OnlySmartAccountOwner();

    event DepositTip(address indexed sender, uint256 totalGasSpent, uint256 totalTip, uint256 timestamp);
    event WithdrawTip(address indexed recipient, uint256 amount);

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

    function deposit(uint256 totalGasSpent, uint256 totalTip) public payable {
        emit DepositTip(msg.sender, totalGasSpent, totalTip, block.timestamp);
    }

    function withdraw(uint256 amount, address recipient) public onlyAccountOwner {
        if (address(this).balance < amount) {
            revert InsufficientBalance();
        }
        (bool success,) = payable(recipient).call{value: amount}("");

        if (!success) {
            revert FailedToSendEther();
        }

        emit WithdrawTip(recipient, amount);
    }
}
