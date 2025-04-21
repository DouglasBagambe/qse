"use client";

import React from "react";
import CountdownTimer from "./CountdownTimer";

interface StatsBarProps {
  tokenPrice: string;
  raisedAmount: string;
  targetAmount: string;
  presaleEndDate?: Date;
}

const StatsBar: React.FC<StatsBarProps> = ({
  tokenPrice,
  raisedAmount,
  targetAmount,
  presaleEndDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
}) => {
  const handleCountdownComplete = () => {
    console.log("Presale countdown completed!");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center bg-blue-700/90 backdrop-filter backdrop-blur-lg rounded-lg p-3 md:p-4 shadow-lg w-full max-w-5xl border-2 border-[#2563EB]/50">
      <div className="text-center">
        <p className="text-sm font-medium text-white opacity-80">
          PRESALE ENDS IN
        </p>
        <span className="text-xl md:text-2xl font-bold text-white">
          <CountdownTimer
            className="text-xl md:text-2xl font-bold text-white"
            targetDate={presaleEndDate}
            onComplete={handleCountdownComplete}
          />
        </span>
      </div>
      <div className="hidden sm:block w-[2px] bg-gray-300"></div>
      <div className="text-center">
        <p className="text-sm font-medium text-white opacity-80">TOKEN PRICE</p>
        <p className="text-xl md:text-2xl font-bold text-white">{tokenPrice}</p>
      </div>
      <div className="hidden sm:block w-[2px] bg-gray-300"></div>
      <div className="text-center">
        <p className="text-sm font-medium text-white opacity-80">RAISED</p>
        <p className="text-xl md:text-2xl font-bold text-white">
          {raisedAmount} / {targetAmount}
        </p>
      </div>
    </div>
  );
};

export default StatsBar;
