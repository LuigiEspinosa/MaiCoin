// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MaiCoin
 * @dev ERC-20 token with minting (owner only) and burning (any holder).
 * Learning project - Sepolia testnet only
 */
contract MaiCoin is ERC20, ERC20Burnable, Ownable {
    constructor(
        address initialOwner
    ) ERC20("MaiCoin", "MAI") Ownable(initialOwner) {
        // 1 billion tokens minted to the deployer address on deploy.
        // 1_000_000_000 * 10**18 = 1 billion with 18 decimals.
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    // Only the contract owner (deployer, or transferee) can mint new tokens.
    // onlyOwner from Ownable reverts immediately for any other caller.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // burn() and burnFrom() are inherited from ERC20Burnable - no override needed.
    // burn(amount)               - caller burns their own tokens.
    // burnFrom(account, amount)  - caller burns tokens they have allowance for.
}
