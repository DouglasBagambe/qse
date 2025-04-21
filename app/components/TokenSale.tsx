import React from "react";

const TokenSale = () => {
  return (
    <div className="bg-blue-700 py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-center mb-6 text-white">
            TOKEN SALE
          </h2>
          <div className="w-20 h-1 bg-blue-300 mx-auto mb-6"></div>
          <p className="text-center text-white/80 text-lg mb-16 max-w-3xl mx-auto">
            Join our ICO and be part of the energy payment revolution. Limited
            tokens available at the current price.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-blue-50 rounded-xl overflow-hidden shadow-lg max-w-3xl w-full">
            <div className="flex flex-col md:flex-row">
              <div className="bg-blue-100 p-6 md:w-1/2">
                {/* Left side - Timer and Stats */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1 text-blue-800 text-sm">
                    <span>Token Sale Progress</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-blue-700 mt-1">
                    <span>Soft Cap: $3M</span>
                    <span>Hard Cap: $10M</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-blue-800 text-sm font-medium mb-2">
                    Time Remaining
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">14</div>
                      <div className="text-xs text-blue-800">Days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">23</div>
                      <div className="text-xs text-blue-800">Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">59</div>
                      <div className="text-xs text-blue-800">Minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">55</div>
                      <div className="text-xs text-blue-800">Seconds</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-blue-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Sale ends on April 28, 2025</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-blue-800 text-sm mb-6">
                  <div>
                    <div className="text-blue-600 text-xs">Current Price:</div>
                    <div>$0.05 USD</div>
                  </div>
                  <div>
                    <div className="text-blue-600 text-xs">
                      Minimum Purchase:
                    </div>
                    <div>100 QSE</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-blue-600 text-xs">
                      Accepted Currencies:
                    </div>
                    <div>ETH, USDC, USDT, BNB</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="text-blue-700 font-bold text-sm">
                      10,350+
                    </div>
                    <div className="text-blue-600 text-xs">Contributors</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="text-blue-700 font-bold text-sm">$6.5M</div>
                    <div className="text-blue-600 text-xs">Raised</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="text-blue-700 font-bold text-sm">65M</div>
                    <div className="text-blue-600 text-xs">Tokens Sold</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded p-2">
                    <div className="text-blue-700 font-bold text-sm">35M</div>
                    <div className="text-blue-600 text-xs">
                      Tokens Remaining
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:w-1/2">
                {/* Right side - Purchase Form */}
                <h3 className="text-blue-800 font-medium mb-4">
                  Purchase Tokens
                </h3>
                <div className="mb-4">
                  <label className="text-xs text-blue-700 mb-1 block">
                    Ethereum Address
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
                      className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-2 rounded-l flex-grow focus:outline-none"
                    />
                    <button className="bg-blue-500 text-white px-3 rounded-r">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-xs text-blue-700 mb-1 block">
                    Amount to Purchase
                  </label>
                  <input
                    type="number"
                    className="w-full bg-blue-50 border border-blue-200 text-blue-800 text-xs p-2 rounded focus:outline-none"
                    placeholder="Enter amount"
                  />
                </div>

                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded text-sm mb-2">
                  Register for Token Sale →
                </button>

                <p className="text-xs text-blue-700 text-center">
                  By continuing you agree with the terms of service and privacy
                  policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSale;
