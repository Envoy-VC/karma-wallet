// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Jar {
    receive() external payable {}

    function withdraw(uint256 amount) public {
        (bool sent,) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
