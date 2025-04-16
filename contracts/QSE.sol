// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QAI Token
 * @dev ERC-20 token with ERC-2612 (permit) and a 2% burn per transaction.
 */
contract QSEToken is ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion QAI
    uint256 public constant INITIAL_SUPPLY = 300_000_000 * 10**18; // 300 Million for Phase 1 ICO
    uint256 public constant TRANSACTION_BURN_RATE = 2; // 2% burn per transaction

    mapping(address => uint256) public vestedTokens;
    mapping(address => uint256) public vestingEndTime;

    event TokensBurned(address indexed from, uint256 amount);

    constructor(address ownerAddress) 
        ERC20("QuantumSEC Analytics Token", "QSE") 
        ERC20Permit("QuantumSEC Analytics Token") 
        Ownable(ownerAddress)  // ✅ FIX: Pass owner address to Ownable
    {
        require(ownerAddress != address(0), "Invalid owner address");
        _mint(ownerAddress, INITIAL_SUPPLY);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _customTransfer(_msgSender(), recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        
        _customTransfer(sender, recipient, amount);
        _approve(sender, _msgSender(), currentAllowance - amount);

        return true;
    }

    function _customTransfer(address sender, address recipient, uint256 amount) internal {
        require(balanceOf(sender) >= amount, "Insufficient balance");

        uint256 burnAmount = (amount * TRANSACTION_BURN_RATE) / 100;
        uint256 transferAmount = amount - burnAmount;

        if (burnAmount > 0) {
            _burn(sender, burnAmount);
            emit TokensBurned(sender, burnAmount);
        }

        super._transfer(sender, recipient, transferAmount);
    }

    function allocateVestedTokens(address beneficiary, uint256 amount, uint256 duration) external onlyOwner {
        require(beneficiary != address(0), "Invalid address");
        require(amount > 0 && balanceOf(owner()) >= amount, "Invalid amount");
        require(vestingEndTime[beneficiary] == 0, "Vesting already assigned");

        vestedTokens[beneficiary] = amount;
        vestingEndTime[beneficiary] = block.timestamp + duration;

        _transfer(owner(), beneficiary, amount);
    }

    function claimVestedTokens() external {
        require(block.timestamp >= vestingEndTime[msg.sender], "Vesting period not over");
        require(vestedTokens[msg.sender] > 0, "No vested tokens");

        vestedTokens[msg.sender] = 0;
        vestingEndTime[msg.sender] = 0;
    }

    function burn(uint256 amount) external {
        require(amount > 0 && balanceOf(msg.sender) >= amount, "Invalid burn amount");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
}
