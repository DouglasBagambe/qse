/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/TokenPurchaseModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useWeb3, PaymentMethod } from "./Web3Provider";
import { ArrowRight, CheckCircle, AlertCircle, X, Wallet } from "lucide-react";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [qseAmount, setQseAmount] = useState<string>("");
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<string>("");
  const [burnAmount, setBurnAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("ETH");
  const [quickBuyAmount, setQuickBuyAmount] = useState<number>(100);

  const {
    connectWallet,
    buyTokens,
    isConnected,
    isConnecting,
    account,
    burnRate,
    qseBalance,
    loadQSEBalance,
    supportedPaymentMethods,
    getQSEAmountFromPayment,
    getPaymentRateForMethod,
  } = useWeb3();

  const MINIMUM_QSE_AMOUNT = 50;
  const QSE_TOKEN_PRICE_USD = 0.6; // QSE price in USD (e.g., $0.60 per QSE)

  // Quick buy preset amounts
  const quickBuyOptions = [100, 250, 500, 1000, 2500];

  useEffect(() => {
    if (isConnected) {
      loadQSEBalance();
    }
  }, [isConnected, loadQSEBalance]);

  useEffect(() => {
    setErrorMessage("");
  }, [paymentAmount, qseAmount]);

  // Calculate payment amount from QSE tokens based on selected payment method
  const calculatePaymentFromQSE = (
    qseValue: number,
    method: PaymentMethod
  ): string => {
    // QSE value in USD = QSE amount * price per token
    const usdValue = qseValue * QSE_TOKEN_PRICE_USD;

    // Convert USD value to the selected payment method
    const paymentValue = usdValue / getPaymentRateForMethod(method);

    // Format with appropriate decimal places based on payment method
    const decimals = method === "ETH" ? 6 : method === "USDC" ? 6 : 2;

    return paymentValue.toFixed(decimals);
  };

  // Convert payment amount to QSE tokens
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPaymentAmount(value);

    if (value && !isNaN(parseFloat(value))) {
      const tokens = getQSEAmountFromPayment(value, selectedPaymentMethod);
      setQseAmount(tokens.toFixed(2));
      calculateTokensAfterBurn(tokens);
    } else {
      setQseAmount("");
      setReceiveAmount("");
      setBurnAmount("");
    }
  };

  // Convert QSE tokens to payment amount based on selected payment method
  const handleQseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQseAmount(value);

    if (value && !isNaN(parseFloat(value))) {
      const tokens = parseFloat(value);

      // Calculate and set the corresponding payment amount
      const payment = calculatePaymentFromQSE(tokens, selectedPaymentMethod);
      setPaymentAmount(payment);

      // Calculate tokens after burn
      calculateTokensAfterBurn(tokens);
    } else {
      setPaymentAmount("");
      setReceiveAmount("");
      setBurnAmount("");
    }
  };

  const calculateTokensAfterBurn = (totalTokens: number) => {
    const burnTokens = (totalTokens * burnRate) / 100;
    const netTokens = totalTokens - burnTokens;
    setReceiveAmount(netTokens.toFixed(2));
    setBurnAmount(burnTokens.toFixed(2));
  };

  const handleQuickBuySelect = (amount: number) => {
    setQuickBuyAmount(amount);
    setQseAmount(amount.toString());
    const payment = calculatePaymentFromQSE(amount, selectedPaymentMethod);
    setPaymentAmount(payment);
    calculateTokensAfterBurn(amount);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);

    // When payment method changes, recalculate based on QSE amount if it exists
    if (qseAmount && !isNaN(parseFloat(qseAmount))) {
      const tokens = parseFloat(qseAmount);
      const payment = calculatePaymentFromQSE(tokens, method);
      setPaymentAmount(payment);
    }
    // Otherwise recalculate based on payment amount
    else if (paymentAmount && !isNaN(parseFloat(paymentAmount))) {
      const tokens = getQSEAmountFromPayment(paymentAmount, method);
      setQseAmount(tokens.toFixed(2));
      calculateTokensAfterBurn(tokens);
    }
  };

  const validatePurchase = (): boolean => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first");
      return false;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setErrorMessage(`Please enter a valid ${selectedPaymentMethod} amount`);
      return false;
    }

    if (!qseAmount || parseFloat(qseAmount) <= 0) {
      setErrorMessage("Please enter a valid QSE amount");
      return false;
    }

    if (parseFloat(qseAmount) < MINIMUM_QSE_AMOUNT) {
      setErrorMessage(
        `Minimum purchase amount is ${MINIMUM_QSE_AMOUNT} QSE tokens`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validatePurchase()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const dummyEmail = `user-${Date.now()}@quantumsec.org`;
      const result = await buyTokens(
        paymentAmount,
        dummyEmail,
        selectedPaymentMethod
      );
      if (result.success) {
        setPurchaseCompleted(true);
        const hashMatch = result.message.match(
          /Transaction: (0x[a-fA-F0-9]{64})/
        );
        if (hashMatch && hashMatch[1]) setTxHash(hashMatch[1]);
        // Reload QSE balance after successful purchase
        loadQSEBalance();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBuy = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setQseAmount(quickBuyAmount.toString());
    const payment = calculatePaymentFromQSE(
      quickBuyAmount,
      selectedPaymentMethod
    );
    setPaymentAmount(payment);
    calculateTokensAfterBurn(quickBuyAmount);

    // Execute purchase with minimal delay
    setTimeout(() => {
      handleSubmit();
    }, 300);
  };

  const handleConnectOrBuy = async () => {
    if (!isConnected) {
      await connectWallet();
    } else {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

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

        {/* Modal Content */}
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
                  ? `${account.substring(0, 6)}...${account.substring(
                      account.length - 4
                    )}`
                  : ""}
              </div>
            </div>
          )}

          {purchaseCompleted ? (
            <div className="text-center py-6 md:py-10 animate-fadeIn">
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
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-blue-700/50">
                  <span className="text-gray-300">Tokens Burned:</span>
                  <span className="text-red-400">{burnAmount} QSE</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">You Will Receive:</span>
                  <span className="text-lg md:text-xl font-bold text-green-400">
                    {receiveAmount} QSE
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
              {/* Main Form Section */}
              <div className="w-full lg:w-3/5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-200">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {supportedPaymentMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          className={`py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all ${
                            selectedPaymentMethod === method
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                              : "bg-blue-800/60 text-gray-300 hover:bg-blue-700/70 border border-blue-700/30"
                          }`}
                          onClick={() => handlePaymentMethodChange(method)}
                          disabled={!isConnected}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-200">
                        {selectedPaymentMethod} Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.000001"
                          min="0.000001"
                          value={paymentAmount}
                          onChange={handlePaymentInputChange}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                          placeholder="0.00"
                          required
                          disabled={!isConnected}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 font-medium">
                          {selectedPaymentMethod}
                        </div>
                      </div>
                      <div className="text-xs text-blue-300 mt-1.5 flex items-center gap-1">
                        <span>Rate:</span>
                        <span className="font-medium">
                          1 {selectedPaymentMethod} ={" "}
                          {getQSEAmountFromPayment(
                            "1",
                            selectedPaymentMethod
                          ).toFixed(2)}{" "}
                          QSE
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-200">
                        QSE Token Amount{" "}
                        <span className="text-xs text-blue-300">
                          (min. {MINIMUM_QSE_AMOUNT} QSE)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={MINIMUM_QSE_AMOUNT}
                          value={qseAmount}
                          onChange={handleQseInputChange}
                          className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                          placeholder="0"
                          required
                          disabled={!isConnected}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 font-medium">
                          QSE
                        </div>
                      </div>
                      <div className="text-xs text-blue-300 mt-1.5">
                        Price: 1 QSE = ${QSE_TOKEN_PRICE_USD.toFixed(2)} USD
                      </div>
                    </div>
                  </div>

                  {receiveAmount && (
                    <div className="bg-blue-800/40 border border-blue-500/30 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                      <h4 className="font-medium mb-3 text-blue-100">
                        Transaction Details:
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Gross Amount:</span>
                          <span className="text-white font-medium">
                            {parseFloat(qseAmount || "0").toFixed(2)} QSE
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            Burn Amount ({burnRate}%):
                          </span>
                          <span className="text-red-400">
                            {burnAmount || "0.00"} QSE
                          </span>
                        </div>
                        <div className="h-px bg-blue-700/50 my-2"></div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-blue-100">You Receive:</span>
                          <span className="text-green-400 font-bold">
                            {receiveAmount || "0.00"} QSE
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      className={`p-3 md:p-4 rounded-xl text-sm flex items-start gap-3 ${
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
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="!mt-6">
                    <button
                      type={isConnected ? "submit" : "button"}
                      onClick={isConnected ? undefined : handleConnectOrBuy}
                      disabled={isSubmitting}
                      className={`w-full py-3.5 md:py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          "Processing..."
                        ) : isConnected ? (
                          <>
                            Buy QSE Tokens
                            <ArrowRight
                              size={18}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </>
                        ) : (
                          <>
                            Connect Wallet
                            <Wallet size={18} />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </form>

                {/* Mobile Quick Buy Section - Only visible on small screens */}
                <div className="lg:hidden mt-6 pt-6 border-t border-blue-700/40">
                  <h3 className="text-lg font-medium mb-3 text-blue-100">
                    Quick Buy Options
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {quickBuyOptions.slice(0, 4).map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickBuySelect(amount)}
                        disabled={!isConnected}
                        className={`flex flex-col justify-between p-3 rounded-lg border transition-all ${
                          quickBuyAmount === amount
                            ? "bg-blue-700/70 border-blue-500 text-white"
                            : "bg-blue-900/40 border-blue-700/40 text-gray-300 hover:bg-blue-800/60"
                        }`}
                      >
                        <span className="font-medium text-lg">
                          {amount} QSE
                        </span>
                        <span className="text-xs mt-1 opacity-80">
                          ≈{" "}
                          {calculatePaymentFromQSE(
                            amount,
                            selectedPaymentMethod
                          )}{" "}
                          {selectedPaymentMethod}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickBuy}
                    disabled={isSubmitting || !isConnected}
                    className={`w-full mt-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 transition-all ${
                      isSubmitting || !isConnected ? "opacity-60" : ""
                    }`}
                  >
                    {isConnected ? "Quick Buy Now" : "Connect to Quick Buy"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Desktop Quick Buy Panel - Only visible on large screens */}
              <div className="hidden lg:block w-2/5 border-l border-blue-700/40 pl-6">
                <div className="bg-blue-800/30 border border-blue-600/20 rounded-xl p-5 backdrop-blur-sm">
                  <h3 className="text-xl font-medium mb-4 text-blue-100">
                    Quick Buy
                  </h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Select a preset amount below for faster checkout with the
                    current payment method.
                  </p>

                  <div className="space-y-3">
                    {quickBuyOptions.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickBuySelect(amount)}
                        disabled={!isConnected}
                        className={`w-full flex justify-between items-center p-4 rounded-lg border transition-all ${
                          quickBuyAmount === amount
                            ? "bg-blue-700/70 border-blue-500 text-white"
                            : "bg-blue-900/40 border-blue-700/40 text-gray-300 hover:bg-blue-800/60"
                        }`}
                      >
                        <span className="font-medium">{amount} QSE</span>
                        <span className="text-sm">
                          ≈{" "}
                          {calculatePaymentFromQSE(
                            amount,
                            selectedPaymentMethod
                          )}{" "}
                          {selectedPaymentMethod}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleQuickBuy}
                      disabled={isSubmitting || !isConnected}
                      className={`w-full py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 transition-all ${
                        isSubmitting || !isConnected ? "opacity-60" : ""
                      }`}
                    >
                      {isConnected ? "Buy Now" : "Connect to Buy"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-blue-300">
                    Transactions processed securely on the blockchain.
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    QSE price fixed at ${QSE_TOKEN_PRICE_USD.toFixed(2)} per
                    token for all payment methods
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer info - only shown on mobile */}
          <div className="mt-6 text-center text-xs text-blue-300 lg:hidden">
            <p>Transactions processed securely on the blockchain.</p>
            <p className="mt-1">
              QSE price fixed at ${QSE_TOKEN_PRICE_USD.toFixed(2)} per token
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
