// app/components/TokenPurchaseModal.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useWeb3, PaymentMethod } from "./Web3Provider";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wallet,
  Clock,
  Calendar,
  ChevronDown,
  Tag,
  Coins,
} from "lucide-react";
import AdminPanelModal from "./AdminPanelModal";

interface Round {
  roundId: number;
  startTime: number;
  endTime: number;
  tokenPrice: number;
  tokenAmount: number;
  soldAmount: number;
}

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MINIMUM_QSE_AMOUNT = 50;
const QUICK_BUY_OPTIONS = [100, 250, 500, 1000, 2500];

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [qseAmount, setQseAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("ETH");
  const [quickBuyAmount, setQuickBuyAmount] = useState<number | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isRoundDropdownOpen, setIsRoundDropdownOpen] = useState(false);
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [contractOwner, setContractOwner] = useState<string | null>(null);

  const {
    isConnected,
    isConnecting,
    account,
    networkError,
    qseBalance,
    supportedPaymentMethods,
    connectWallet,
    buyTokens,
    getRounds,
    getTokenAmountFromPayment,
    getPaymentAmountForTokens,
    getPaymentRateForMethod,
    loadQSEBalance,
    getContractOwner,
    getTokensAvailable,
  } = useWeb3();

  // Improved isOwner check with proper null/undefined handling and debug logging
  const isOwner = useMemo(() => {
    const isMatch = !!(
      account &&
      contractOwner &&
      account.toLowerCase() === contractOwner.toLowerCase()
    );

    console.log({
      debug_isOwner: isMatch,
      account: account?.toLowerCase(),
      contractOwner: contractOwner,
      accountExists: !!account,
      contractOwnerExists: !!contractOwner,
    });

    return isMatch;
  }, [account, contractOwner]);

  const fetchRounds = useCallback(async () => {
    setIsLoadingRounds(true);
    try {
      const fetchedRounds = await getRounds();
      setRounds(fetchedRounds);
      const activeRound = fetchedRounds.find(
        (r) =>
          Math.floor(Date.now() / 1000) >= r.startTime &&
          Math.floor(Date.now() / 1000) <= r.endTime
      );
      setSelectedRound(
        activeRound?.roundId ?? fetchedRounds[0]?.roundId ?? null
      );
    } catch (error) {
      setErrorMessage("Failed to load rounds");
    } finally {
      setIsLoadingRounds(false);
    }
  }, [getRounds]);

  // Enhanced useEffect for contract owner loading with error handling
  useEffect(() => {
    if (isConnected && account) {
      loadQSEBalance();
      fetchRounds();

      // Improved owner address fetching
      const fetchOwner = async () => {
        try {
          const owner = await getContractOwner();
          console.log("Contract owner fetched:", owner);
          setContractOwner(owner ? owner.toLowerCase() : null);
        } catch (error) {
          console.error("Failed to get contract owner:", error);
          setContractOwner(null);
        }
      };

      fetchOwner();
    }
    setErrorMessage("");
  }, [isConnected, account, loadQSEBalance, fetchRounds, getContractOwner]);

  const getSelectedRound = () =>
    rounds.find((r) => r.roundId === selectedRound);

  const getRoundStatus = (round: Round) => {
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
    const cleanValue = value.replace(/^0+(?=\d)/, "").replace(/[^\d.]/g, "");
    if (type === "payment") {
      setPaymentAmount(cleanValue);
      if (
        isConnected &&
        cleanValue &&
        !isNaN(parseFloat(cleanValue)) &&
        selectedRound
      ) {
        const tokens = await getTokenAmountFromPayment(
          cleanValue,
          selectedPaymentMethod,
          selectedRound
        );
        setQseAmount(tokens.toFixed(2));
      } else {
        setQseAmount("");
      }
    } else {
      setQseAmount(cleanValue);
      if (cleanValue && !isNaN(parseFloat(cleanValue)) && selectedRound) {
        const payment = await getPaymentAmountForTokens(
          cleanValue,
          selectedPaymentMethod,
          selectedRound
        );
        setPaymentAmount(payment.toFixed(6));
      } else {
        setPaymentAmount("");
      }
    }
  };

  const handleQuickBuySelect = async (amount: number) => {
    setQuickBuyAmount(amount);
    setQseAmount(amount.toString());
    if (selectedRound) {
      const payment = await getPaymentAmountForTokens(
        amount.toString(),
        selectedPaymentMethod,
        selectedRound
      );
      setPaymentAmount(payment.toFixed(6));
    }
  };

  const handleRoundSelect = (roundId: number) => {
    setSelectedRound(roundId);
    setIsRoundDropdownOpen(false);
    setQseAmount("");
    setPaymentAmount("");
    setQuickBuyAmount(null);
  };

  const validatePurchase = async (): Promise<boolean> => {
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
    if (
      !qseAmount ||
      isNaN(parseFloat(qseAmount)) ||
      parseFloat(qseAmount) <= 0
    ) {
      setErrorMessage("Enter valid QSE amount");
      return false;
    }
    if (parseFloat(qseAmount) < MINIMUM_QSE_AMOUNT) {
      setErrorMessage(`Minimum ${MINIMUM_QSE_AMOUNT} QSE required`);
      return false;
    }
    const tokensAvailable = parseFloat(await getTokensAvailable(selectedRound));
    if (parseFloat(qseAmount) > tokensAvailable) {
      setErrorMessage(`Only ${tokensAvailable.toFixed(2)} QSE available`);
      return false;
    }
    return true;
  };

  const executePurchase = async () => {
    if (!(await validatePurchase()) || !selectedRound) return;
    setIsSubmitting(true);
    setIsApproving(selectedPaymentMethod !== "ETH");
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await buyTokens(
        qseAmount,
        selectedPaymentMethod,
        selectedRound
      );
      if (result.success) {
        setSuccessMessage(result.message);
        setTxHash(result.message.match(/: (0x[a-fA-F0-9]{64})/)?.[1] || "");
        setPaymentAmount("");
        setQseAmount("");
        setQuickBuyAmount(null);
        await loadQSEBalance();
      } else {
        setErrorMessage(result.message || "Purchase failed");
      }
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsApproving(false);
    }
  };

  if (!isOpen) return null;

  const roundPrice =
    selectedRound && rounds.find((r) => r.roundId === selectedRound)
      ? rounds.find((r) => r.roundId === selectedRound)?.tokenPrice
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl shadow-2xl w-full max-w-4xl my-6 relative border border-blue-400/20 p-5 md:p-8 overflow-hidden">
        {/* Only show admin button if the connected account is the owner */}
        {isConnected && isOwner && (
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="absolute top-4 left-4 text-gray-300 hover:text-white bg-blue-800/50 hover:bg-blue-700/70 rounded-lg p-2 transition-all"
            title="Admin Panel"
          >
            <Tag size={20} />
          </button>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white bg-blue-800/50 hover:bg-blue-700/70 rounded-lg p-2 transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
            Buy QSE Tokens
          </h2>
        </div>
        {successMessage ? (
          <div className="text-center py-6 md:py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600">
              <CheckCircle size={32} className="md:hidden" />
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
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="w-full lg:w-3/5">
              <div className="space-y-6">
                {isConnected && (
                  <div className="mb-6 flex justify-between items-center p-3 md:p-4 bg-blue-800/40 rounded-xl text-sm border border-blue-500/30 backdrop-blur-md">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-blue-700 p-1.5 md:p-2 rounded-lg">
                        <Wallet size={16} className="md:hidden" />
                        <Wallet size={18} className="hidden md:block" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">
                          Your QSE balance
                        </div>
                        <div className="font-semibold text-base md:text-lg">
                          {parseFloat(qseBalance).toFixed(2)}{" "}
                          <span className="text-blue-300">QSE</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-950/70 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm text-blue-300 font-mono truncate max-w-[100px] md:max-w-[200px]">
                      {account
                        ? `${account.slice(0, 4)}...${account.slice(-4)}`
                        : ""}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-200">
                    Presale Round
                  </label>
                  <div className="relative">
                    {isLoadingRounds ? (
                      <div className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-gray-400">
                        Loading rounds...
                      </div>
                    ) : rounds.length > 0 ? (
                      <div
                        className={`relative cursor-pointer ${isConnected ? "" : "opacity-50 pointer-events-none"}`}
                        onClick={() =>
                          setIsRoundDropdownOpen(!isRoundDropdownOpen)
                        }
                      >
                        <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 border border-blue-700/50 rounded-xl py-3 px-4 text-white transition-all duration-300 hover:bg-indigo-900/80">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-indigo-800/70">
                                <Tag size={16} className="text-indigo-200" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  Round {selectedRound}
                                </div>
                                {getSelectedRound() && (
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        getRoundStatusLabel(
                                          getRoundStatus(getSelectedRound()!)
                                        ).color
                                      }`}
                                    >
                                      {
                                        getRoundStatusLabel(
                                          getRoundStatus(getSelectedRound()!)
                                        ).text
                                      }
                                    </span>
                                    <span className="text-xs text-indigo-300">
                                      ${(roundPrice || 0).toFixed(2)} per QSE
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <ChevronDown
                              size={20}
                              className={`text-indigo-300 transition-transform duration-300 ${
                                isRoundDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        {isRoundDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-2 bg-blue-950 border border-blue-700/50 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                            <div className="py-2">
                              {rounds.map((round) => {
                                const status = getRoundStatus(round);
                                const statusLabel = getRoundStatusLabel(status);
                                return (
                                  <div
                                    key={round.roundId}
                                    className={`px-4 py-3 hover:bg-indigo-800/60 cursor-pointer transition-colors duration-200 border-b border-blue-800/50 last:border-b-0 ${
                                      selectedRound === round.roundId
                                        ? "bg-indigo-800/40"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleRoundSelect(round.roundId)
                                    }
                                  >
                                    <div className="flex items-center">
                                      <span className="font-medium">
                                        Round {round.roundId}
                                      </span>
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ml-2 ${statusLabel.color}`}
                                      >
                                        {statusLabel.text}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-gray-400">
                        No rounds available
                      </div>
                    )}
                  </div>
                </div>
                {selectedRound && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                      <div className="bg-blue-800/60 p-1.5 rounded-lg">
                        <Coins size={14} className="text-blue-200" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Available</div>
                        <div className="font-medium text-white">
                          {(
                            getSelectedRound()!.tokenAmount -
                            getSelectedRound()!.soldAmount
                          ).toFixed(2)}{" "}
                          <span className="text-xs text-blue-300">QSE</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                      <div className="bg-blue-800/60 p-1.5 rounded-lg">
                        <Clock size={14} className="text-blue-200" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Start Time</div>
                        <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                          {new Date(
                            getSelectedRound()!.startTime * 1000
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                      <div className="bg-blue-800/60 p-1.5 rounded-lg">
                        <Calendar size={14} className="text-blue-200" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">End Time</div>
                        <div className="font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                          {new Date(
                            getSelectedRound()!.endTime * 1000
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                      <div className="bg-blue-800/60 p-1.5 rounded-lg">
                        <Tag size={14} className="text-blue-200" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Token Price</div>
                        <div className="font-medium text-white">
                          ${(roundPrice ?? 0).toFixed(2)}
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
                            ? "bg-gradient-to-r from-blue-900 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
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
                      errorMessage.includes("success")
                        ? "bg-green-900/40 text-green-200 border border-green-500/30"
                        : "bg-red-900/40 text-red-200 border border-red-500/30"
                    }`}
                  >
                    {errorMessage.includes("success") ? (
                      <CheckCircle
                        size={16}
                        className="text-green-400 mt-0.5"
                      />
                    ) : (
                      <AlertCircle size={16} className="text-red-400 mt-0.5" />
                    )}
                    <span>{errorMessage || networkError}</span>
                  </div>
                )}
                {isConnected ? (
                  <button
                    disabled={isSubmitting || isApproving || isLoadingRounds}
                    onClick={executePurchase}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving
                      ? "Approving..."
                      : isSubmitting
                        ? "Purchasing..."
                        : isLoadingRounds
                          ? "Loading Rounds..."
                          : "Buy QSE Tokens"}
                  </button>
                ) : (
                  <button
                    disabled={isConnecting}
                    onClick={connectWallet}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                    <Wallet size={18} />
                  </button>
                )}
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
                  {QUICK_BUY_OPTIONS.map((amount) => (
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
                        ={" "}
                        {selectedRound &&
                          calculatePaymentFromQSE(
                            amount,
                            selectedPaymentMethod,
                            rounds.find((r) => r.roundId === selectedRound)
                              ?.tokenPrice || 0
                          )}{" "}
                        {selectedPaymentMethod}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-indigo-300">Secure transactions.</p>
                <p className="text-xs text-indigo-300 mt-1">
                  QSE price: ${(roundPrice ?? 0).toFixed(2)} per token
                </p>
              </div>
            </div>
          </div>
        )}
        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          refreshRounds={fetchRounds}
        />
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
