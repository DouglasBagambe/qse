import React from "react";
import { Shield } from "lucide-react";

const RoadmapPath = () => (
  <svg
    className="absolute left-1/2 -translate-x-1/2 h-full w-[500px] hidden md:block"
    viewBox="0 0 200 800"
    preserveAspectRatio="none"
  >
    {/* Main path definition */}
    <defs>
      <path id="mainPath" d="M100,0 C160,200 40,400 100,600 S160,800 100,800" />

      {/* Road gradient */}
      <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>

      {/* Glow effect */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer glow effect */}
    <use
      href="#mainPath"
      strokeWidth="12"
      stroke="url(#roadGradient)"
      fill="none"
      opacity="0.3"
      filter="url(#glow)"
    />

    {/* Main road borders */}
    <use
      href="#mainPath"
      strokeWidth="8"
      stroke="url(#roadGradient)"
      fill="none"
      className="path-animation"
    />

    {/* Center dashed line */}
    <use
      href="#mainPath"
      strokeWidth="2"
      stroke="white"
      fill="none"
      strokeDasharray="8 8"
      className="path-animation"
    />

    {/* Milestone points */}
    {[200, 400, 600].map((cy, i) => (
      <g key={cy} className={`blink-animation ${i > 0 ? `delay-${i}` : ""}`}>
        {/* Larger outer circle */}
        <circle
          cx="100"
          cy={cy}
          r="8"
          fill="url(#roadGradient)"
          opacity="0.3"
        />
        {/* Inner circle */}
        <circle cx="100" cy={cy} r="4" fill="url(#roadGradient)" />
      </g>
    ))}
  </svg>
);

interface RoadmapItemProps {
  number: string;
  title: string;
  description: string;
  isLeft: boolean;
  index: number;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({
  number,
  title,
  description,
  isLeft,
  index,
}) => {
  return (
    <div
      className={`flex w-full items-start md:items-center ${
        isLeft ? "justify-start" : "justify-end"
      } relative group`}
    >
      {/* Content Container - maintains left alignment of text while allowing positioning */}
      <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-16" : "md:pl-16"}`}>
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-400 p-6 rounded-2xl 
                    transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
          style={{
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${index * 0.3}s forwards`,
          }}
        >
          {/* Content is always left-aligned */}
          <div className="flex items-center gap-4 mb-3">
            <Shield className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-white/90">{description}</p>
        </div>
      </div>

      {/* Number Circle */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <div
          className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center 
                    font-bold text-xl transform transition-all duration-500 group-hover:scale-110 
                    group-hover:bg-blue-500 shadow-lg"
          style={{
            opacity: 0,
            animation: `bounce 0.5s ease-out ${index * 0.3}s forwards`,
          }}
        >
          {number}
        </div>
      </div>
    </div>
  );
};

const RoadmapSection = () => {
  const roadmapItems = [
    {
      number: "Q1",
      title: "Foundation and Pilot",
      description:
        "Infrastructure Setup and Smart Contract Basics implementation. Launching small pilot program while focusing on stakeholder onboarding to establish a strong foundation for the network.",
    },
    {
      number: "Q2",
      title: "Careful Expansion",
      description:
        "Scaling the pilot program while implementing energy trading trials. Developing interoperability features and introducing community incentives to drive adoption and engagement.",
    },
    {
      number: "Q3",
      title: "Deeper Security and Optimization",
      description:
        "Implementing AI and Quantum Testing phases while enhancing privacy features. Introducing Layer-2 solutions and developing comprehensive data insights for network optimization.",
    },
    {
      number: "Q4",
      title: "Wider Adoption",
      description:
        "Rolling out full-scale gradual deployment and establishing key collaborations. Focusing on user experience improvements and conducting thorough network assessment.",
    },
  ];

  return (
    <section className="bg-[#040347] min-h-screen text-white pt-20 pb-12 px-4 overflow-hidden">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce {
            0% { opacity: 0; transform: scale(0); }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          
          .blink-animation {
            animation: blink 2s infinite;
          }
          
          .delay-1 { animation-delay: 0.5s; }
          .delay-2 { animation-delay: 1s; }
          
          .path-animation {
            stroke-dashoffset: 1000;
            animation: drawPath 3s ease-out forwards;
          }
          
          @keyframes drawPath {
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>

      <h1 className="text-4xl font-bold text-center mb-16">2025 Roadmap</h1>

      <div className="max-w-5xl mx-auto relative">
        <RoadmapPath />

        <div className="space-y-16 md:space-y-32 relative">
          {roadmapItems.map((item, index) => (
            <RoadmapItem
              key={item.number}
              {...item}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
