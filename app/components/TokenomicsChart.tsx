import React, { useState } from "react";

const TokenomicsChart = () => {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const tokenomicsData = [
    { name: "Development & Operations", value: 40, color: "#0086FF" },
    { name: "Community Incentives", value: 20, color: "#45C2FF" },
    { name: "Research & Development", value: 20, color: "#0049B7" },
    { name: "Partnerships & Marketing", value: 15, color: "#2E75D4" },
    { name: "Reserve Fund", value: 5, color: "#94CCFF" },
  ];

  const total = tokenomicsData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = tokenomicsData.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    const midAngle = startAngle + angle / 2;

    const outerRadius = 100;
    const innerRadius = 60;

    const startRadOuter = (startAngle - 90) * (Math.PI / 180);
    const endRadOuter = (startAngle + angle - 90) * (Math.PI / 180);
    const startRadInner = startRadOuter;
    const endRadInner = endRadOuter;

    const labelRadius = (outerRadius + innerRadius) / 2;
    const labelAngleRad = (midAngle - 90) * (Math.PI / 180);
    const labelX = Math.cos(labelAngleRad) * labelRadius;
    const labelY = Math.sin(labelAngleRad) * labelRadius;

    const x1 = Math.cos(startRadOuter) * outerRadius;
    const y1 = Math.sin(startRadOuter) * outerRadius;
    const x2 = Math.cos(endRadOuter) * outerRadius;
    const y2 = Math.sin(endRadOuter) * outerRadius;
    const x3 = Math.cos(endRadInner) * innerRadius;
    const y3 = Math.sin(endRadInner) * innerRadius;
    const x4 = Math.cos(startRadInner) * innerRadius;
    const y4 = Math.sin(startRadInner) * innerRadius;

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      path,
      labelX,
      labelY,
    };
  });

  return (
    <section className="bg-white py-20 px-4">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-5xl font-bold text-center mb-6 text-blue-600">
          TOKENOMICS
        </h2>
        <div className="w-20 h-1 bg-blue-300 mx-auto mb-6"></div>
        <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
          Our token distribution is designed to ensure sustainable growth and
          development of the QuantumSEC ecosystem.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Chart Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <svg viewBox="-120 -120 240 240" className="w-full">
                {segments.map((segment, index) => (
                  <g key={segment.name}>
                    <path
                      d={segment.path}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="1"
                      onMouseEnter={() => setActiveSegment(index)}
                      onMouseLeave={() => setActiveSegment(null)}
                      className="transition-all duration-300 hover:opacity-90"
                      transform={activeSegment === index ? `scale(1.05)` : ""}
                    />
                  </g>
                ))}
                <circle cx="0" cy="0" r="60" fill="white" />
                <text
                  x="0"
                  y="-15"
                  textAnchor="middle"
                  fill="#0052CC"
                  fontSize="10"
                  className="font-bold"
                >
                  TOTAL SUPPLY
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fill="#0052CC"
                  fontSize="14"
                  className="font-bold"
                >
                  1,000,000,000
                </text>
                <text
                  x="0"
                  y="30"
                  textAnchor="middle"
                  fill="#0052CC"
                  fontSize="10"
                  className="font-bold"
                >
                  QSE
                </text>
              </svg>
            </div>
          </div>

          {/* Legend and Info Section */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Token Allocation
            </h3>

            <div className="space-y-2 mb-8">
              {tokenomicsData.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-2 rounded transition-all duration-300 border-b border-gray-100`}
                  onMouseEnter={() => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-full h-1.5 rounded-full bg-gray-200 flex-grow"
                      style={{ maxWidth: "100px" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                          maxWidth: "250px",
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-blue-700">{item.value}%</span>
                </div>
              ))}
            </div>

            {/* Token Details Box */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h4 className="text-lg font-semibold mb-4 text-blue-800">
                Token Details
              </h4>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Token Name</p>
                  <p className="font-medium">QuantumSEC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Symbol</p>
                  <p className="font-medium">QSE</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Supply</p>
                  <p className="font-medium">1,000,000,000 QSE</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Burn Rate</p>
                  <p className="font-medium">2%</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Initial Price</p>
                  <p className="font-medium">$0.05 USD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vesting Period</p>
                  <p className="font-medium">12 Months</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsChart;
