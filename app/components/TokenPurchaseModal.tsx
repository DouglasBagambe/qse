// app/components/TokenPurchaseModal.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useWeb3, PaymentMethod } from "./Web3Provider";

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
  const [email, setEmail] = useState<string>("");
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<string>("");
  const [burnAmount, setBurnAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [sentCode, setSentCode] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("ETH");

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

  const handleSendVerificationCode = () => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setIsVerifyingEmail(true);

    // Generate a 6-digit code for testing
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(mockCode);

    // Automatically fill the verification code input for testing
    setEmailCode(mockCode);

    // Show a message in the error area to indicate the code was "sent"
    setErrorMessage(`Code sent to your email: ${mockCode}`);

    // Clear the error message after 3 seconds
    setTimeout(() => {
      if (errorMessage.includes("Code sent to your email")) {
        setErrorMessage("");
      }
    }, 3000);
  };

  const handleVerifyEmail = () => {
    if (emailCode === sentCode) {
      setIsEmailVerified(true);
      setErrorMessage("Email verified successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        if (errorMessage === "Email verified successfully!") {
          setErrorMessage("");
        }
      }, 3000);
    } else {
      setErrorMessage("Invalid verification code");
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

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    if (!isEmailVerified) {
      setErrorMessage("Please verify your email before purchasing");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePurchase()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const result = await buyTokens(
        paymentAmount,
        email,
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

  const handleButtonAction = async () => {
    if (!isConnected) {
      await connectWallet();
    } else {
      // If connected, the button will be a submit button handled by the form
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000] px-4">
      <div className="bg-[#0a0a4a] text-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Buy QSE Tokens</h2>

        {isConnected && (
          <div className="mb-4 flex justify-between items-center p-3 bg-[#151575] rounded-lg text-sm">
            <div>
              <span className="text-gray-400">Your QSE Balance:</span>
              <span className="ml-2 font-medium">
                {parseFloat(qseBalance).toFixed(2)} QSE
              </span>
            </div>
            <div
              className="text-xs text-gray-400 truncate max-w-[150px]"
              title={account || ""}
            >
              {account
                ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                : ""}
            </div>
          </div>
        )}

        {purchaseCompleted ? (
          <div className="text-center py-6">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-medium mb-2">Purchase Successful!</h3>
            <p className="mb-2">You will receive {receiveAmount} QSE tokens</p>
            <p className="text-sm text-gray-400 mb-4">
              {burnAmount} QSE tokens were burned in this transaction
            </p>
            {txHash && (
              <div className="mt-2 p-3 bg-[#151575] rounded-lg text-xs break-all">
                <p className="font-medium mb-1">Transaction Hash:</p>
                <p>{txHash}</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                {supportedPaymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`py-2 rounded-lg text-sm font-medium transition duration-200 ${
                      selectedPaymentMethod === method
                        ? "bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white"
                        : "bg-[#1a1a6a] text-gray-300 hover:bg-[#252580]"
                    }`}
                    onClick={() => handlePaymentMethodChange(method)}
                    disabled={!isConnected}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {selectedPaymentMethod} Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={paymentAmount}
                  onChange={handlePaymentInputChange}
                  className="w-full bg-[#1a1a6a] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                  disabled={!isConnected}
                />
                <div className="absolute right-3 top-3 text-gray-300">
                  {selectedPaymentMethod}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Rate: 1 {selectedPaymentMethod} ={" "}
                {getQSEAmountFromPayment("1", selectedPaymentMethod).toFixed(2)}{" "}
                QSE
              </div>
              {/* <div className="text-xs text-gray-400 mt-1">
                Rate: 1 USDT = {getQSEAmountFromPayment("1", "USDT")} QSE
              </div> */}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                QSE Token Amount{" "}
                <span className="text-xs text-gray-400">
                  (min. {MINIMUM_QSE_AMOUNT} QSE)
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={MINIMUM_QSE_AMOUNT}
                  value={qseAmount}
                  onChange={handleQseInputChange}
                  className="w-full bg-[#1a1a6a] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                  disabled={!isConnected}
                />
                <div className="absolute right-3 top-3 text-gray-300">QSE</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Standard Rate: 1 USDT = {getQSEAmountFromPayment("1", "USDT")}{" "}
                QSE
              </div>
            </div>

            {receiveAmount && burnAmount && (
              <div className="mb-4 p-3 bg-[#151575] rounded-lg">
                <h4 className="font-medium mb-2">Transaction Details:</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gross Amount:</span>
                  <span>{parseFloat(qseAmount).toFixed(2)} QSE</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Burn Amount ({burnRate}%):</span>
                  <span className="text-red-400">{burnAmount} QSE</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>You Receive:</span>
                  <span className="text-green-400">{receiveAmount} QSE</span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email (for purchase confirmation)
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a6a] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                  disabled={isEmailVerified || !isConnected}
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="absolute right-3 text-sm text-blue-400 hover:text-blue-300 px-2 py-1"
                    disabled={
                      isVerifyingEmail ||
                      !isConnected ||
                      !email ||
                      !email.includes("@")
                    }
                  >
                    {isVerifyingEmail ? "Sent" : "Verify"}
                  </button>
                )}
              </div>
              {isVerifyingEmail && !isEmailVerified && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-2">
                    Enter Verification Code
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      className="w-full bg-[#1a1a6a] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 6-digit code"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className="absolute right-3 text-sm text-blue-400 hover:text-blue-300 px-2 py-1"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
              {isEmailVerified && (
                <p className="text-sm text-green-400 mt-1">Email Verified ✓</p>
              )}
            </div>

            {errorMessage && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  errorMessage === "Email verified successfully!"
                    ? "bg-green-900 bg-opacity-40 text-green-200"
                    : errorMessage.includes("Code sent to your email")
                      ? "bg-blue-900 bg-opacity-40 text-blue-200"
                      : "bg-red-900 bg-opacity-40 text-red-200"
                }`}
              >
                {errorMessage}
              </div>
            )}

            {isConnected ? (
              <button
                type="submit"
                disabled={isSubmitting || !isEmailVerified}
                className={`w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#a42e9a] to-[#5951f6] hover:opacity-90 transition duration-300 ${
                  isSubmitting || !isEmailVerified ? "opacity-70" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Buy QSE Tokens"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleButtonAction}
                disabled={isConnecting}
                className={`w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#a42e9a] to-[#5951f6] hover:opacity-90 transition duration-300 ${
                  isConnecting ? "opacity-70" : ""
                }`}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </form>
        )}

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>All transactions are processed on the blockchain.</p>
          <p>
            QSE price is fixed at $0.60 per token, regardless of payment method!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseModal;
