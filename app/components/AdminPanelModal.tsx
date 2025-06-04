/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useWeb3 } from "./Web3Provider";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Settings,
  Calendar,
  Clock,
  CircleDollarSign,
  Coins,
  ShieldCheck,
  X,
  Tag,
  Lock,
  Unlock,
  Wallet,
  Users,
  DollarSign,
} from "lucide-react";
import { ethers } from "ethers";

// Define our local Round type for display purposes
interface Round {
  roundId: number;
  tokenPrice: number;
  tokenAmount: number;
  soldAmount: number;
  startTime: string;
  endTime: string;
}

interface Investment {
  usdtAmount: string;
  usdcAmount: string;
  daiAmount: string;
}

interface InvestorDetails {
  address: string;
  totalTokens: string;
  investments: Investment;
  roundTokens?: string;
}

interface ContractError extends Error {
  message: string;
  code?: string | number;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshRounds?: () => Promise<void>;
}

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  refreshRounds = async () => { }, // Provide default empty function
}) => {
  const [activeTab, setActiveTab] = useState("rounds");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isConnected, account, ...web3 } = useWeb3();

  // Round Management States
  const [roundId, setRoundId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [extendRoundId, setExtendRoundId] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [endRoundId, setEndRoundId] = useState("");
  const [rounds, setRounds] = useState<Round[]>([]);

  // Token Management States
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recoverTokenAddress, setRecoverTokenAddress] = useState("");
  const [recoverAmount, setRecoverAmount] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

  // Withdrawal Management States
  const [withdrawalRoundId, setWithdrawalRoundId] = useState("");
  const [fundsRaised, setFundsRaised] = useState("");

  // Security Controls States
  const [slippageBasisPoints, setSlippageBasisPoints] = useState("");
  const [newWallet, setNewWallet] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // Investor Management States
  const [investorAddress, setInvestorAddress] = useState("");
  const [investorRoundId, setInvestorRoundId] = useState("");
  const [refundRoundId, setRefundRoundId] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [unsoldRefundRoundId, setUnsoldRefundRoundId] = useState("");
  const [investors, setInvestors] = useState<string[]>([]);
  const [investorDetails, setInvestorDetails] =
    useState<InvestorDetails | null>(null);

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchRounds();
      fetchFundsRaised();
      fetchInvestors();
      checkPauseStatus();
    }
  }, [isOpen, isConnected]);

  const fetchRounds = async () => {
    try {
      const contractRounds = await web3.getRounds();
      const formattedRounds: Round[] = contractRounds.map((round) => ({
        roundId: round.roundId,
        tokenPrice: round.tokenPrice,
        tokenAmount: round.tokenAmount,
        soldAmount: round.soldAmount,
        startTime: new Date(round.startTime * 1000).toLocaleString(),
        endTime: new Date(round.endTime * 1000).toLocaleString(),
      }));
      setRounds(formattedRounds);
    } catch (error) {
      console.error("Failed to fetch rounds:", error);
      setRounds([]);
    }
  };

  const fetchFundsRaised = async () => {
    try {
      const funds = await web3.getFundsRaised();
      setFundsRaised(funds);
    } catch (error) {
      console.error("Failed to fetch funds raised:", error);
      setFundsRaised("0");
    }
  };

  const fetchInvestors = async () => {
    try {
      const investorList = await web3.getPrivateInvestors();
      setInvestors(investorList);
    } catch (error) {
      console.error("Failed to fetch investors:", error);
      setInvestors([]);
    }
  };

  const checkPauseStatus = async () => {
    try {
      const isPausedStatus = await web3.getPauseStatus();
      setIsPaused(isPausedStatus);
    } catch (error) {
      console.error("Failed to check pause status:", error);
    }
  };

  const handleCreateRound = async () => {
    if (!isConnected || !account) {
      setErrorMessage("Please connect wallet");
      return;
    }
    if (!roundId || !startTime || !endTime || !tokenPrice || !tokenAmount) {
      setErrorMessage("All fields are required");
      return;
    }
    const roundIdNum = parseInt(roundId);
    const price = Math.round(parseFloat(tokenPrice) * 100) / 100; 
    const amount = parseInt(tokenAmount);
    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    if (startTimestamp <= now || endTimestamp <= startTimestamp) {
      setErrorMessage("Invalid timestamps");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.createRound(
        roundIdNum,
        price,
        amount,
        startTimestamp,
        endTimestamp
      );
      if (result.success) {
        setSuccessMessage("Round created successfully");
        await refreshRounds();
        await fetchRounds();
        setRoundId("");
        setStartTime("");
        setEndTime("");
        setTokenPrice("");
        setTokenAmount("");
      } else {
        setErrorMessage(result.message || "Failed to create round");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndRound = async () => {
    if (!endRoundId) {
      setErrorMessage("Round ID is required");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.endRound(parseInt(endRoundId));
      if (result.success) {
        setSuccessMessage("Round ended successfully");
        await fetchRounds();
        setEndRoundId("");
      } else {
        setErrorMessage(result.message || "Failed to end round");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtendRound = async () => {
    if (!extendRoundId || !newEndTime) {
      setErrorMessage("All fields are required");
      return;
    }
    const newEndTimestamp = Math.floor(new Date(newEndTime).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    if (newEndTimestamp <= now) {
      setErrorMessage("New end time must be in the future");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.extendRound(
        parseInt(extendRoundId),
        newEndTimestamp
      );
      if (result.success) {
        setSuccessMessage("Round extended successfully");
        await fetchRounds();
        setExtendRoundId("");
        setNewEndTime("");
      } else {
        setErrorMessage(result.message || "Failed to extend round");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveTokens = async () => {
    if (!approveSpender || !approveAmount) {
      setErrorMessage("All fields are required");
      return;
    }
    if (!ethers.isAddress(approveSpender)) {
      setErrorMessage("Invalid spender address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.approveTokens(approveSpender, approveAmount);
      if (result.success) {
        setSuccessMessage("Tokens approved successfully");
        setApproveSpender("");
        setApproveAmount("");
      } else {
        setErrorMessage(result.message || "Failed to approve tokens");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferTokens = async () => {
    if (!transferRecipient || !transferAmount) {
      setErrorMessage("All fields are required");
      return;
    }
    if (!ethers.isAddress(transferRecipient)) {
      setErrorMessage("Invalid recipient address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.transferTokens(
        transferRecipient,
        transferAmount
      );
      if (result.success) {
        setSuccessMessage("Tokens transferred successfully");
        setTransferRecipient("");
        setTransferAmount("");
      } else {
        setErrorMessage(result.message || "Failed to transfer tokens");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverToken = async () => {
    if (!recoverTokenAddress || !recoverAmount) {
      setErrorMessage("All fields are required");
      return;
    }
    if (!ethers.isAddress(recoverTokenAddress)) {
      setErrorMessage("Invalid token address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.recoverToken(
        recoverTokenAddress,
        recoverAmount
      );
      if (result.success) {
        setSuccessMessage("Tokens recovered successfully");
        setRecoverTokenAddress("");
        setRecoverAmount("");
      } else {
        setErrorMessage(result.message || "Failed to recover tokens");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckBalance = async () => {
    if (!balanceAddress) {
      setErrorMessage("Address is required");
      return;
    }
    if (!ethers.isAddress(balanceAddress)) {
      setErrorMessage("Invalid address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const balance = await web3.getTokenBalance(balanceAddress);
      setTokenBalance(balance);
      setSuccessMessage(`Balance: ${balance} QSE`);
    } catch (error) {
      setErrorMessage("Failed to fetch balance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitiateWithdrawal = async () => {
    if (!withdrawalRoundId) {
      setErrorMessage("Round ID is required");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.initiateWithdrawal(parseInt(withdrawalRoundId));
      if (result.success) {
        setSuccessMessage("Withdrawal initiated successfully");
        setWithdrawalRoundId("");
      } else {
        setErrorMessage(result.message || "Failed to initiate withdrawal");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelWithdrawal = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.cancelWithdrawal();
      if (result.success) {
        setSuccessMessage("Withdrawal cancelled successfully");
      } else {
        setErrorMessage(result.message || "Failed to cancel withdrawal");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.withdraw();
      if (result.success) {
        setSuccessMessage("Funds withdrawn successfully");
        await fetchFundsRaised();
      } else {
        setErrorMessage(result.message || "Failed to withdraw funds");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePause = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.pause();
      if (result.success) {
        setSuccessMessage("Contract paused successfully");
        setIsPaused(true);
      } else {
        setErrorMessage(result.message || "Failed to pause contract");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpause = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.unpause();
      if (result.success) {
        setSuccessMessage("Contract unpaused successfully");
        setIsPaused(false);
      } else {
        setErrorMessage(result.message || "Failed to unpause contract");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetSlippage = async () => {
    if (!slippageBasisPoints) {
      setErrorMessage("Slippage value is required");
      return;
    }
    const slippage = parseInt(slippageBasisPoints);
    if (slippage < 0 || slippage > 10000) {
      setErrorMessage("Slippage must be between 0 and 10000 basis points");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.setDefaultSlippageTolerance(slippage);
      if (result.success) {
        setSuccessMessage("Slippage tolerance set successfully");
        setSlippageBasisPoints("");
      } else {
        setErrorMessage(result.message || "Failed to set slippage tolerance");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetWallet = async () => {
    if (!newWallet) {
      setErrorMessage("Wallet address is required");
      return;
    }
    if (!ethers.isAddress(newWallet)) {
      setErrorMessage("Invalid wallet address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.setWallet(newWallet);
      if (result.success) {
        setSuccessMessage("Wallet updated successfully");
        setNewWallet("");
      } else {
        setErrorMessage(result.message || "Failed to update wallet");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!newOwner) {
      setErrorMessage("New owner address is required");
      return;
    }
    if (!ethers.isAddress(newOwner)) {
      setErrorMessage("Invalid owner address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.transferOwnership(newOwner);
      if (result.success) {
        setSuccessMessage("Ownership transferred successfully");
        setNewOwner("");
      } else {
        setErrorMessage(result.message || "Failed to transfer ownership");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchInvestorDetails = async () => {
    if (!investorAddress) {
      setErrorMessage("Investor address is required");
      return;
    }
    if (!ethers.isAddress(investorAddress)) {
      setErrorMessage("Invalid investor address");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const totalTokens = await web3.getTokenAmountForInvestor(investorAddress);
      const investments = await web3.getInvestments(investorAddress);
      let roundTokens;
      if (investorRoundId) {
        roundTokens = await web3.getUserRoundTokenAmount(
          investorAddress,
          parseInt(investorRoundId)
        );
      }
      setInvestorDetails({
        address: investorAddress,
        totalTokens,
        investments,
        ...(roundTokens && { roundTokens }),
      });
      setSuccessMessage("Investor details fetched successfully");
    } catch (error) {
      setErrorMessage("Failed to fetch investor details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundBatch = async () => {
    if (!refundRoundId || !batchSize) {
      setErrorMessage("All fields are required");
      return;
    }
    const batchSizeNum = parseInt(batchSize);
    if (batchSizeNum <= 0) {
      setErrorMessage("Batch size must be positive");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.refundBatch(
        parseInt(refundRoundId),
        batchSizeNum
      );
      if (result.success) {
        setSuccessMessage("Batch refunded successfully");
        setRefundRoundId("");
        setBatchSize("");
      } else {
        setErrorMessage(result.message || "Failed to refund batch");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundUnsoldTokens = async () => {
    if (!unsoldRefundRoundId) {
      setErrorMessage("Round ID is required");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await web3.refundUnsoldToken(
        parseInt(unsoldRefundRoundId)
      );
      if (result.success) {
        setSuccessMessage("Unsold tokens refunded successfully");
        setUnsoldRefundRoundId("");
      } else {
        setErrorMessage(result.message || "Failed to refund unsold tokens");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center backdrop-blur-md z-50">
      <div className="w-full h-full overflow-y-auto">
        <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-4">
          <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl mx-auto my-8 sm:my-12 relative border border-blue-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] pointer-events-none" />
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />
            <div className="p-4 sm:p-6 md:p-8 relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg rotate-3 hover:rotate-0 transition-all duration-500">
                  <ShieldCheck size={20} className="sm:hidden" />
                  <ShieldCheck
                    size={28}
                    className="hidden sm:block text-white"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-blue-100 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-300 hover:text-white bg-blue-800/40 hover:bg-blue-700/80 rounded-lg p-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm ml-auto"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-blue-700/50">
                {[
                  { id: "rounds", label: "Rounds", icon: Calendar },
                  { id: "tokens", label: "Tokens", icon: Coins },
                  { id: "withdrawals", label: "Withdrawals", icon: DollarSign },
                  { id: "security", label: "Security", icon: ShieldCheck },
                  { id: "investors", label: "Investors", icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                        ? "bg-blue-700/60 text-blue-100 border-b-2 border-indigo-500"
                        : "text-gray-300 hover:text-white hover:bg-blue-800/40"
                      }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notifications */}
              {successMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/40 border border-green-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3 animate-fadeIn">
                  <CheckCircle size={16} className="text-green-400 mt-0.5" />
                  <span className="text-green-200">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/40 border border-red-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3 animate-fadeIn">
                  <AlertCircle size={16} className="text-red-400 mt-0.5" />
                  <span className="text-red-200">{errorMessage}</span>
                </div>
              )}

              {/* Round Management Tab */}
              {activeTab === "rounds" && (
                <div className="space-y-6">
                  {/* Create Round Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Tag size={16} className="text-indigo-200" />
                      Create New Round
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Round ID
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Tag size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={roundId}
                            onChange={(e) => setRoundId(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                            placeholder="1"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Token Price (USD)
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <CircleDollarSign
                              size={16}
                              className="text-blue-400"
                            />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={tokenPrice}
                            onChange={(e) => setTokenPrice(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-10 sm:pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                            placeholder="0.00"
                          />
                          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium text-xs sm:text-sm">
                            USD
                          </div>
   
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Token Amount (QSE)
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Coins size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-10 sm:pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                            placeholder="0"
                          />
                          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium text-xs sm:text-sm">
                            QSE
                          </div>
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Start Time
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Clock size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            title="Select start time"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          End Time
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Calendar size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            title="Select end time"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleCreateRound}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Creating Round...</span>
                        </div>
                      ) : (
                        "Create Round"
                      )}
                    </button>
                  </div>

                  {/* Rounds Table */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Calendar size={16} className="text-indigo-200" />
                      Existing Rounds
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="text-blue-200 border-b border-blue-700/50">
                            <th className="py-2 px-4 text-left">Round ID</th>
                            <th className="py-2 px-4 text-left">Token Price</th>
                            <th className="py-2 px-4 text-left">
                              Total Amount
                            </th>
                            <th className="py-2 px-4 text-left">Sold Amount</th>
                            <th className="py-2 px-4 text-left">Start Time</th>
                            <th className="py-2 px-4 text-left">End Time</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rounds.map((round) => (
                            <tr
                              key={round.roundId}
                              className="border-b border-blue-700/50"
                            >
                              <td className="py-2 px-4">{round.roundId}</td>
                              <td className="py-2 px-4">${round.tokenPrice}</td>
                              <td className="py-2 px-4">{round.tokenAmount}</td>
                              <td className="py-2 px-4">{round.soldAmount}</td>
                              <td className="py-2 px-4">{round.startTime}</td>
                              <td className="py-2 px-4">{round.endTime}</td>
                              <td className="py-2 px-4 flex gap-2">
                                <button
                                  onClick={() =>
                                    setEndRoundId(String(round.roundId))
                                  }
                                  className="text-red-400 hover:text-red-300"
                                >
                                  End
                                </button>
                                <button
                                  onClick={() =>
                                    setExtendRoundId(String(round.roundId))
                                  }
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  Extend
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* End Round Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <X size={16} className="text-indigo-200" />
                      End Round
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        Round ID
                      </label>
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                          <Tag size={16} className="text-blue-400" />
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={endRoundId}
                          onChange={(e) => setEndRoundId(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleEndRound}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Ending Round...</span>
                        </div>
                      ) : (
                        "End Round"
                      )}
                    </button>
                  </div>

                  {/* Extend Round Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <ArrowRight size={16} className="text-indigo-200" />
                      Extend Round
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Round ID
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Tag size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={extendRoundId}
                            onChange={(e) => setExtendRoundId(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                            placeholder="1"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          New End Time
                        </label>
                        <div className="relative">
                          <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                            <Calendar size={16} className="text-blue-400" />
                          </div>
                          <input
                            type="datetime-local"
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            title="Select new end time"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleExtendRound}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Extending Round...</span>
                        </div>
                      ) : (
                        "Extend Round"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Token Management Tab */}
              {activeTab === "tokens" && (
                <div className="space-y-6">
                  {/* Approve Tokens Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Coins size={16} className="text-indigo-200" />
                      Approve Tokens
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Spender Address
                        </label>
                        <input
                          type="text"
                          value={approveSpender}
                          onChange={(e) => setApproveSpender(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0x..."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Amount (QSE)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={approveAmount}
                          onChange={(e) => setApproveAmount(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleApproveTokens}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Approving Tokens...</span>
                        </div>
                      ) : (
                        "Approve Tokens"
                      )}
                    </button>
                  </div>

                  {/* Transfer Tokens Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Coins size={16} className="text-indigo-200" />
                      Transfer Tokens
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Recipient Address
                        </label>
                        <input
                          type="text"
                          value={transferRecipient}
                          onChange={(e) => setTransferRecipient(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0x..."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Amount (QSE)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleTransferTokens}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Transferring Tokens...</span>
                        </div>
                      ) : (
                        "Transfer Tokens"
                      )}
                    </button>
                  </div>

                  {/* Recover Tokens Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Coins size={16} className="text-indigo-200" />
                      Recover Tokens
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Token Address
                        </label>
                        <input
                          type="text"
                          value={recoverTokenAddress}
                          onChange={(e) =>
                            setRecoverTokenAddress(e.target.value)
                          }
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0x..."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={recoverAmount}
                          onChange={(e) => setRecoverAmount(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleRecoverToken}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Recovering Tokens...</span>
                        </div>
                      ) : (
                        "Recover Tokens"
                      )}
                    </button>
                  </div>

                  {/* Check Balance Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Coins size={16} className="text-indigo-200" />
                      Check Token Balance
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        Address
                      </label>
                      <input
                        type="text"
                        value={balanceAddress}
                        onChange={(e) => setBalanceAddress(e.target.value)}
                        className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                        placeholder="0x..."
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleCheckBalance}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Checking Balance...</span>
                        </div>
                      ) : (
                        "Check Balance"
                      )}
                    </button>
                    {tokenBalance !== null && (
                      <div className="mt-4 text-indigo-200 text-sm">
                        Balance: {tokenBalance} QSE
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Withdrawal Management Tab */}
              {activeTab === "withdrawals" && (
                <div className="space-y-6">
                  {/* Funds Raised Overview */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <DollarSign size={16} className="text-indigo-200" />
                      Funds Raised
                    </h4>
                    <div className="text-indigo-200 text-sm">
                      Total Funds Raised: {fundsRaised} USD
                    </div>
                  </div>

                  {/* Initiate Withdrawal Form */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <DollarSign size={16} className="text-indigo-200" />
                      Initiate Withdrawal
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        Round ID
                      </label>
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                          <Tag size={16} className="text-blue-400" />
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={withdrawalRoundId}
                          onChange={(e) => setWithdrawalRoundId(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleInitiateWithdrawal}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Initiating Withdrawal...</span>
                        </div>
                      ) : (
                        "Initiate Withdrawal"
                      )}
                    </button>
                  </div>

                  {/* Cancel Withdrawal */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <X size={16} className="text-indigo-200" />
                      Cancel Withdrawal
                    </h4>
                    <button
                      disabled={isSubmitting}
                      onClick={handleCancelWithdrawal}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Cancelling Withdrawal...</span>
                        </div>
                      ) : (
                        "Cancel Withdrawal"
                      )}
                    </button>
                  </div>

                  {/* Withdraw Funds */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <DollarSign size={16} className="text-indigo-200" />
                      Withdraw Funds
                    </h4>
                    <button
                      disabled={isSubmitting}
                      onClick={handleWithdraw}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Withdrawing Funds...</span>
                        </div>
                      ) : (
                        "Withdraw Funds"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Controls Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Pause/Unpause Contract */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <ShieldCheck size={16} className="text-indigo-200" />
                      Contract Pause Control
                    </h4>
                    <div className="flex gap-4">
                      <button
                        disabled={isSubmitting || isPaused}
                        onClick={handlePause}
                        className={`w-full py-3 sm:py-4 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base ${isPaused
                            ? "bg-gray-600"
                            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/30"
                          }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Pausing Contract...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Lock size={16} />
                            Pause Contract
                          </div>
                        )}
                      </button>
                      <button
                        disabled={isSubmitting || !isPaused}
                        onClick={handleUnpause}
                        className={`w-full py-3 sm:py-4 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base ${!isPaused
                            ? "bg-gray-600"
                            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-green-500/30"
                          }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Unpausing Contract...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Unlock size={16} />
                            Unpause Contract
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Set Slippage Tolerance */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Settings size={16} className="text-indigo-200" />
                      Set Slippage Tolerance
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        Slippage (Basis Points)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={slippageBasisPoints}
                        onChange={(e) => setSlippageBasisPoints(e.target.value)}
                        className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                        placeholder="500"
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSetSlippage}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Setting Slippage...</span>
                        </div>
                      ) : (
                        "Set Slippage Tolerance"
                      )}
                    </button>
                  </div>

                  {/* Set Wallet */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Wallet size={16} className="text-indigo-200" />
                      Set Wallet
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        New Wallet Address
                      </label>
                      <input
                        type="text"
                        value={newWallet}
                        onChange={(e) => setNewWallet(e.target.value)}
                        className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                        placeholder="0x..."
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSetWallet}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Setting Wallet...</span>
                        </div>
                      ) : (
                        "Set Wallet"
                      )}
                    </button>
                  </div>

                  {/* Transfer Ownership */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <ShieldCheck size={16} className="text-indigo-200" />
                      Transfer Ownership
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        New Owner Address
                      </label>
                      <input
                        type="text"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                        className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                        placeholder="0x..."
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleTransferOwnership}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Transferring Ownership...</span>
                        </div>
                      ) : (
                        "Transfer Ownership"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Investor Management Tab */}
              {activeTab === "investors" && (
                <div className="space-y-6">
                  {/* Investor List */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Users size={16} className="text-indigo-200" />
                      Private Investors
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="text-blue-200 border-b border-blue-700/50">
                            <th className="py-2 px-4 text-left">Address</th>
                            <th className="py-2 px-4 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investors.map((investor) => (
                            <tr
                              key={investor}
                              className="border-b border-blue-700/50"
                            >
                              <td className="py-2 px-4">{investor}</td>
                              <td className="py-2 px-4">
                                <button
                                  onClick={() => setInvestorAddress(investor)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fetch Investor Details */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Users size={16} className="text-indigo-200" />
                      Investor Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Investor Address
                        </label>
                        <input
                          type="text"
                          value={investorAddress}
                          onChange={(e) => setInvestorAddress(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0x..."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Round ID (Optional)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={investorRoundId}
                          onChange={(e) => setInvestorRoundId(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="1"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleFetchInvestorDetails}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Fetching Details...</span>
                        </div>
                      ) : (
                        "Fetch Investor Details"
                      )}
                    </button>
                    {investorDetails && (
                      <div className="mt-4 text-indigo-200 text-sm">
                        <p>
                          <strong>Address:</strong> {investorDetails.address}
                        </p>
                        <p>
                          <strong>Total Tokens:</strong>{" "}
                          {investorDetails.totalTokens} QSE
                        </p>
                        <p>
                          <strong>Investments:</strong>
                        </p>
                        <ul className="list-disc pl-5">
                          <li>
                            USDT: {investorDetails.investments.usdtAmount} USD
                          </li>
                          <li>
                            USDC: {investorDetails.investments.usdcAmount} USD
                          </li>
                          <li>
                            DAI: {investorDetails.investments.daiAmount} USD
                          </li>
                        </ul>
                        {investorDetails.roundTokens !== null && (
                          <p>
                            <strong>Round Tokens:</strong>{" "}
                            {investorDetails.roundTokens} QSE
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Refund Batch */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <DollarSign size={16} className="text-indigo-200" />
                      Refund Batch
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Round ID
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={refundRoundId}
                          onChange={(e) => setRefundRoundId(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="1"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                          Batch Size
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={batchSize}
                          onChange={(e) => setBatchSize(e.target.value)}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleRefundBatch}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Processing Refund...</span>
                        </div>
                      ) : (
                        "Refund Batch"
                      )}
                    </button>
                  </div>

                  {/* Refund Unsold Tokens */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner">
                    <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base mb-4">
                      <Coins size={16} className="text-indigo-200" />
                      Refund Unsold Tokens
                    </h4>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                        Round ID
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={unsoldRefundRoundId}
                        onChange={(e) => setUnsoldRefundRoundId(e.target.value)}
                        className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                        placeholder="1"
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      onClick={handleRefundUnsoldTokens}
                      className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Refunding Tokens...</span>
                        </div>
                      ) : (
                        "Refund Unsold Tokens"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
