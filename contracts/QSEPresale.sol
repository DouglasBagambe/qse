// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "./QSE.sol";

/**
 * @title Presale contract
 * @notice Create and manage presales of QSE token
 */
contract QSEPresale is Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Stable coin address and Uniswap v3 SwapRouter02 address on Arbitrum One and Arbitrum Sepolia testnet
    address private immutable USDT =
        block.chainid == 42161
            ? 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 // Checksummed address for Arbitrum One USDT
            : 0x70C19cAE7F2e0298c64cB219e6408ef7b0726CE8;

    address private immutable USDC =
        block.chainid == 42161
            ? 0xaf88d065e77c8cC2239327C5EDb3A432268e5831 // Checksummed address for Arbitrum One USDC
            : 0x0e6538E2888c56247211C116390EE43DBAc0f6b4;

    address private immutable DAI =
        block.chainid == 42161
            ? 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1 // Checksummed address for Mainnet DAI
            : 0x8682F1d14E9C5A38f25BF849d0013123B5Db699C;

    address private immutable V2ROUTER02 =
        0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;

    /// @dev owner address
    address private _owner;

    /// @dev Token Interfaces
    QSE public immutable token;
    IERC20 public immutable USDTInterface = IERC20(USDT);
    IERC20 public immutable USDCInterface = IERC20(USDC);
    IERC20 public immutable DAIInterface = IERC20(DAI);
    IUniswapV2Router02 public immutable router = IUniswapV2Router02(V2ROUTER02);

    /// @dev Round struct
    struct Round {
        uint8 roundId;
        uint256 tokenPrice;
        uint256 tokenAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 soldAmount;
        uint256 vestingDuration;
        uint8 releasePercentageAtTGE;
        uint8 releasePercentageInVestingPerMonth;
    }

    /// @dev UserInfo struct
    struct UserInfo {
        uint256 amountBought;
        uint256 amountClaimed;
        uint256 lastClaimTime;
        bool tgeCompleted;
        uint256 initialClaimAmount;
        uint256 monthlyVestingAmount;
        uint256 vestingStartTime;
        uint256 vestingEndTime;
    }

    /// @dev Amount of funds raised from Presale
    uint256 public fundsRaised;

    /// @dev wallet account for raising funds.
    address public wallet;

    /// @dev Tracks investors
    address[] public investors;

    /// @dev Tracks the last refunded index
    uint256 public lastRefundedIndex;

    /// @dev Ensure to protect front-running while withdrawing
    uint256 public constant WITHDRAWAL_DELAY = 5 minutes;
    uint256 public constant VESTING_TIME_UNIT = 20 minutes;
    uint256 public withdrawStartTime;
    uint8 public pendingWithdrawalRound;
    bool public withdrawalInitiated;

    uint256 public tgeTime; // Time when Token Generation Event occurs
    bool public isTgeSet; // Flag to check if TGE time has been set

    /// @dev Tracks rounds
    mapping(uint8 => Round) public rounds;

    /// @dev Tracks contributions of investors, how the investors invest with which coin
    mapping(address => mapping(address => uint256)) public investments;

    /// @dev Tracks token amount of investors
    mapping(address => uint256) public investorTokenBalance;

    /// @dev Tracks userInfo in each presale round
    mapping(address => mapping(uint8 => UserInfo)) public userRoundPurchases;
    mapping(address => uint8[]) public userRounds;

    /// @dev Tracks if the user is investor or not
    mapping(address => bool) private isInvestor;

    /**
     * @dev event for creating round
     * @param roundId roundId
     * @param tokenPrice token price
     * @param tokenAmount token amount
     * @param startTime start time of round
     * @param endTime end time of round
     */
    event RoundCreated(
        uint8 roundId,
        uint256 tokenPrice,
        uint256 tokenAmount,
        uint256 startTime,
        uint256 endTime
    );

    /**
     * @dev event for ending a round early
     * @param roundId roundId
     * @param endTime time when the round was ended
     */
    event RoundEnded(uint8 indexed roundId, uint256 endTime);

    /**
     * @dev event for extending a round
     * @param roundId roundId
     * @param newEndTime new end time for the round
     */
    event RoundExtended(uint8 indexed roundId, uint256 newEndTime);

    /**
     * @dev event for transferring tokens before round start for presale
     * @param roundId roundId
     */
    event TokensTransferredForRound(uint256 amount, uint8 roundId);

    /**
     * @dev event for buying token
     * @param buyer buyer who bought token
     * @param roundId roundId
     * @param tokensBought   the bought token amount
     * @param amountPaid the amount of payment user spent for buying token
     * @param timestamp  At specific time who buy tx occured
     */
    event TokensBought(
        address indexed buyer,
        uint8 roundId,
        uint256 indexed tokensBought,
        uint256 indexed amountPaid,
        uint256 timestamp
    );

    /**
     * @dev event for claiming token
     * @param caller individual user for claiming tokens
     * @param tokenAmount token amount user trying to claim
     * @param timestamp time for claiming tokens
     */
    event TokensClaimed(
        address indexed caller,
        uint256 indexed tokenAmount,
        uint256 timestamp
    );

    /**
     * @dev event for updating investor record
     * @param investor investor address
     * @param roundId roundId
     * @param tokenAmount token amount
     * @param coinAmount coin amount
     */
    event InvestorRecordUpdated(
        address indexed investor,
        uint8 indexed roundId,
        uint256 tokenAmount,
        uint256 coinAmount
    );

    /**
     * @dev event for refunding all
     * @param caller owner calling the function
     * @param fundsAmount amount of fund refunded
     * @param timestamp time for refunding funds
     */
    event FundsRefunded(
        address indexed caller,
        uint256 indexed fundsAmount,
        uint256 timestamp
    );

    /**
     * @dev event for initializing the withdrawn of contract balance for preventing reentrancy attack
     * @param roundId roundId
     * @param unlockTime locking time period
     */
    event WithdrawalInitiated(uint8 indexed roundId, uint256 unlockTime);

    /**
     * @dev event for canceling the withdrawn of contract banace during withdrawl initiation time
     * @param roundId roundId
     */
    event WithdrawalCancelled(uint8 indexed roundId);

    /**
     *@dev event for withdrawing funds
     * @param wallet wallet address
     * @param usdtBalance usdt balance
     * @param usdcBalance usdc balance
     * @param daiBalance dai balance
     * @param timestamp timestamp
     */
    event FundsWithdrawn(
        address indexed wallet,
        uint256 usdtBalance,
        uint256 usdcBalance,
        uint256 daiBalance,
        uint256 timestamp
    );

    /// @dev event for updating wallet address for withdrawing contract balance
    event WalletUpdated(address indexed oldWallet, address indexed newWallet);

    /// @dev event for transferring ownership
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev event for refunding unsold tokens in presale round
     * @param roundId roundId
     * @param amount unsold token amount for refunding
     * @param timestamp time for refunding unsold token
     */
    event UnsoldTokensRefunded(
        uint8 indexed roundId,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev event for updating round
     * @param roundId roundId
     */
    event RefundComplete(uint8 indexed roundId);

    /**
     * @dev event for setting TGE event
     */
    event TGETimeSet(uint256 tgeTime);

    /// @dev validate if address is non-zero
    modifier notZeroAddress(address address_) {
        require(address_ != address(0), "Invalid address");
        _;
    }

    /// @dev validate if user is owner or not.
    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert NotOwner(); // Revert with custom error
        }
        _;
    }

    /// @dev validate if round is active
    modifier roundActive(uint8 roundId_) {
        Round storage round = rounds[roundId_];
        require(
            block.timestamp >= round.startTime &&
                block.timestamp <= round.endTime,
            "Round is not active"
        );
        _;
    }

    //Define a custom error for not being the owner
    error NotOwner();

    /**
     * @dev constructor for presale
     * @param tokenAddress_ deployed QSE token address, // 0x810fa...
     */
    constructor(address tokenAddress_) notZeroAddress(tokenAddress_) {
        _owner = msg.sender;

        token = QSE(tokenAddress_);
    }

    /**
     * @dev function for creating round
     * @param roundId_ round id
     * @param tokenPrice_ token price
     * @param tokenAmount_ token amount
     * @param startTime_ start time of round
     * @param endTime_ end time of round
     * @param vestingDuration_ vesting duration
     * @param releasePercentageAtTGE_  release percentage at TGE event
     * @param releasePercentageInVestingPerMonth_ release percentage in vesting per month
     */
    function createRound(
        uint8 roundId_,
        uint256 tokenPrice_,
        uint256 tokenAmount_,
        uint256 startTime_,
        uint256 endTime_,
        uint256 vestingDuration_,
        uint8 releasePercentageAtTGE_,
        uint8 releasePercentageInVestingPerMonth_
    ) external onlyOwner {
        require(rounds[roundId_].startTime == 0, "Round already exists");
        require(
            block.timestamp < startTime_ && startTime_ < endTime_,
            "Invalid time for round"
        );
        require(
            releasePercentageAtTGE_ +
                (releasePercentageInVestingPerMonth_ *
                    (vestingDuration_ / VESTING_TIME_UNIT)) ==
                100,
            "Invalid vesting percentages"
        );
        require(tokenPrice_ > 0, "Invalid token price");
        require(tokenAmount_ > 0, "Invalid token amount");
        require(
            token.balanceOf(msg.sender) >= tokenAmount_,
            "Insufficient balance"
        );

        rounds[roundId_] = Round({
            roundId: roundId_,
            tokenPrice: tokenPrice_,
            tokenAmount: tokenAmount_,
            startTime: startTime_,
            endTime: endTime_,
            soldAmount: 0,
            vestingDuration: vestingDuration_,
            releasePercentageAtTGE: releasePercentageAtTGE_,
            releasePercentageInVestingPerMonth: releasePercentageInVestingPerMonth_
        });

        SafeERC20.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            tokenAmount_
        );

        emit TokensTransferredForRound(tokenAmount_, roundId_);

        emit RoundCreated(
            roundId_,
            tokenPrice_,
            tokenAmount_,
            startTime_,
            endTime_
        );
    }

    /**
     * @dev Internal functions to purchase QSE token with Stable Coin like USDT, USDC, DAI
     * @param coin_ The stablecoin interface being used
     * @param tokenAmount_ QSE token amount users willing to buy with Stable Coin
     * @param roundId_ round id
     */
    function _buyWithCoin(
        IERC20 coin_,
        uint256 tokenAmount_,
        uint8 roundId_
    ) private whenNotPaused nonReentrant roundActive(roundId_) {
        uint256 _coinAmount = estimatedCoinAmountForTokenAmount(
            tokenAmount_,
            coin_,
            roundId_
        );

        require(
            _coinAmount <= coin_.allowance(msg.sender, address(this)),
            "Insufficient allowance"
        );
        require(
            _coinAmount <= coin_.balanceOf(msg.sender),
            "Insufficient balance."
        );

        uint256 _tokensAvailable = tokensAvailable(roundId_);

        require(
            tokenAmount_ <= _tokensAvailable && tokenAmount_ > 0,
            "Invalid token amount to buy"
        );

        SafeERC20.safeTransferFrom(
            coin_,
            msg.sender,
            address(this),
            _coinAmount
        );

        _updateInvestorRecords(
            msg.sender,
            tokenAmount_,
            coin_,
            _coinAmount,
            roundId_
        );

        emit TokensBought(
            msg.sender,
            roundId_,
            tokenAmount_,
            _coinAmount,
            block.timestamp
        );
    }

    /**
     * @dev buy token with USDT
     * @param tokenAmount_ token amount
     * @param roundId_ round id
     */
    function buyWithUSDT(
        uint256 tokenAmount_,
        uint8 roundId_
    ) external whenNotPaused {
        _buyWithCoin(USDTInterface, tokenAmount_, roundId_);
    }

    /**
     * @dev buy token with USDC
     * @param tokenAmount_ token amount
     * @param roundId_ round id
     */
    function buyWithUSDC(
        uint256 tokenAmount_,
        uint8 roundId_
    ) external whenNotPaused {
        _buyWithCoin(USDCInterface, tokenAmount_, roundId_);
    }

    /**
     * @dev buy token with DAI
     * @param tokenAmount_ token amount
     * @param roundId_ round id
     */
    function buyWithDAI(
        uint256 tokenAmount_,
        uint8 roundId_
    ) external whenNotPaused {
        _buyWithCoin(DAIInterface, tokenAmount_, roundId_);
    }

    /**
     * @dev Helper function to update investor records
     * @param investor_ investor address
     * @param tokenAmount_ token amount
     * @param coin_ coin interface
     * @param coinAmount_ coin amount
     * @param roundId_ round id
     */
    function _updateInvestorRecords(
        address investor_,
        uint256 tokenAmount_,
        IERC20 coin_,
        uint256 coinAmount_,
        uint8 roundId_
    ) private {
        Round storage round = rounds[roundId_];
        UserInfo storage purchase = userRoundPurchases[investor_][roundId_];
        if (!isInvestor[investor_]) {
            isInvestor[investor_] = true;
            investors.push(investor_);
        }

        if (purchase.amountBought == 0) {
            userRounds[investor_].push(roundId_);
        }

        purchase.amountBought += tokenAmount_;
        purchase.lastClaimTime = 0;
        purchase.tgeCompleted = false;
        purchase.initialClaimAmount +=
            (tokenAmount_ * round.releasePercentageAtTGE) /
            100;
        purchase.monthlyVestingAmount +=
            (tokenAmount_ * round.releasePercentageInVestingPerMonth) /
            100;
        purchase.vestingStartTime = 0;
        purchase.vestingEndTime = 0;

        investments[investor_][address(coin_)] += coinAmount_;
        investorTokenBalance[investor_] += tokenAmount_;
        rounds[roundId_].soldAmount += tokenAmount_;

        // Normalize fundsRaised to 6 decimals for consistency
        uint8 _coinDecimals = getCoinDecimals(coin_);
        if (_coinDecimals > 6) {
            fundsRaised += coinAmount_ / (10 ** (_coinDecimals - 6));
        } else {
            fundsRaised += coinAmount_ * (10 ** (6 - _coinDecimals));
        }

        emit InvestorRecordUpdated(
            investor_,
            roundId_,
            tokenAmount_,
            coinAmount_
        );
    }

    /**
     * @dev Helper function to calculate the token amount available with coin (like usdt, usdc, dai)
     * @param coinAmount_ coin (like usdt, usdc, dai) amount
     * @param coin_ coin type
     * @param roundId_ round id
     * @return _tokenAmount calculated token amount
     */
    function estimatedTokenAmountAvailableWithCoin(
        uint256 coinAmount_,
        IERC20 coin_,
        uint8 roundId_
    ) public view roundActive(roundId_) returns (uint256) {
        uint8 _coinDecimals = getCoinDecimals(coin_);
        uint256 _tokenAmount = (coinAmount_ *
            (10 ** (18 - _coinDecimals + 6))) / rounds[roundId_].tokenPrice;

        return _tokenAmount;
    }

    /**
     * @dev Helper function to calculate coin amount for buying a certain amount of tokens. When user inputs tokenAmount and corresponding coinAmount is shown automatically
     * Takes into consideration price thresholds and returns the total coin amount needed.
     * @param tokenAmount_ token amount
     * @param coin_ stable coin type
     * @return _coinAmount calculated coin amount
     */
    function estimatedCoinAmountForTokenAmount(
        uint256 tokenAmount_,
        IERC20 coin_,
        uint8 roundId_
    ) public view roundActive(roundId_) returns (uint256) {
        uint8 _coinDecimals = getCoinDecimals(coin_);
        uint256 _coinAmount = (tokenAmount_ * rounds[roundId_].tokenPrice) /
            (10 ** (18 - _coinDecimals + 6));
        return _coinAmount;
    }

    /**
     * @dev buy token with ETH
     * @param roundId_ round id
     */
    function buyWithETH(
        uint8 roundId_
    ) external payable whenNotPaused nonReentrant roundActive(roundId_) {
        uint256 _estimatedTokenAmount = estimatedTokenAmountAvailableWithETH(
            msg.value,
            roundId_
        );

        uint256 _tokensAvailable = tokensAvailable(roundId_);

        require(
            _estimatedTokenAmount <= _tokensAvailable &&
                _estimatedTokenAmount > 0,
            "Invalid token amount to buy"
        );

        uint256 _minUSDTOutput = (estimatedCoinAmountForTokenAmount(
            _estimatedTokenAmount,
            USDTInterface,
            roundId_
        ) * 90) / 100;

        // Setup ETH to USDT swap
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = USDT;

        uint256[] memory amounts = router.swapExactETHForTokens{
            value: msg.value
        }(_minUSDTOutput, path, address(this), block.timestamp + 15 minutes);

        // Ensure the swap was successful
        require(amounts.length > 1, "Swap failed, no USDT received");
        uint256 _usdtAmount = amounts[1];

        require(
            _usdtAmount >= _minUSDTOutput,
            "Swap failed, insufficient USDT received"
        );
        // Calculate final token amount
        uint256 _tokenAmount = estimatedTokenAmountAvailableWithCoin(
            _usdtAmount,
            USDTInterface,
            roundId_
        );

        //Update investor records
        _updateInvestorRecords(
            msg.sender,
            _tokenAmount,
            USDTInterface,
            _usdtAmount,
            roundId_
        );

        emit TokensBought(
            msg.sender,
            roundId_,
            _tokenAmount,
            _usdtAmount,
            block.timestamp
        );
    }

    /**
     * @dev Helper funtion to calculate the token amount available with eth
     * @param ethAmount_ eth Amount
     * @param roundId_ round id
     * @return _tokenAmount calculated token amount
     */
    function estimatedTokenAmountAvailableWithETH(
        uint256 ethAmount_,
        uint8 roundId_
    ) public view roundActive(roundId_) returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = USDT;
        uint256[] memory amounts = router.getAmountsOut(ethAmount_, path);
        require(amounts.length > 1, "Invalid path");
        uint256 _usdtAmount = amounts[1];

        // Calculate token amount
        return
            estimatedTokenAmountAvailableWithCoin(
                _usdtAmount,
                USDTInterface,
                roundId_
            );
    }

    /**
     * @dev Helper funtion to calculate eth amount for buying certain amount of token using Uniswap V3 Quoter
     * @param tokenAmount_ token amount
     * @param roundId_ round id
     * @return _ethAmount calculated eth amount
     */
    function estimatedEthAmountForTokenAmount(
        uint256 tokenAmount_,
        uint8 roundId_
    ) public view roundActive(roundId_) returns (uint256) {
        // Calculate usdt amount for buying token.
        uint256 _usdtAmount = estimatedCoinAmountForTokenAmount(
            tokenAmount_,
            USDTInterface,
            roundId_
        );

        //Swap USDT for ETH
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        // path[1] = MAINNET_USDT;
        path[1] = USDT;
        uint256[] memory amounts = router.getAmountsIn(_usdtAmount, path);
        require(amounts.length > 0, "Invalid path.");

        return amounts[0];
    }

    /**
     * @dev Allows the owner to end a presale round early
     * @param roundId_ The ID of the round to end
     */
    function endRound(uint8 roundId_) external onlyOwner roundActive(roundId_) {
        Round storage round = rounds[roundId_];
        round.endTime = block.timestamp;
        emit RoundEnded(roundId_, block.timestamp);
    }

    /**
     * @dev Allows the owner to extend a presale round
     * @param roundId_ The ID of the round to extend
     * @param newEndTime_ The new end time for the round
     */
    function extendRound(
        uint8 roundId_,
        uint256 newEndTime_
    ) external onlyOwner roundActive(roundId_) {
        Round storage round = rounds[roundId_];
        require(
            newEndTime_ > round.endTime,
            "New end time must be later than current end time"
        );

        round.endTime = newEndTime_;
        emit RoundExtended(roundId_, newEndTime_);
    }

    /**
     * @dev If the Presale fails to reach the soft cap before the end of the self-set time, all funds will be refunded to investors.
     * @param roundId_ round id
     * @param batchSize_ batch size
     */
    function refundBatch(
        uint8 roundId_,
        uint256 batchSize_
    ) external onlyOwner nonReentrant {
        require(
            block.timestamp > rounds[roundId_].endTime,
            "Cannot refund because presale is still in progress."
        );

        uint256 endIndex = lastRefundedIndex + batchSize_ > investors.length
            ? investors.length
            : lastRefundedIndex + batchSize_;

        // Process batch of investors
        for (uint256 i = lastRefundedIndex; i < endIndex; i++) {
            address investor = investors[i];

            // Refund USDT
            uint256 usdtAmount = investments[investor][address(USDTInterface)];
            if (usdtAmount > 0) {
                investments[investor][address(USDTInterface)] = 0;
                SafeERC20.safeTransfer(USDTInterface, investor, usdtAmount);
                emit FundsRefunded(investor, usdtAmount, block.timestamp);
            }

            // Refund USDC
            uint256 usdcAmount = investments[investor][address(USDCInterface)];
            if (usdcAmount > 0) {
                investments[investor][address(USDCInterface)] = 0;
                SafeERC20.safeTransfer(USDCInterface, investor, usdcAmount);
                emit FundsRefunded(investor, usdcAmount, block.timestamp);
            }

            // Refund DAI
            uint256 daiAmount = investments[investor][address(DAIInterface)];
            if (daiAmount > 0) {
                investments[investor][address(DAIInterface)] = 0;
                SafeERC20.safeTransfer(DAIInterface, investor, daiAmount);
                emit FundsRefunded(investor, daiAmount, block.timestamp);
            }
        }

        // Update progress
        lastRefundedIndex = endIndex;

        // Clear state if complete
        if (lastRefundedIndex == investors.length) {
            fundsRaised = 0;
            delete investors;
            lastRefundedIndex = 0;
            emit RefundComplete(roundId_);
        }
    }

    /**
     * @dev Initiate the Withdrawal funds in each round.
     * @param roundId_ round id
     */
    function initiateWithdrawal(uint8 roundId_) external onlyOwner {
        require(
            block.timestamp > rounds[roundId_].endTime,
            "Cannot withdraw because presale is still in progress"
        );
        require(!withdrawalInitiated, "Withdrawal already initiated");
        require(wallet != address(0), "Wallet not set");

        withdrawStartTime = block.timestamp + WITHDRAWAL_DELAY;
        pendingWithdrawalRound = roundId_;
        withdrawalInitiated = true;

        emit WithdrawalInitiated(roundId_, withdrawStartTime);
    }

    /**
     * @dev Withdraw funds from the contract.
     * @param roundId_ round id
     */
    function withdraw(uint8 roundId_) external onlyOwner nonReentrant {
        require(withdrawalInitiated, "Withdrawal not initiated");
        require(roundId_ == pendingWithdrawalRound, "Invalid round");
        require(
            block.timestamp >= withdrawStartTime,
            "Timelock period not ended"
        );

        uint256 _usdtBalance = USDTInterface.balanceOf(address(this));
        uint256 _usdcBalance = USDCInterface.balanceOf(address(this));
        uint256 _daiBalance = DAIInterface.balanceOf(address(this));

        require(
            _usdtBalance > 0 || _usdcBalance > 0 || _daiBalance > 0,
            "No funds available to withdraw after reserving promoter rewards"
        );

        // Reset withdrawal state
        withdrawalInitiated = false;
        withdrawStartTime = 0;

        // Transfer funds
        if (_usdtBalance > 0)
            SafeERC20.safeTransfer(USDTInterface, wallet, _usdtBalance);
        if (_usdcBalance > 0)
            SafeERC20.safeTransfer(USDCInterface, wallet, _usdcBalance);
        if (_daiBalance > 0)
            SafeERC20.safeTransfer(DAIInterface, wallet, _daiBalance);

        fundsRaised = 0;

        emit FundsWithdrawn(
            wallet,
            _usdtBalance,
            _usdcBalance,
            _daiBalance,
            block.timestamp
        );
    }

    /**
     * @dev function to cancel withdrawal if needed.
     * @param roundId_ round id
     */
    function cancelWithdrawal(uint8 roundId_) external onlyOwner {
        require(withdrawalInitiated, "No withdrawal to cancel");
        require(
            roundId_ == pendingWithdrawalRound,
            "Not the pending withdrawal round"
        );

        withdrawalInitiated = false;
        withdrawStartTime = 0;

        emit WithdrawalCancelled(pendingWithdrawalRound);
    }

    /**
     * @dev function to get claimable amount.
     * @param user_ user address
     * @param roundId_ round id
     * @return claimableAmount The total claimable amount including any bonus
     * @return unclaimedPeriodsPassed_ Number of unclaimed vesting periods
     */
    function getClaimableAmount(
        address user_,
        uint8 roundId_
    )
        public
        view
        returns (uint256 claimableAmount, uint8 unclaimedPeriodsPassed_)
    {
        UserInfo storage _purchase = userRoundPurchases[user_][roundId_];

        // Validate purchase exists
        require(_purchase.amountBought > 0, "No tokens purchased");

        // If TGE hasn't occurred yet, nothing is claimable
        if (!isTgeSet || block.timestamp < tgeTime) {
            return (0, 0);
        }

        uint8 maxVestingCount = uint8(
            rounds[roundId_].vestingDuration / VESTING_TIME_UNIT
        );

        // For first claim after TGE
        if (_purchase.lastClaimTime == 0) {
            claimableAmount = _purchase.initialClaimAmount;

            // Calculate vesting periods if any time has passed since TGE
            uint256 timeElapsed = block.timestamp - tgeTime;

            unclaimedPeriodsPassed_ = uint8(timeElapsed / VESTING_TIME_UNIT) >
                maxVestingCount
                ? maxVestingCount
                : uint8(timeElapsed / VESTING_TIME_UNIT);
        } else {
            uint256 timeElapsed = block.timestamp - _purchase.lastClaimTime;
            unclaimedPeriodsPassed_ = uint8(timeElapsed / VESTING_TIME_UNIT) >
                maxVestingCount
                ? maxVestingCount
                : uint8(timeElapsed / VESTING_TIME_UNIT);

            // For subsequent claims, initial amount is already claimed
            claimableAmount = 0;
        }

        // Add vesting amount for passed periods
        if (unclaimedPeriodsPassed_ > 0) {
            uint256 vestingAmount = _purchase.monthlyVestingAmount *
                unclaimedPeriodsPassed_;
            claimableAmount += vestingAmount;
        }

        // Cap at total possible amount
        uint256 remainingAmount = _purchase.amountBought -
            _purchase.amountClaimed;
        if (claimableAmount > remainingAmount) {
            claimableAmount = remainingAmount;
        }

        return (claimableAmount, unclaimedPeriodsPassed_);
    }

    /**
     * @dev claim QSE tokens after presale is finished
     */
    function claimTokens() external whenNotPaused nonReentrant {
        require(isTgeSet, "TGE time not set yet");
        require(block.timestamp >= tgeTime, "TGE has not occurred yet");

        uint256 _totalClaimableAmount = 0;
        uint8[] storage _investorRounds = userRounds[msg.sender];
        uint256[] memory roundClaimAmounts = new uint256[](
            _investorRounds.length
        );

        require(_investorRounds.length > 0, "No rounds to claim");

        // Process each round
        for (uint256 i = 0; i < _investorRounds.length; i++) {
            uint8 _roundId = _investorRounds[i];
            UserInfo storage _purchase = userRoundPurchases[msg.sender][
                _roundId
            ];

            // Initialize vesting parameters if this is the first claim after TGE
            if (_purchase.vestingStartTime == 0) {
                _purchase.vestingStartTime = tgeTime;
                _purchase.vestingEndTime =
                    tgeTime +
                    rounds[_roundId].vestingDuration;
                _purchase.tgeCompleted = true;
            }

            (
                uint256 claimableAmount_,
                uint8 unclaimedPeriodsPassed_
            ) = getClaimableAmount(msg.sender, _roundId);

            roundClaimAmounts[i] = claimableAmount_;

            if (roundClaimAmounts[i] > 0) {
                // Update claimed amount
                _purchase.amountClaimed += roundClaimAmounts[i];

                // Update last claim time
                if (_purchase.lastClaimTime == 0) {
                    // First claim - set to TGE time
                    _purchase.lastClaimTime = tgeTime;
                }

                if (unclaimedPeriodsPassed_ > 0) {
                    // Calculate the exact timestamp of the most recent vesting point
                    uint256 newLastClaimTime = tgeTime +
                        (((block.timestamp - tgeTime) / VESTING_TIME_UNIT) *
                            VESTING_TIME_UNIT);

                    // Safety check to ensure lastClaimTime doesn't exceed current time
                    _purchase.lastClaimTime = newLastClaimTime > block.timestamp
                        ? block.timestamp
                        : newLastClaimTime;
                }
            }

            _totalClaimableAmount += roundClaimAmounts[i];
        }

        require(_totalClaimableAmount > 0, "No tokens available to claim");

        // Transfer tokens after all state updates
        SafeERC20.safeTransfer(token, msg.sender, _totalClaimableAmount);

        emit TokensClaimed(msg.sender, _totalClaimableAmount, block.timestamp);
    }

    /**
     * @dev Helper funtion to set the multisig wallet address for withdrawing funds
     */
    function setWallet(
        address wallet_
    ) external onlyOwner notZeroAddress(wallet_) {
        address _oldWallet = wallet;
        wallet = wallet_;
        emit WalletUpdated(_oldWallet, wallet_);
    }

    /**
     * @dev Sets the Token Generation Event (TGE) time
     * @param tgeTime_ The timestamp when tokens will start to be released
     */
    function setTGETime(uint256 tgeTime_) external onlyOwner {
        require(!isTgeSet, "TGE time already set");
        require(tgeTime_ > block.timestamp, "TGE time must be in the future");

        tgeTime = tgeTime_;
        isTgeSet = true;

        emit TGETimeSet(tgeTime);
    }

    /**
     * @dev Helper funtion to get raised fund
     */
    function getFundsRaised() external view returns (uint256) {
        return fundsRaised;
    }

    /**
     * @dev Helper funtion to get the investor's bought token amount
     * @param investor_ Investor address
     */
    function getTokenAmountForInvestor(
        address investor_
    ) external view returns (uint256) {
        return investorTokenBalance[investor_];
    }

    /**
     * @dev Helper funtion to get current user's investments
     * @param investor_ user address
     * @param coin_ coin Interface
     */
    function getInvestments(
        address investor_,
        IERC20 coin_
    ) external view returns (uint256) {
        return investments[investor_][address(coin_)];
    }

    /**
     * @dev Helper funtion to get all investors
     */
    function getInvestors() external view returns (address[] memory) {
        return investors;
    }

    /**
     * @dev Helper funtion to get remaining tokens available for presale
     * @return amount token balance as uint256 with decimals of 18
     */
    function tokensAvailable(uint8 roundId_) public view returns (uint256) {
        return rounds[roundId_].tokenAmount - rounds[roundId_].soldAmount;
    }

    /**
     * @dev Helper funtion to calculate remaining times left for presale start
     * @param roundId_ round id
     */
    function getRemainingTimeForPresaleStart(
        uint8 roundId_
    ) external view returns (uint256) {
        require(rounds[roundId_].startTime != 0, "Round not set");
        require(
            block.timestamp < rounds[roundId_].startTime,
            "Round already started"
        );
        return rounds[roundId_].startTime - block.timestamp;
    }

    /**
     * @dev Helper funtion to calculate remaining times left for presale end
     * @param roundId_ round id
     */
    function getRemainingTimeForPresaleEnd(
        uint8 roundId_
    ) external view returns (uint256) {
        require(rounds[roundId_].startTime != 0, "Round not set");
        require(block.timestamp <= rounds[roundId_].endTime, "Round has ended");

        return rounds[roundId_].endTime - block.timestamp;
    }

    /**
     * @dev Helper function to calculate remaining time until TGE
     */
    function getRemainingTimeForTGE() external view returns (uint256) {
        require(isTgeSet, "TGE time not set yet");
        if (block.timestamp >= tgeTime) {
            return 0;
        }
        return tgeTime - block.timestamp;
    }

    /**
     * @dev Helper funtion to get coin decimals
     * @param coin_ IERC20 interface
     */
    function getCoinDecimals(IERC20 coin_) private view returns (uint8) {
        return IERC20Metadata(address(coin_)).decimals();
    }

    /**
     * @dev Helper funtion to get round details
     */
    function getRound(
        uint8 roundId_
    ) external view roundActive(roundId_) returns (Round memory) {
        return rounds[roundId_];
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner_) public virtual onlyOwner {
        require(
            newOwner_ != address(0),
            "Ownable: new owner is the zero address"
        );
        address oldOwner = _owner;
        _owner = newOwner_;
        emit OwnershipTransferred(oldOwner, newOwner_);
    }

    /**
     * @dev Helper function to return current owner
     */
    function getOwner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Helper function to get user rounds
     * @param user_ user address
     * @return array of round ids
     */
    function getUserRounds(
        address user_
    ) external view returns (uint8[] memory) {
        return userRounds[user_];
    }

    /**
     * @dev Helper function to get user round purchase
     * @param user_ user address
     * @param roundId_ round id
     */
    function getUserRoundPurchase(
        address user_,
        uint8 roundId_
    )
        external
        view
        returns (
            uint256 amountBought_,
            uint256 amountClaimed_,
            uint256 totalClaimable_,
            bool tgeCompleted_,
            uint256 lastClaimTime_,
            uint8 unclaimedPeriodsPassed_
        )
    {
        UserInfo storage _purchase = userRoundPurchases[user_][roundId_];
        (
            uint256 _claimableAmount,
            uint8 _unclaimedPeriodsPassed
        ) = getClaimableAmount(user_, roundId_);
        bool _isTgeComplete = block.timestamp >= _purchase.vestingStartTime;

        return (
            _purchase.amountBought,
            _purchase.amountClaimed,
            _claimableAmount,
            _isTgeComplete,
            _purchase.lastClaimTime,
            _unclaimedPeriodsPassed
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Helper function to recover tokens that is unexpected sent to contract
     * @param token_ token address
     * @param amount_ amount to recover
     */
    function recoverToken(IERC20 token_, uint256 amount_) external onlyOwner {
        require(
            address(token_) != address(token),
            "Cannot recover presale token"
        );
        SafeERC20.safeTransfer(token_, wallet, amount_);
    }

    /**
     * @dev Refund Unsold tokens in presale round
     * @param roundId_ round id
     */
    function refundUnsoldToken(uint8 roundId_) external onlyOwner {
        Round storage round = rounds[roundId_];
        require(round.startTime != 0, "Round not set");
        require(block.timestamp >= round.endTime, "Round not ended");

        uint256 _unsoldAmount = round.tokenAmount - round.soldAmount;
        require(_unsoldAmount > 0, "No unsold tokens");

        // Update round state
        round.tokenAmount = round.soldAmount;

        // Transfer unsold tokens
        SafeERC20.safeTransfer(token, wallet, _unsoldAmount);

        emit UnsoldTokensRefunded(roundId_, _unsoldAmount, block.timestamp);
    }

    receive() external payable {}
    fallback() external payable {}
}