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

const Home = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const openPurchaseModal = () => setShowPurchaseModal(true);
  const closePurchaseModal = () => setShowPurchaseModal(false);

  const handlePDFView = () => {
    const pdfPath = `${window.location.origin}/assets/whitepaper/QSE_TokenEVCI_Use Case.pdf`;
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

  return (
    <>
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8 md:pt-12">
        {/* Background with reduced intensity on mobile */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/grid-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px) brightness(1.05)",
            opacity: "0.75",
          }}
        ></div>

        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-16">
            {/* Responsive heading sizes */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-800"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "-0.5px",
              }}
            >
              Revolutionizing Blockchain Security with Quantum-Resistant AI
            </h1>

            {/* Mobile-friendly button layout */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button
                onClick={openPurchaseModal}
                className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg hover:shadow-xl active:translate-y-1 transition-all duration-300 text-lg md:text-xl shadow-md w-full sm:w-auto"
              >
                Buy Token
              </button>
              <button
                onClick={handlePDFView}
                className="px-8 py-3 md:px-10 md:py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 border-2 border-blue-300 text-lg md:text-xl shadow-sm w-full sm:w-auto"
              >
                Read Whitepaper
              </button>
            </div>
          </div>

          {/* Mobile-optimized stats bar */}
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6 border-2 border-blue-200 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
              <div className="p-2 md:p-3 border-b-2 sm:border-b-0 border-blue-200 sm:border-0 last:border-b-0">
                <p className="text-blue-700 text-xs md:text-sm uppercase font-bold tracking-wider mb-1">
                  PRESALE ENDS IN
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-900">
                  14:23:42:01
                </p>
              </div>
              <div className="p-2 md:p-3 border-b-2 sm:border-b-0 sm:border-x-2 border-blue-200 last:border-b-0">
                <p className="text-blue-700 text-xs md:text-sm uppercase font-bold tracking-wider mb-1">
                  TOKEN PRICE
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-900">
                  $0.05
                </p>
              </div>
              <div className="p-2 md:p-3">
                <p className="text-blue-700 text-xs md:text-sm uppercase font-bold tracking-wider mb-1">
                  RAISED
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-900">
                  $3.2M / $5M
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-blue-900">
            About Quantum SEC
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16 px-2">
            <p className="text-base md:text-lg text-gray-700">
              QSE Token combines blockchain security, pilot AI, and quantum
              technology to create a safer, more efficient EV charging
              ecosystem. We focus on privacy-first payments, minimal data
              collection, and quantum-resistant security to ensure your
              transactions are safe and private.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature cards - same content, improved mobile layout */}
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Seamless Payments",
                description:
                  "Our blockchain enables instant, secure transactions across charging networks worldwide.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Global Coverage",
                description:
                  "Access the same payment system for charging your electric vehicle around the globe.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Low Transaction Fees",
                description:
                  "Pay less with our optimized blockchain that minimizes transaction costs.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ),
                title: "Sustainability Mission",
                description:
                  "Every transaction contributes to our sustainable energy and carbon offset initiatives.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-row sm:flex-col items-center sm:items-stretch"
              >
                <div className="flex-shrink-0 sm:mx-auto mb-0 sm:mb-4 mr-4 sm:mr-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-blue-500">{feature.icon}</span>
                  </div>
                </div>
                <div className="flex-1 sm:text-center">
                  <h3 className="text-lg sm:text-xl text-blue-600 font-medium mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                  <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-600 mt-3 sm:mt-4 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Future of QSE - Mobile Friendly */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6 md:gap-8 overflow-hidden">
            <div className="lg:w-3/4">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
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

            <div className="lg:w-1/4 flex justify-center mt-4 lg:mt-0">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <div className="spin w-full h-full"></div>
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

      <section id="token-sale" className="py-12 md:py-16">
        <TokenSale />
      </section>

      <section id="roadmap" className="py-12 md:py-16">
        <RoadmapSection />
      </section>

      <section id="team" className="py-12 md:py-16">
        <TeamSection />
      </section>

      <section id="faq" className="py-12 md:py-16">
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
