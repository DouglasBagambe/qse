// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract QSECrowdsale is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public rate;
    uint256 public constant BURN_RATE = 2;
    uint256 public saleStartTime;
    uint256 public saleEndTime;
    uint256 public minPurchase;
    uint256 public maxPurchase;
    uint256 public weiRaised;
    address payable public wallet;

    event TokensPurchased(address indexed purchaser, uint256 value, uint256 amount);
    event TokensBurned(uint256 amount);

    constructor(
        uint256 initialRate,
        address payable fundingWallet,
        address tokenAddress,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _minPurchase,
        uint256 _maxPurchase
    ) Ownable(msg.sender) {
        require(initialRate > 0, "Rate must be greater than 0");
        require(fundingWallet != address(0), "Wallet cannot be zero address");
        require(tokenAddress != address(0), "Token cannot be zero address");
        require(_saleStartTime >= block.timestamp, "Sale start time must be in the future");
        require(_saleEndTime > _saleStartTime, "Sale end time must be after start time");
        require(_minPurchase > 0, "Min purchase amount must be greater than 0");
        require(_maxPurchase >= _minPurchase, "Max purchase must be >= min purchase");

        rate = initialRate;
        wallet = fundingWallet;
        token = IERC20(tokenAddress);
        saleStartTime = _saleStartTime;
        saleEndTime = _saleEndTime;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
    }

    receive() external payable {
        buyTokens();
    }

    function buyTokens() public payable nonReentrant {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(weiAmount);

        uint256 totalTokens = _getTokenAmount(weiAmount);
        uint256 burnAmount = (totalTokens * BURN_RATE) / 100;
        uint256 netTokens = totalTokens - burnAmount;

        weiRaised += weiAmount;

        require(token.transfer(msg.sender, netTokens), "Token transfer failed");

        address burnAddress = address(0x000000000000000000000000000000000000dEaD);
        require(token.transfer(burnAddress, burnAmount), "Token burn failed");

        wallet.transfer(weiAmount);

        emit TokensPurchased(msg.sender, weiAmount, netTokens);
        emit TokensBurned(burnAmount);
    }

    function _preValidatePurchase(uint256 weiAmount) internal view {
        require(block.timestamp >= saleStartTime, "Sale not started");
        require(block.timestamp <= saleEndTime, "Sale ended");
        require(weiAmount >= minPurchase, "Purchase below minimum");
        require(weiAmount <= maxPurchase, "Purchase above maximum");
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount * rate;
    }

    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        rate = newRate;
    }

    function setSalePeriod(uint256 newStartTime, uint256 newEndTime) external onlyOwner {
        require(newStartTime >= block.timestamp, "Start time must be in the future");
        require(newEndTime > newStartTime, "End time must be after start time");
        saleStartTime = newStartTime;
        saleEndTime = newEndTime;
    }

    function setPurchaseLimits(uint256 newMinPurchase, uint256 newMaxPurchase) external onlyOwner {
        require(newMinPurchase > 0, "Min purchase must be greater than 0");
        require(newMaxPurchase >= newMinPurchase, "Max purchase must be >= min purchase");
        minPurchase = newMinPurchase;
        maxPurchase = newMaxPurchase;
    }

    function endSale() external onlyOwner {
        require(block.timestamp > saleEndTime || block.timestamp > saleStartTime, "Sale not started");

        uint256 unsoldTokens = token.balanceOf(address(this));
        if (unsoldTokens > 0) {
            require(token.transfer(owner(), unsoldTokens), "Token transfer failed");
        }
    }
}