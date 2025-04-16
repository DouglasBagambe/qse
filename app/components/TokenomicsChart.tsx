import React, { useState } from "react";

const TokenomicsChart = () => {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const tokenomicsData = [
    { name: "Development and Operations", value: 40, color: "#4A90E2" },
    { name: "Community Incentives", value: 20, color: "#50E3C2" },
    { name: "Research & Development", value: 20, color: "#F5A623" },
    { name: "Partnerships and Marketing", value: 15, color: "#7ED321" },
    { name: "Reserve Fund", value: 5, color: "#BD10E0" },
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
    <div className="w-full max-w-5xl mx-auto shadow-none">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chart Section */}
          <div className="w-full lg:w-1/2 items-center">
            <div className="relative">
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
                    <text
                      x={segment.labelX}
                      y={segment.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      className="font-bold"
                    >
                      {segment.value}%
                    </text>
                  </g>
                ))}
                <text
                  x="0"
                  y="-15"
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  className="font-bold"
                >
                  TOTAL SUPPLY
                </text>
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  className="font-bold"
                >
                  1,000,000,000
                </text>
                <text
                  x="0"
                  y="25"
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  className="font-bold"
                >
                  QSE TOKENS
                </text>
              </svg>
            </div>
          </div>

          {/* Legend and Info Section */}
          <div className="w-full lg:w-1/2 mt-12">
            <div className="space-y-3">
              {tokenomicsData.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                    activeSegment === index ? "bg-opacity-20 bg-white" : ""
                  }`}
                  onMouseEnter={() => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded transition-transform duration-300 ${
                        activeSegment === index ? "scale-125" : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-white">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-white opacity-80 space-y-2">
              <div>Burn Rate: 2% Monthly transaction fees</div>
              <div>
                Distribution Timeline: Development, partnerships and incentives
                over 5 years
              </div>
              <div>30% initial circulating supply in phase 1 for liquidity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsChart;
