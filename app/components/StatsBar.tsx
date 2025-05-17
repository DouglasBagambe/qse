"use client";

import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { useWeb3 } from "./Web3Provider";
import { Coins, Zap, Users, Shield } from "lucide-react";

interface StatsBarProps {
  presaleEndDate?: Date;
}

const StatsBar: React.FC<StatsBarProps> = ({
  presaleEndDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
}) => {
  const [tokenPrice, setTokenPrice] = useState("0");
  const [totalParticipants, setTotalParticipants] = useState("0");
  const [totalTransactions, setTotalTransactions] = useState("0");
  const [endTime, setEndTime] = useState<number>(0);

  const { currentRound, getRounds, getFundsRaised, getPrivateInvestors } =
    useWeb3();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current round data
        const rounds = await getRounds();
        const activeRound = rounds.find(
          (round) => round.roundId === currentRound?.roundId
        );

        if (activeRound) {
          // Set token price
          setTokenPrice(`$${activeRound.tokenPrice.toFixed(2)}`);

          // Set end time
          setEndTime(activeRound.endTime * 1000); // Convert to milliseconds
        }

        // Get total participants
        const investors = await getPrivateInvestors();
        setTotalParticipants(investors.length.toString());

        // Get total transactions (this is a mock for now, we can implement actual transaction counting later)
        const fundsRaised = await getFundsRaised();
        const transactionCount = Math.floor(parseFloat(fundsRaised) / 100); // Mock calculation
        setTotalTransactions(transactionCount.toString());
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [currentRound, getRounds, getFundsRaised, getPrivateInvestors]);

  const handleCountdownComplete = () => {
    console.log("Privatesale countdown completed!");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center bg-blue-700/90 backdrop-filter backdrop-blur-lg rounded-lg p-3 md:p-4 shadow-lg w-full max-w-5xl border-2 border-[#2563EB]/50">
      {/* Countdown Section */}
      <div className="text-center group hover:bg-blue-600/30 p-2 rounded-lg transition-all duration-300">
        <p className="text-sm font-medium text-white opacity-80 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          PRIVATESALE ENDS IN
        </p>
        <span className="text-xl md:text-2xl font-bold text-white">
          <CountdownTimer
            className="text-xl md:text-2xl font-bold text-white"
            targetDate={endTime ? new Date(endTime) : presaleEndDate}
            onComplete={handleCountdownComplete}
          />
        </span>
      </div>

      <div className="hidden sm:block w-[2px] bg-gray-300"></div>

      {/* Token Price Section */}
      <div className="text-center group hover:bg-blue-600/30 p-2 rounded-lg transition-all duration-300">
        <p className="text-sm font-medium text-white opacity-80 flex items-center justify-center gap-2">
          <Coins className="w-4 h-4" />
          TOKEN PRICE
        </p>
        <p className="text-xl md:text-2xl font-bold text-white">{tokenPrice}</p>
      </div>

      <div className="hidden sm:block w-[2px] bg-gray-300"></div>

      {/* Total Participants Section */}
      <div className="text-center group hover:bg-blue-600/30 p-2 rounded-lg transition-all duration-300">
        <p className="text-sm font-medium text-white opacity-80 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          TOTAL INVESTORS
        </p>
        <p className="text-xl md:text-2xl font-bold text-white">
          {totalParticipants}
        </p>
      </div>

      <div className="hidden sm:block w-[2px] bg-gray-300"></div>

      {/* Transaction Volume Section */}
      <div className="text-center group hover:bg-blue-600/30 p-2 rounded-lg transition-all duration-300">
        <p className="text-sm font-medium text-white opacity-80 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          TRANSACTIONS
        </p>
        <p className="text-xl md:text-2xl font-bold text-white">
          {totalTransactions}
        </p>
      </div>
    </div>
  );
};

export default StatsBar;
