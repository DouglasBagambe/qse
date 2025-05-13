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
  CircleDollarSign,
  ShieldCheck,
  Zap,
  X,
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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto my-4 sm:my-6 relative border border-blue-500/30 overflow-hidden">
        {/* Glass panel effect overlay */}
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] pointer-events-none" />

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />

        {/* Content container with adaptive padding */}
        <div className="p-4 sm:p-6 md:p-8 relative z-10">
          {/* Admin & Close buttons */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 sm:gap-2">
            {isConnected && isOwner && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-gray-300 hover:text-white bg-blue-800/40 hover:bg-blue-700 rounded-lg p-1.5 sm:p-2 transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
                title="Open Admin Panel"
              >
                <ShieldCheck size={18} className="sm:hidden" />
                <ShieldCheck size={20} className="hidden sm:block" />
                <span className="hidden sm:inline text-sm font-medium">
                  Admin Panel
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white bg-blue-800/40 hover:bg-blue-700/80 rounded-lg p-1.5 sm:p-2 transition-all duration-300 hover:scale-105"
            >
              <X size={18} className="sm:hidden" />
              <X size={20} className="hidden sm:block" />
            </button>
          </div>

          {/* Header with animated gradient */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 mt-4 sm:mt-0">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg rotate-3 hover:rotate-0 transition-all duration-500">
              <Wallet size={22} className="text-white sm:hidden" />
              <Wallet size={28} className="text-white hidden sm:block" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-blue-100 bg-clip-text text-transparent">
              Buy QSE Tokens
            </h2>
          </div>

          {successMessage ? (
            /* Success state */
            <div className="text-center py-6 sm:py-10 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-pulse">
                <CheckCircle size={32} className="text-white sm:hidden" />
                <CheckCircle size={48} className="text-white hidden sm:block" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
                Purchase Successful!
              </h3>
              <div className="bg-blue-900/40 border border-blue-500/40 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-700/50">
                  <span className="text-gray-300">Tokens Purchased:</span>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {qseAmount} <span className="text-blue-300">QSE</span>
                  </span>
                </div>
                {txHash && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-950/60 rounded-xl text-xs max-w-md mx-auto border border-blue-700/50">
                    <p className="font-medium mb-1 text-blue-300">
                      Transaction Hash:
                    </p>
                    <p className="font-mono text-gray-300 select-all break-all">
                      {txHash}
                    </p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Main purchase interface */
            <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-6 xl:space-x-8">
              {/* Main purchase form */}
              <div className="w-full lg:w-3/5">
                {/* Connected wallet info */}
                {isConnected && (
                  <div className="mb-5 flex justify-between items-center p-3 sm:p-4 bg-blue-900/30 rounded-xl text-sm border border-blue-500/40 backdrop-blur-md">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-1.5 sm:p-2 rounded-lg">
                        <Wallet size={16} className="sm:hidden" />
                        <Wallet size={18} className="hidden sm:block" />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">
                          Your QSE balance
                        </div>
                        <div className="font-semibold text-base sm:text-lg">
                          {parseFloat(qseBalance).toFixed(2)}{" "}
                          <span className="text-blue-300">QSE</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-950/90 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm text-blue-300 font-mono truncate max-w-[120px] sm:max-w-[200px]">
                      {account
                        ? `${account.slice(0, 4)}...${account.slice(-4)}`
                        : ""}
                    </div>
                  </div>
                )}

                {/* Purchase interface sections */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Round selection */}
                  <div className="group">
                    <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                      Presale Round
                    </label>
                    <div className="relative">
                      {isLoadingRounds ? (
                        <div className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full" />
                            Loading rounds...
                          </div>
                        </div>
                      ) : rounds.length > 0 ? (
                        <div
                          className={`relative cursor-pointer ${isConnected ? "" : "opacity-50 pointer-events-none"}`}
                          onClick={() =>
                            setIsRoundDropdownOpen(!isRoundDropdownOpen)
                          }
                        >
                          <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700/50 rounded-xl py-3 sm:py-4 px-3 sm:px-4 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 group-hover:border-blue-600/70">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-800/80">
                                  <Tag
                                    size={16}
                                    className="text-indigo-200 sm:hidden"
                                  />
                                  <Tag
                                    size={18}
                                    className="text-indigo-200 hidden sm:block"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-base sm:text-lg">
                                    Round {selectedRound}
                                  </div>
                                  {getSelectedRound() && (
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
                                      <span
                                        className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
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
                                size={18}
                                className={`text-indigo-300 transition-transform duration-300 ${
                                  isRoundDropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>
                          {isRoundDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-2 bg-blue-950/95 border border-blue-700/50 rounded-xl shadow-xl z-50 max-h-48 sm:max-h-64 overflow-y-auto backdrop-blur-sm">
                              <div className="py-1 sm:py-2">
                                {rounds.map((round) => {
                                  const status = getRoundStatus(round);
                                  const statusLabel =
                                    getRoundStatusLabel(status);
                                  return (
                                    <div
                                      key={round.roundId}
                                      className={`px-3 sm:px-4 py-2 sm:py-3 hover:bg-indigo-800/60 cursor-pointer transition-colors duration-200 border-b border-blue-800/50 last:border-b-0 ${
                                        selectedRound === round.roundId
                                          ? "bg-indigo-800/40"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleRoundSelect(round.roundId)
                                      }
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          Round {round.roundId}
                                        </span>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                          <span className="text-xs sm:text-sm text-indigo-300">
                                            ${round.tokenPrice.toFixed(2)}
                                          </span>
                                          <span
                                            className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${statusLabel.color}`}
                                          >
                                            {statusLabel.text}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-gray-400">
                          No rounds available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Round details card */}
                  {selectedRound &&
                    rounds.find((r) => r.roundId === selectedRound) && (
                      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl p-3 sm:p-5 mb-4 sm:mb-6 backdrop-blur-md shadow-inner">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-blue-700/50">
                          <h4 className="flex items-center gap-1.5 sm:gap-2 text-indigo-100 font-medium text-sm sm:text-base">
                            <div className="bg-indigo-700/60 p-1 sm:p-1.5 rounded-lg flex items-center justify-center">
                              <Tag
                                size={14}
                                className="text-indigo-200 sm:hidden"
                              />
                              <Tag
                                size={16}
                                className="text-indigo-200 hidden sm:block"
                              />
                            </div>
                            Round {selectedRound} Details
                          </h4>
                          <div className="text-xs text-indigo-300 font-medium">
                            {
                              getRoundStatusLabel(
                                getRoundStatus(getSelectedRound()!)
                              ).text
                            }
                          </div>
                        </div>

                        {/* Details Grid - mobile: 2x2, desktop: 2x2 */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          {/* Token Price */}
                          <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-blue-800/30 transition-all">
                            <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-1.5 sm:p-2 rounded-lg">
                              <CircleDollarSign
                                size={14}
                                className="text-blue-200 sm:hidden"
                              />
                              <CircleDollarSign
                                size={16}
                                className="text-blue-200 hidden sm:block"
                              />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Token Price
                              </div>
                              <div className="font-medium text-white text-sm sm:text-base">
                                ${(roundPrice ?? 0).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Available Tokens */}
                          <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-blue-800/30 transition-all">
                            <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-1.5 sm:p-2 rounded-lg">
                              <Coins
                                size={14}
                                className="text-blue-200 sm:hidden"
                              />
                              <Coins
                                size={16}
                                className="text-blue-200 hidden sm:block"
                              />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Available
                              </div>
                              <div className="font-medium text-white text-sm sm:text-base">
                                {(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  )!.tokenAmount -
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  )!.soldAmount
                                ).toFixed(2)}{" "}
                                <span className="text-xs text-blue-300">
                                  QSE
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Start Time */}
                          <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-blue-800/30 transition-all">
                            <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-1.5 sm:p-2 rounded-lg">
                              <Clock
                                size={14}
                                className="text-blue-200 sm:hidden"
                              />
                              <Clock
                                size={16}
                                className="text-blue-200 hidden sm:block"
                              />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                Start Time
                              </div>
                              <div className="font-medium text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px] sm:max-w-full">
                                {new Date(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  )!.startTime * 1000
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* End Time */}
                          <div className="bg-blue-900/30 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-blue-800/30 transition-all">
                            <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-1.5 sm:p-2 rounded-lg">
                              <Calendar
                                size={14}
                                className="text-blue-200 sm:hidden"
                              />
                              <Calendar
                                size={16}
                                className="text-blue-200 hidden sm:block"
                              />
                            </div>
                            <div>
                              <div className="text-gray-300 text-xs">
                                End Time
                              </div>
                              <div className="font-medium text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[110px] sm:max-w-full">
                                {new Date(
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  )!.endTime * 1000
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Payment method selection */}
                  <div className="group">
                    <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {supportedPaymentMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          className={`py-2 sm:py-3 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md ${
                            selectedPaymentMethod === method
                              ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/50"
                              : "bg-blue-900/50 text-gray-300 hover:bg-indigo-800/60 border border-blue-800/50 hover:text-white"
                          }`}
                          onClick={() => setSelectedPaymentMethod(method)}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
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
                          className="w-full bg-blue-900/70 border border-blue-700/50 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
                          placeholder="0.00"
                        />
                        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium text-sm sm:text-base">
                          {selectedPaymentMethod}
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
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
                          className="w-full bg-blue-900/70 border border-blue-700/50 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300 text-sm sm:text-base"
                          placeholder="0"
                        />
                        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 font-medium text-sm sm:text-base">
                          QSE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Buy Options (visible only on mobile) */}
                  <div className="lg:hidden">
                    <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-600/30 rounded-xl p-4 backdrop-blur-sm shadow-lg mb-4">
                      <h3 className="text-base font-semibold mb-3 text-indigo-100 flex items-center gap-2">
                        <Zap size={16} className="text-indigo-400" />
                        Quick Buy
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_BUY_OPTIONS.slice(0, 4).map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleQuickBuySelect(amount)}
                            className={`flex flex-col justify-center items-center p-3 rounded-xl border transition-all duration-300 ${
                              quickBuyAmount === amount
                                ? "bg-gradient-to-r from-indigo-700/70 to-blue-700/70 border-indigo-500 text-white shadow-md transform scale-105"
                                : "bg-blue-900/40 border-indigo-700/40 text-gray-300 hover:bg-indigo-800/60 hover:border-indigo-600/50"
                            }`}
                          >
                            <span className="font-medium text-sm">
                              {amount} QSE
                            </span>
                            <span className="text-xs mt-1">
                              ={" "}
                              {selectedRound &&
                                calculatePaymentFromQSE(
                                  amount,
                                  selectedPaymentMethod,
                                  rounds.find(
                                    (r) => r.roundId === selectedRound
                                  )?.tokenPrice || 0
                                )}{" "}
                              {selectedPaymentMethod}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error messages */}
                  {(errorMessage || networkError) && (
                    <div
                      className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3 shadow-inner ${
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
                        <AlertCircle
                          size={16}
                          className="text-red-400 mt-0.5"
                        />
                      )}
                      <span>{errorMessage || networkError}</span>
                    </div>
                  )}

                  {/* Action button */}
                  {isConnected ? (
                    <button
                      disabled={isSubmitting || isApproving || isLoadingRounds}
                      onClick={executePurchase}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          Connect Wallet
                          <Wallet size={16} className="sm:hidden" />
                          <Wallet size={18} className="hidden sm:block" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Right sidebar with quick buy options */}
              <div className="hidden lg:block w-2/5">
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-600/30 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-100 flex items-center gap-2">
                    <Zap size={18} className="text-indigo-400" />
                    Quick Buy
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Select a preset amount to populate the main fields.
                  </p>
                  <div className="space-y-3">
                    {QUICK_BUY_OPTIONS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickBuySelect(amount)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all duration-300 ${
                          quickBuyAmount === amount
                            ? "bg-gradient-to-r from-indigo-700/70 to-blue-700/70 border-indigo-500 text-white shadow-md transform scale-105"
                            : "bg-blue-900/40 border-indigo-700/40 text-gray-300 hover:bg-indigo-800/60 hover:border-indigo-600/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${quickBuyAmount === amount ? "bg-blue-300" : "bg-blue-700"}`}
                          />
                          <span className="font-medium">{amount} QSE</span>
                        </div>
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

                {/* Security notice */}
                <div className="mt-6 p-4 rounded-xl bg-blue-900/20 border border-blue-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-blue-900/60 rounded-lg">
                      <ShieldCheck size={16} className="text-blue-300" />
                    </div>
                    <p className="text-sm text-blue-200 font-medium">
                      Secure Transaction
                    </p>
                  </div>
                  <p className="text-xs text-indigo-300 ml-8">
                    All purchases are securely processed and protected.
                  </p>
                  <div className="flex items-center gap-2 mt-3 ml-8">
                    <div className="h-px flex-grow bg-blue-800/50" />
                    <p className="text-xs text-indigo-300">
                      QSE price: ${(roundPrice ?? 0).toFixed(2)} per token
                    </p>
                    <div className="h-px flex-grow bg-blue-800/50" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin panel modal */}
          <AdminPanelModal
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            refreshRounds={fetchRounds}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
