//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QSE is ERC20, ERC20Permit, Ownable {
    uint256 private _totalSupply = 1_000_000_000;
    uint256 public constant TRANSACTION_BURN_RATE = 2; // 2% burn per transaction
    event TokensBurned(address indexed from, uint256 amount);

    constructor(
        address initialOwner
    )
        ERC20("QuantumSEC Analytics Token", "QSE")
        ERC20Permit("QuantumSEC Analytics Token")
        Ownable(initialOwner)
    {
        require(initialOwner != address(0), "Invalid initial owner address");
        _mint(initialOwner, _totalSupply * 10 ** decimals());
    }

    // function transfer(
    //     address recipient,
    //     uint256 amount
    // ) public override returns (bool) {
    //     _customTransfer(_msgSender(), recipient, amount);
    //     return true;
    // }

    // function transferFrom(
    //     address sender,
    //     address recipient,
    //     uint256 amount
    // ) public override returns (bool) {
    //     uint256 currentAllowance = allowance(sender, _msgSender());
    //     require(
    //         currentAllowance >= amount,
    //         "ERC20: transfer amount exceeds allowance"
    //     );

    //     _customTransfer(sender, recipient, amount);
    //     _approve(sender, _msgSender(), currentAllowance - amount);

    //     return true;
    // }

    // function _customTransfer(
    //     address sender,
    //     address recipient,
    //     uint256 amount
    // ) internal {
    //     require(balanceOf(sender) >= amount, "Insufficient balance");

    //     uint256 burnAmount = (amount * TRANSACTION_BURN_RATE) / 100;
    //     uint256 transferAmount = amount - burnAmount;

    //     if (burnAmount > 0) {
    //         _burn(sender, burnAmount);
    //         emit TokensBurned(sender, burnAmount);
    //     }

    //     super._transfer(sender, recipient, transferAmount);
    // }

    // function burn(uint256 amount) external {
    //     require(
    //         amount > 0 && balanceOf(msg.sender) >= amount,
    //         "Invalid burn amount"
    //     );
    //     _burn(msg.sender, amount);
    //     emit TokensBurned(msg.sender, amount);
    // }
}