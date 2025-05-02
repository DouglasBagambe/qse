// app/components/pages/Home.tsx

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/pages/Home.tsx

"use client";

import React, { useState } from "react";
import RoadmapSection from "../RoadmapSection";
import TokenomicsChart from "../TokenomicsChart";
import TeamSection from "../TeamSection";
import FAQSection from "../FAQSection";
import NewsletterSection from "../NewsletterSection";
import QSEEcosystem from "../QSEEcosystem";
import TokenSale from "../TokenSale";
import CoreValues from "../CoreValues";
import TokenPurchaseModal from "../TokenPurchaseModal";
import StatsBar from "../StatsBar";
import { Compass, Shield, Puzzle, Users, FileText, Coins } from "lucide-react";
import TunnelWithSpinningLogos from "../Grid-Hero";

const Home = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Set the presale end date (adjustable)
  const presaleEndDate = new Date();
  presaleEndDate.setMonth(presaleEndDate.getMonth() + 2); // 2 months from now

  const openPurchaseModal = () => setShowPurchaseModal(true);
  const closePurchaseModal = () => setShowPurchaseModal(false);

  const handlePDFView = () => {
    const pdfPath = `${window.location.origin}/assets/whitepaper/QSETokenWhitePaper.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE-Token EVCI Whitepaper</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${pdfPath}" type="application/pdf" width="100%" height="100%"></iframe>
        </body>
      </html>
      `);
    }
  };

  const handleUseCasePDFView = () => {
    const pdfPath = `${window.location.origin}/assets/whitepaper/QSE_TokenEVCI_Use_Case.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE-Token EVCI Use Case</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${pdfPath}" type="application/pdf" width="100%" height="100%"></iframe>
        </body>
      </html>
      `);
    }
  };

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 md:pt-12 bg-gradient-to-b from-[#1E3A8A] to-[#0A1733]">
        {/* Background with Tunnel SVG */}
        <div className="absolute inset-0 w-full h-full">
          <TunnelWithSpinningLogos />
        </div>
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-16">
            {/* Adjusted heading for better visibility */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-blue-600"
              // style={{
              //   textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              //   letterSpacing: "-0.5px",
              // }}
            >
              Revolutionizing Blockchain Security with Quantum-Resistant AI
            </h1>

            {/* Updated button designs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button
                onClick={openPurchaseModal}
                className="flex items-center justify-center px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white font-semibold rounded-lg hover:shadow-[0_0_15px_#2563EB] active:translate-y-1 transition-all duration-300 text-lg md:text-xl shadow-lg w-full sm:w-auto relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Coins size={25} />
                  <span>Buy Token</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </button>
              <button
                onClick={handlePDFView}
                className="flex items-center justify-center px-8 py-3 md:px-10 md:py-4 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-[#E5E7EB] active:bg-[#D1D5DB] transition-all duration-300 border-2 border-[#2563EB] text-lg md:text-xl shadow-sm w-full sm:w-auto group relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-[#1E40AF] transition-colors duration-300 flex items-center justify-center gap-2">
                  <FileText size={25} />
                  <span>Read Whitepaper</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2563EB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            </div>
          </div>

          {/* Updated stats bar with bg-blue-700 */}
          {/* <StatsBar
            tokenPrice=" "
            raisedAmount=" "
            targetAmount=" "
            presaleEndDate={presaleEndDate}
          /> */}
        </div>{" "}
      </section>

      {/* About Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-blue-900">
            About Quantum SEC
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16 px-2">
            <p className="text-base md:text-lg text-gray-700">
              The QSE Token Ecosystem was created with one goal in mind: to make
              digital security simple, powerful, and accessible for everyone.
              Backed by industry leaders in Cybersecurity , Quantum Mechanics,
              AI, and Blockchain, we are building a future where individuals and
              organizations can safely adopt technology without fear. Whether
              you're a startup, a clean energy innovator, or an investor looking
              to fuel the next wave of secure digital growth—QSE is your
              gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature cards */}
            {[
              {
                icon: <Compass size={36} />,
                title: "Mission-Driven",
                description:
                  "We're building a smarter, safer digital future by combining AI, quantum cryptography, and cybersecurity to protect data, businesses, and communities.",
              },
              {
                icon: <Shield size={36} />,
                title: "Security First",
                description:
                  "QSE Token powers a trusted ecosystem focused on protecting assets, identities, and digital interactions.",
              },
              {
                icon: <Puzzle size={36} />,
                title: "Real-World Use Cases",
                description:
                  "From secure energy grids to safe electric vehicle charging and cloud-based data protection, QSE Token fuels practical solutions.",
                onClick: handleUseCasePDFView,
              },
              {
                icon: <Users size={36} />,
                title: "Led by Experts",
                description:
                  "Founded by experienced leaders in cybersecurity, AI, quantum mechanics, and blockchain with a passion for protecting the future.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center p-4 border-2 border-blue-100">
                    <span className="text-blue-600">{feature.icon}</span>
                  </div>
                </div>
                <div
                  className="text-center border-2 border-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
                  style={{
                    minHeight: "200px",
                    maxHeight: "300px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    className="text-xl text-blue-600 font-semibold mb-3 cursor-pointer hover:underline"
                    onClick={feature.onClick}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Future of QSE - Mobile Friendly */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white overflow-hidden flex flex-col lg:flex-row">
            {/* Content Side */}
            <div className="p-6 md:p-8 lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                The Future of Quantum SEC
              </h2>
              <p className="mb-4 md:mb-6 text-blue-50 text-sm md:text-base">
                Quantum SEC is more than just a cryptocurrency - it's a complete
                ecosystem designed to accelerate the adoption of sustainable
                energy and services.
              </p>

              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-200 flex-shrink-0">✓</span>
                  <span>Direct integration with charging networks</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-200 flex-shrink-0">✓</span>
                  <span>Smart contracts for automated payments</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-200 flex-shrink-0">✓</span>
                  <span>Energy trading capabilities</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-200 flex-shrink-0">✓</span>
                  <span>Carbon offset through renewable investments</span>
                </li>
              </ul>
            </div>

            {/* Spin Icon Side - Slightly different background */}
            <div className="lg:w-1/3 bg-blue-400 bg-opacity-25 flex items-center justify-center p-6 md:p-8">
              <div className="relative flex items-center justify-center">
                <div
                  className="spin"
                  style={{ width: "120px", height: "120px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining Sections - Now wrapped with consistent spacing for mobile */}
      <section id="ecosystem" className="py-12 md:py-16">
        <QSEEcosystem />
      </section>

      <section id="tokenomics" className="py-12 md:py-16">
        <TokenomicsChart />
      </section>

      <section id="roadmap" className="">
        <RoadmapSection />
      </section>
      <hr className="border-t border-gray-300" />

      {/* <section id="team" className="">
        <TeamSection />
      </section>
      <hr className="border-t border-gray-300" /> */}

      <section id="faq" className="">
        <FAQSection />
      </section>

      <section id="newsletter" className="py-12 md:py-16">
        <NewsletterSection />
      </section>

      {/* Token Purchase Modal */}
      {showPurchaseModal && (
        <TokenPurchaseModal
          isOpen={showPurchaseModal}
          onClose={closePurchaseModal}
        />
      )}
    </>
  );
};

export default Home;
