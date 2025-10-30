// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// We now pass 'msg.sender' to the Ownable constructor
contract F1FanToken is ERC20, Ownable {
    constructor() 
        ERC20("Formula1 Fan Token", "F1T") 
        Ownable(msg.sender) // <-- THIS LINE IS THE FIX
    {
        // Mint 10 Million tokens to the deployer (who is also the owner)
        _mint(msg.sender, 10_000_000 * 10**decimals());
    }
}