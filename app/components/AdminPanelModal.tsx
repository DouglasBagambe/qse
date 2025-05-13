/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshRounds: () => Promise<void>;
}

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  refreshRounds,
}) => {
  const [roundId, setRoundId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { createRound, isConnected, account } = useWeb3();

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
    const price = parseFloat(tokenPrice);
    const amount = parseFloat(tokenAmount);
    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

    if (
      isNaN(roundIdNum) ||
      isNaN(price) ||
      isNaN(amount) ||
      isNaN(startTimestamp) ||
      isNaN(endTimestamp)
    ) {
      setErrorMessage("Invalid input values");
      return;
    }
    if (startTimestamp <= now) {
      setErrorMessage("Start time must be in the future");
      return;
    }
    if (startTimestamp >= endTimestamp) {
      setErrorMessage("End time must be after start time");
      return;
    }
    if (price <= 0 || amount <= 0 || roundIdNum <= 0) {
      setErrorMessage("Round ID, price, and amount must be positive");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const result = await createRound(
        roundIdNum,
        price,
        amount,
        startTimestamp,
        endTimestamp
      );
      if (result.success) {
        setSuccessMessage("Round created successfully");
        await refreshRounds();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md overflow-y-auto z-50 p-3 sm:p-4">
      <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl my-2 sm:my-6 relative border border-blue-500/30 overflow-hidden">
        {/* Glass panel effect overlay */}
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] pointer-events-none" />

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />

        {/* Content container with padding */}
        <div className="p-4 sm:p-6 md:p-8 relative z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-300 hover:text-white bg-blue-800/40 hover:bg-blue-700/80 rounded-lg p-1.5 sm:p-2 transition-all duration-300 hover:scale-105"
          >
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>

          {/* Header with animated gradient */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg rotate-3 hover:rotate-0 transition-all duration-500">
              <ShieldCheck size={20} className="sm:hidden text-white" />
              <ShieldCheck size={28} className="hidden sm:block text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-blue-100 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/40 border border-green-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3 animate-fadeIn">
              <CheckCircle size={16} className="text-green-400 mt-0.5" />
              <span className="text-green-200">{successMessage}</span>
            </div>
          )}

          {/* Admin form container */}
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-inner mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-blue-700/50">
              <h4 className="flex items-center gap-2 text-indigo-100 font-medium text-sm sm:text-base">
                <div className="bg-indigo-700/60 p-1 sm:p-1.5 rounded-md sm:rounded-lg flex items-center justify-center">
                  <Tag size={14} className="sm:hidden text-indigo-200" />
                  <Tag size={16} className="hidden sm:block text-indigo-200" />
                </div>
                Create Presale Round
              </h4>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Round ID */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                  Round ID
                </label>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                    <Tag size={14} className="sm:hidden text-blue-400" />
                    <Tag size={16} className="hidden sm:block text-blue-400" />
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

              {/* Times Container */}
              <div className="grid grid-cols-1 gap-4">
                {/* Start Time */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                      <Clock size={14} className="sm:hidden text-blue-400" />
                      <Clock
                        size={16}
                        className="hidden sm:block text-blue-400"
                      />
                    </div>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                    End Time
                  </label>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                      <Calendar size={14} className="sm:hidden text-blue-400" />
                      <Calendar
                        size={16}
                        className="hidden sm:block text-blue-400"
                      />
                    </div>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-blue-900/60 border border-blue-700/50 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Token Price */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                    Token Price (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                      <CircleDollarSign
                        size={14}
                        className="sm:hidden text-blue-400"
                      />
                      <CircleDollarSign
                        size={16}
                        className="hidden sm:block text-blue-400"
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

                {/* Token Amount */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-blue-200 group-hover:text-blue-100 transition-colors">
                    Token Amount (QSE)
                  </label>
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-0 flex items-center pl-3 sm:pl-4">
                      <Coins size={14} className="sm:hidden text-blue-400" />
                      <Coins
                        size={16}
                        className="hidden sm:block text-blue-400"
                      />
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
              </div>
            </div>
          </div>

          {/* Round Creation Summary */}
          {roundId && startTime && endTime && tokenPrice && tokenAmount && (
            <div className="mb-4 sm:mb-6 bg-indigo-900/30 border border-indigo-600/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <h4 className="text-xs sm:text-sm font-medium text-indigo-100 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <CheckCircle size={12} className="sm:hidden text-indigo-300" />
                <CheckCircle
                  size={14}
                  className="hidden sm:block text-indigo-300"
                />
                Round Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xxs sm:text-xs">
                <div className="bg-blue-900/30 rounded-md sm:rounded-lg p-2 flex flex-col">
                  <span className="text-gray-400">Round ID</span>
                  <span className="text-white font-medium">{roundId}</span>
                </div>
                <div className="bg-blue-900/30 rounded-md sm:rounded-lg p-2 flex flex-col">
                  <span className="text-gray-400">Token Price</span>
                  <span className="text-white font-medium">
                    ${tokenPrice} USD
                  </span>
                </div>
                <div className="bg-blue-900/30 rounded-md sm:rounded-lg p-2 flex flex-col">
                  <span className="text-gray-400">Start Time</span>
                  <span className="text-white font-medium text-xxs sm:text-xs truncate">
                    {new Date(startTime).toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-900/30 rounded-md sm:rounded-lg p-2 flex flex-col">
                  <span className="text-gray-400">End Time</span>
                  <span className="text-white font-medium text-xxs sm:text-xs truncate">
                    {new Date(endTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/40 border border-red-500/30 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-start gap-2 sm:gap-3">
              <AlertCircle
                size={14}
                className="sm:hidden text-red-400 mt-0.5"
              />
              <AlertCircle
                size={18}
                className="hidden sm:block text-red-400 mt-0.5"
              />
              <span className="text-red-200">{errorMessage}</span>
            </div>
          )}

          {/* Security note */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-900/20 border border-blue-800/30">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-blue-900/60 rounded-md sm:rounded-lg">
                <ShieldCheck size={14} className="sm:hidden text-blue-300" />
                <ShieldCheck
                  size={16}
                  className="hidden sm:block text-blue-300"
                />
              </div>
              <p className="text-xs sm:text-sm text-blue-200 font-medium">
                Admin Operations
              </p>
            </div>
            <p className="text-xxs sm:text-xs text-indigo-300 ml-6 sm:ml-8">
              Creating a new round requires admin wallet approval. All changes
              are recorded on-chain.
            </p>
          </div>

          {/* Create Round Button */}
          <button
            disabled={isSubmitting}
            onClick={handleCreateRound}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 text-sm sm:text-base"
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
      </div>
    </div>
  );
};

export default AdminPanelModal;
