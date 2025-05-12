/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useWeb3 } from "./Web3Provider";
import { ArrowRight, CheckCircle, AlertCircle, Settings } from "lucide-react";

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl shadow-2xl w-full max-w-2xl my-6 relative border border-blue-400/20 p-5 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white bg-blue-800/50 hover:bg-blue-700/70 rounded-lg p-2 transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
            <Settings size={24} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-200">
              Round ID
            </label>
            <input
              type="number"
              min="1"
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-200">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-200">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus-outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-200">
              Token Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(e.target.value)}
              className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-200">
              Token Amount (QSE)
            </label>
            <input
              type="number"
              min="0"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full bg-blue-900/60 border border-blue-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
              placeholder="0"
            />
          </div>
          {(errorMessage || successMessage) && (
            <div
              className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                successMessage
                  ? "bg-green-900/40 text-green-200 border border-green-500/30"
                  : "bg-red-900/40 text-red-200 border border-red-500/30"
              }`}
            >
              {successMessage ? (
                <CheckCircle size={16} className="text-green-400 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-400 mt-0.5" />
              )}
              <span>{successMessage || errorMessage}</span>
            </div>
          )}
          <button
            disabled={isSubmitting}
            onClick={handleCreateRound}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Round..." : "Create Round"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelModal;
