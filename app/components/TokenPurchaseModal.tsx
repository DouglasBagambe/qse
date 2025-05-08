// app/components/TokenPurchaseModal.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useWeb3, PaymentMethod } from "./Web3Provider";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
  Wallet,
  Clock,
  Calendar,
  ChevronDown,
  Tag,
  CircleDollarSign,
  Coins,
} from "lucide-react";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [qseAmount, setQseAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("ETH");
  const [quickBuyAmount, setQuickBuyAmount] = useState(100);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [rounds, setRounds] = useState<any[]>([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isRoundDropdownOpen, setIsRoundDropdownOpen] = useState(false);
  const {
    connectWallet,
    buyTokens,
    claimTokens,
    getRounds,
    isConnected,
    isConnecting,
    account,
    qseBalance,
    claimableAmount,
    loadQSEBalance,
    supportedPaymentMethods,
    getQSEAmountFromPayment,
    getPaymentRateForMethod,
    currentRound,
    networkError,
  } = useWeb3();

  const MINIMUM_QSE_AMOUNT = 50;
  const quickBuyOptions = [100, 250, 500, 1000, 2500];

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const fetchedRounds = await getRounds();
        setRounds(fetchedRounds);
        if (fetchedRounds.length > 0) {
          const activeRound = fetchedRounds.find(
            (r) =>
              Math.floor(Date.now() / 1000) >= r.startTime &&
              Math.floor(Date.now() / 1000) <= r.endTime
          );
          setSelectedRound(
            selectedRound === null
              ? activeRound
                ? activeRound.roundId
                : fetchedRounds[0].roundId
              : selectedRound
          );
        } else {
          setSelectedRound(null);
        }
      } catch (error) {
        setErrorMessage("Failed to load rounds");
      }
    };

    if (isConnected && account) {
      loadQSEBalance();
      fetchRounds();
    }
    setErrorMessage(networkError || "");
  }, [isConnected, account, selectedRound, networkError]);

  const calculatePaymentFromQSE = (
    qseValue: number,
    method: PaymentMethod,
    roundPrice: number
  ): string => {
    const usdValue = qseValue * roundPrice;
    const paymentRate = getPaymentRateForMethod(method);
    return paymentRate > 0
      ? (usdValue / paymentRate).toFixed(method === "ETH" ? 6 : 6)
      : "0";
  };

  const handleInputChange = async (type: "payment" | "qse", value: string) => {
    if (type === "payment") {
      setPaymentAmount(value);
      if (isConnected && value && !isNaN(parseFloat(value)) && selectedRound) {
        const tokens = await getQSEAmountFromPayment(
          value,
          selectedPaymentMethod,
          selectedRound
        );
        setQseAmount(tokens.toFixed(2));
      } else {
        setQseAmount("");
      }
    } else {
      setQseAmount(value);
      if (value && !isNaN(parseFloat(value)) && selectedRound) {
        const round = rounds.find((r) => r.roundId === selectedRound);
        setPaymentAmount(
          calculatePaymentFromQSE(
            parseFloat(value),
            selectedPaymentMethod,
            round.tokenPrice
          )
        );
      } else {
        setPaymentAmount("");
      }
    }
  };

  const handleQuickBuySelect = (amount: number) => {
    setQuickBuyAmount(amount);
    if (selectedRound) {
      const round = rounds.find((r) => r.roundId === selectedRound);
      setQseAmount(amount.toString());
      setPaymentAmount(
        calculatePaymentFromQSE(amount, selectedPaymentMethod, round.tokenPrice)
      );
    }
  };

  const validatePurchase = (): boolean => {
    if (!isConnected) {
      setErrorMessage("Please connect wallet");
      return false;
    }
    if (!selectedRound) {
      setErrorMessage("No rounds available");
      return false;
    }
    const round = rounds.find((r) => r.roundId === selectedRound);
    if (!round) {
      setErrorMessage("Selected round not found");
      return false;
    }
    const now = Math.floor(Date.now() / 1000);
    if (now < round.startTime) {
      setErrorMessage("Sale not started");
      return false;
    }
    if (now > round.endTime) {
      setErrorMessage("Sale ended");
      return false;
    }
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setErrorMessage(`Enter valid ${selectedPaymentMethod} amount`);
      return false;
    }
    if (!qseAmount || parseFloat(qseAmount) < MINIMUM_QSE_AMOUNT) {
      setErrorMessage(`Minimum ${MINIMUM_QSE_AMOUNT} QSE`);
      return false;
    }
    return true;
  };

  const executePurchase = async () => {
    if (!validatePurchase() || !selectedRound) return;
    setIsSubmitting(true);
    setIsApproving(selectedPaymentMethod !== "ETH");
    try {
      const result = await buyTokens(
        paymentAmount,
        selectedPaymentMethod,
        selectedRound
      );
      if (result.success) {
        setPurchaseCompleted(true);
        setTxHash(
          result.message.match(
            /Transaction successful: (0x[a-fA-F0-9]{64})/
          )?.[1] || ""
        );
        loadQSEBalance();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Purchase failed");
    } finally {
      setIsSubmitting(false);
      setIsApproving(false);
    }
  };

  const handleConnectOrBuy = async () => {
    if (!isConnected) {
      await connectWallet().then((success) => {
        if (success) setTimeout(executePurchase, 500);
      });
    } else {
      executePurchase();
    }
  };

  const handleClaimTokens = async () => {
    setIsSubmitting(true);
    try {
      const result = await claimTokens();
      setErrorMessage(
        result.success ? "Tokens claimed successfully!" : result.message
      );
      if (result.success) {
        setTxHash(
          result.message.match(
            /Tokens claimed successfully: (0x[a-fA-F0-9]{64})/
          )?.[1] || ""
        );
        loadQSEBalance();
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Claim failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoundSelect = (roundId: number) => {
    setSelectedRound(roundId);
    setIsRoundDropdownOpen(false);
  };

  if (!isOpen) return null;

  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleString();
  const roundPrice =
    selectedRound && rounds.find((r) => r.roundId === selectedRound)
      ? rounds.find((r) => r.roundId === selectedRound).tokenPrice
      : 0;

  const getSelectedRound = () =>
    selectedRound && rounds.find((r) => r.roundId === selectedRound);

  const getRoundStatus = (round: any) => {
    const now = Math.floor(Date.now() / 1000);
    if (now < round.startTime) return "upcoming";
    if (now > round.endTime) return "ended";
    return "active";
  };

  const getRoundStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return { text: "ACTIVE", color: "bg-green-500" };
      case "upcoming":
        return { text: "UPCOMING", color: "bg-blue-500" };
      case "ended":
        return { text: "ENDED", color: "bg-gray-500" };
      default:
        return { text: "UNKNOWN", color: "bg-gray-500" };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-start justify-center z-[2000] p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl shadow-2xl w-full max-w-4xl my-6 relative border border-blue-400/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white bg-blue-800/50 p-2 rounded-lg hover:bg-blue-700/70 transition-all z-[3000]"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <div className="p-5 md:p-8 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
              <Wallet size={24} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
              Buy QSE Tokens
            </h2>
          </div>
          {isConnected && (
            <div className="mb-6 flex justify-between items-center p-3 md:p-4 bg-blue-800/40 rounded-xl text-sm border border-blue-500/30 backdrop-blur-md">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-blue-700 p-1.5 md:p-2 rounded-lg">
                  <Wallet size={16} className="md:hidden" />
                  <Wallet size={18} className="hidden md:block" />
                </div>
                <div>
                  <div className="text-gray-300 text-xs">Your QSE Balance</div>
                  <div className="font-semibold text-base md:text-lg">
                    {parseFloat(qseBalance).toFixed(2)}{" "}
                    <span className="text-blue-300">QSE</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-950/70 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm text-blue-300 font-mono truncate max-w-[100px] md:max-w-[200px]">
                {account
                  ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : ""}
              </div>
            </div>
          )}
          {purchaseCompleted ? (
            <div className="text-center py-6 md:py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                <CheckCircle size={32} className="md:hidden text-white" />
                <CheckCircle size={48} className="hidden md:block text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
                Purchase Successful!
              </h3>
              <div className="bg-blue-800/40 border border-blue-500/30 rounded-xl p-4 md:p-6 mb-6 md:mb-8 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-blue-700/50">
                  <span className="text-gray-300">Tokens Purchased:</span>
                  <span className="text-lg md:text-xl font-bold text-white">
                    {qseAmount} QSE
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">Vesting Schedule:</span>
                  <span className="text-blue-300">
                    50% at TGE, 50% after 20 minutes
                  </span>
                </div>
              </div>
              {txHash && (
                <div className="mb-6 p-3 md:p-4 bg-blue-900/60 rounded-xl text-xs break-all max-w-md mx-auto border border-blue-700/50">
                  <p className="font-medium mb-1 text-blue-300">
                    Transaction Hash:
                  </p>
                  <p className="font-mono text-gray-300 select-all">{txHash}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2.5 md:px-8 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:space-x-6">
              <div className="w-full lg:w-3/5">
                <div className="space-y-6">
                  {isConnected && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-800 to-blue-900 rounded-xl border border-indigo-500/30 shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                          <Coins size={20} className="text-indigo-200" />
                        </div>
                        <div>
                          <div className="text-gray-300 text-xs">
                            Available to Claim
                          </div>
                          <div className="font-semibold text-lg text-white">
                            {parseFloat(claimableAmount).toFixed(2)}{" "}
                            <span className="text-indigo-300">QSE</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleClaimTokens}
                        disabled={
                          isSubmitting ||
                          isConnecting ||
                          parseFloat(claimableAmount) <= 0
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isSubmitting ||
                          isConnecting ||
                          parseFloat(claimableAmount) <= 0
                            ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-green-500/30"
                        }`}
                      >
                        {isSubmitting ? "Claiming..." : "Claim"}
                      </button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-blue-200">
                      Presale Round
                    </label>
                    <div className="relative">
                      <div
                        className={`relative cursor-pointer ${isConnected && rounds.length > 0 ? "" : "opacity-50 pointer-events-none"}`}
                        onClick={() =>
                          setIsRoundDropdownOpen(!isRoundDropdownOpen)
                        }
                      >
                        {selectedRound ? (
                          <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 border border-blue-700/50 rounded-xl py-3 px-4 text-white transition-all duration-300 hover:bg-indigo-900/80">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-indigo-800/70">
                                  <Tag size={16} className="text-indigo-200" />
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Round {selectedRound}
                                  </span>
                                  {getSelectedRound() && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${getRoundStatusLabel(getRoundStatus(getSelectedRound())).color}`}
                                      >
                                        {
                                          getRoundStatusLabel(
                                            getRoundStatus(getSelectedRound())
                                          ).text
                                        }
                                      </span>
                                      <span className="text-xs text-indigo-300">
                                        ${roundPrice.toFixed(2)} per QSE
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                size={20}
                                className={`text-indigo-300 transition-transform duration-300 ${isRoundDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 border border-blue-700/50 rounded-xl py-3 px-4 text-gray-400">
                            No rounds available
                          </div>
                        )}
                        {isRoundDropdownOpen && rounds.length > 0 && (
                          <div className="absolute left-0 right-0 mt-2 bg-blue-950 border border-blue-700/50 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                            <div className="py-2">
                              {rounds.map((round) => {
                                const status = getRoundStatus(round);
                                const statusLabel = getRoundStatusLabel(status);
                                return (
                                  <div
                                    key={round.roundId}
                                    className={`px-4 py-3 hover:bg-indigo-800/60 cursor-pointer transition-colors duration-200 border-b border-blue-800/50 last:border-b-0 ${selectedRound === round.roundId ? "bg-indigo-800/40" : ""}`}
                                    onClick={() =>
                                      handleRoundSelect(round.roundId)
                                    }
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            Round {round.roundId}
                                          </span>
                                          <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${statusLabel.color}`}
                                          >
                                            {statusLabel.text}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-300">
                                          <div className="flex items-center gap-1">
                                            <CircleDollarSign
                                              size={12}
                                              className="text-indigo-300"
                                            />
                                            <span>
                                              ${round.tokenPrice.toFixed(2)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Tag
                                              size={12}
                                              className="text-indigo-300"
                                            />
                                            <span>
                                              {(
                                                round.tokenAmount -
                                                round.soldAmount
                                              ).toFixed(2)}{" "}
                                              QSE
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right text-xs text-gray-300">
                                        <div className="flex items-center gap-1 mb-1">
                                          <Clock
                                            size={12}
                                            className="text-indigo-300"
                                          />
                                          <span>
                                            {new Date(
                                              round.startTime * 1000
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar
                                            size={12}
                                            className="text-indigo-300"
                                          />
                                          <span>
                                            {new Date(
                                              round.endTime * 1000
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedRound &&
                    rounds.find((r) => r.roundId === selectedRound) && (
                      <div className="bg-blue-800/40 border border-blue-500/30 rounded-xl p-4 mb-6 backdrop-blur-md shadow-inner">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-700/50">
                          <h4 className="flex items-center gap-2 text-indigo-100 font-medium">
                            <div className="bg-indigo-700/60 p-1.5 rounded-lg">
                              <Tag size={14} className="text-indigo-200" />
                            </div>
                            Round {selectedRound} Details
                          </h4>
                          <div
                            className={`text-xs px-2 py-0.5 font-medium rounded-full ${getRoundStatusLabel(getRoundStatus(getSelectedRound())).color}`}
                          >
                            {
                              getRoundStatusLabel(
                                getRoundStatus(getSelectedRound())
                              ).text
                            }
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                            <div className="bg-blue-800/60 p-1.5 rounded-lg">
                              <CircleDollarSign
                                size={14}
                                className="text-blue-200"
                              />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Token Price
                              </div>
                              <div className="font-medium text-white">
                                ${roundPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                            <div className="bg-blue-800/60 p-1.5 rounded-lg">
                              <Tag size={14} className="text-blue-200" />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Available
                              </div>
                              <div className="font-medium text-white">
                                {(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  ).tokenAmount -
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  ).soldAmount
                                ).toFixed(2)}{" "}
                                <span className="text-xs text-blue-300">
                                  QSE
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                            <div className="bg-blue-800/60 p-1.5 rounded-lg">
                              <Clock size={14} className="text-blue-200" />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Start Time
                              </div>
                              <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                {new Date(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  ).startTime * 1000
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                            <div className="bg-blue-800/60 p-1.5 rounded-lg">
                              <Calendar size={14} className="text-blue-200" />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                End Time
                              </div>
                              <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                {new Date(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  ).endTime * 1000
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-blue-200">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {supportedPaymentMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          className={`py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            selectedPaymentMethod === method
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                              : "bg-blue-800/60 text-gray-300 hover:bg-indigo-700/70 border border-blue-700/30 hover:text-white"
                          }`}
                          onClick={() => setSelectedPaymentMethod(method)}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-blue-200">
                        {selectedPaymentMethod} Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.000001"
                          min="0.000001"
                          value={paymentAmount}
                          onChange={(e) =>
                            handleInputChange("payment", e.target.value)
                          }
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0.00"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium">
                          {selectedPaymentMethod}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-blue-200">
                        QSE Token Amount{" "}
                        <span className="text-xs text-indigo-300">
                          (min. {MINIMUM_QSE_AMOUNT} QSE)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={MINIMUM_QSE_AMOUNT}
                          value={qseAmount}
                          onChange={(e) =>
                            handleInputChange("qse", e.target.value)
                          }
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                          placeholder="0"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium">
                          QSE
                        </div>
                      </div>
                    </div>
                  </div>
                  {(errorMessage || networkError) && (
                    <div
                      className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                        (errorMessage && errorMessage.includes("success")) ||
                        (networkError && networkError.includes("success"))
                          ? "bg-green-900/40 text-green-200 border border-green-500/30"
                          : "bg-red-900/40 text-red-200 border border-red-500/30"
                      }`}
                    >
                      {(errorMessage && errorMessage.includes("success")) ||
                      (networkError && networkError.includes("success")) ? (
                        <CheckCircle
                          size={16}
                          className="text-green-400 mt-0.5"
                        />
                      ) : (
                        <AlertCircle
                          size={16}
                          className="text-red-400 mt-0.5"
                        />
                      )}
                      <span>{errorMessage || networkError}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleConnectOrBuy}
                    disabled={isSubmitting || isConnecting}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 relative overflow-hidden ${
                      isSubmitting || isConnecting
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        isApproving ? (
                          `Approving ${selectedPaymentMethod}...`
                        ) : (
                          "Processing..."
                        )
                      ) : isConnecting ? (
                        "Connecting..."
                      ) : isConnected ? (
                        <>
                          Buy QSE Tokens{" "}
                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      ) : (
                        <>
                          Connect Wallet <Wallet size={18} />
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
                <div className="lg:hidden mt-8 pt-6 border-t border-indigo-700/40">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-100">
                    Quick Buy Options
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quickBuyOptions.slice(0, 4).map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickBuySelect(amount)}
                        className={`flex flex-col justify-between p-3 rounded-xl border transition-all duration-300 ${
                          quickBuyAmount === amount
                            ? "bg-indigo-700/70 border-indigo-500 text-white shadow-md"
                            : "bg-blue-900/40 border-indigo-700/40 text-gray-300 hover:bg-indigo-800/60"
                        }`}
                      >
                        <span className="font-medium text-lg">
                          {amount} QSE
                        </span>
                        <span className="text-xs mt-1 opacity-80">
                          ≈{" "}
                          {selectedRound &&
                            calculatePaymentFromQSE(
                              amount,
                              selectedPaymentMethod,
                              rounds.find((r) => r.roundId === selectedRound)
                                .tokenPrice
                            )}{" "}
                          {selectedPaymentMethod}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-2/5 border-l border-indigo-700/40 pl-6">
                <div className="bg-blue-800/30 border border-indigo-600/20 rounded-xl p-5 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-100">
                    Quick Buy
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Select a preset amount to populate the main fields.
                  </p>
                  <div className="space-y-4">
                    {quickBuyOptions.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickBuySelect(amount)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all duration-300 ${
                          quickBuyAmount === amount
                            ? "bg-indigo-700/70 border-indigo-500 text-white shadow-md"
                            : "bg-blue-900/40 border-indigo-700/40 text-gray-300 hover:bg-indigo-800/60"
                        }`}
                      >
                        <span className="font-medium">{amount} QSE</span>
                        <span className="text-sm">
                          ≈{" "}
                          {selectedRound &&
                            calculatePaymentFromQSE(
                              amount,
                              selectedPaymentMethod,
                              rounds.find((r) => r.roundId === selectedRound)
                                .tokenPrice
                            )}{" "}
                          {selectedPaymentMethod}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs text-indigo-300">
                    Secure transactions.
                  </p>
                  <p className="text-xs text-indigo-300 mt-1">
                    QSE price: ${roundPrice.toFixed(2)} per token
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 text-center text-xs text-indigo-300 lg:hidden">
            <p>Secure transactions.</p>
            <p className="mt-1">
              QSE price: ${roundPrice.toFixed(2)} per token
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
