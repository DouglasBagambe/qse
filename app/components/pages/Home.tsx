// app/components/pages/Home.tsx

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUser,
  faGlobe,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

import TokenPurchaseModal from "../TokenPurchaseModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [number, setNumber] = useState<number | null>(null);

  const [navbar, setNavbar] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const openPurchaseModal = () => {
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
  };

  const handlePDFView = () => {
    const pdfPath = `${window.location.origin}/assets/whitepaper/QSE_TokenEVCI_Use Case.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE-Token EVCI Whitepaper</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${pdfPath}" type="application/pdf" width="100%" height="100%"></iframe>
        </body>
      `);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-12">
        {/* Grid Background - with reduced opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/grid-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            opacity: "0.8", // Reduced opacity to increase contrast with text
          }}
        ></div>

        <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Enhanced heading with stronger gradient, text shadow and larger size */}
            <h1
              className="text-6xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-800"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "-0.5px",
              }}
            >
              Revolutionizing Blockchain Security with Quantum-Resistant AI
            </h1>

            {/* Darker text color, increased weight, and slight shadow */}
            <p
              className="text-xl md:text-2xl mb-10 text-blue-900 max-w-3xl mx-auto font-semibold"
              style={{ textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}
            >
              The QuantumSEC (QSE) Token merges quantum computing and artificial
              intelligence to revolutionize industries like finance, renewable
              energy, supply chain logistics, and cybersecurity.
            </p>

            {/* Increased contrast on feature bullets */}
            <div className="flex flex-wrap gap-8 justify-center mb-12">
              <div className="flex items-center text-blue-800 font-semibold">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span>Early Investors Get Exclusive Bonuses</span>
              </div>
              <div className="flex items-center text-blue-800 font-semibold">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span>AI & Quantum Security-Powered Transactions</span>
              </div>
              <div className="flex items-center text-blue-800 font-semibold">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span>Limited Supply with Deflationary Tokenomics</span>
              </div>
            </div>

            {/* Enhanced buttons with stronger hover effect */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                onClick={openPurchaseModal}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg hover:shadow-xl hover:translate-y-1 transition-all duration-300 text-xl shadow-md"
              >
                Buy Token
              </button>
              <button
                onClick={handlePDFView}
                className="px-10 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-300 border-2 border-blue-300 text-xl shadow-sm"
              >
                Read Whitepaper
              </button>
            </div>
          </div>

          {/* Enhanced stats bar with stronger background */}
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-filter backdrop-blur-lg rounded-xl p-6 border-2 border-blue-200 shadow-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <p className="text-blue-700 text-sm uppercase font-bold tracking-wider mb-1">
                  PRESALE ENDS IN
                </p>
                <p className="text-3xl font-extrabold text-blue-900">
                  14:23:42:01
                </p>
              </div>
              <div className="p-3 border-x-2 border-blue-200">
                <p className="text-blue-700 text-sm uppercase font-bold tracking-wider mb-1">
                  TOKEN PRICE
                </p>
                <p className="text-3xl font-extrabold text-blue-900">$0.05</p>
              </div>
              <div className="p-3">
                <p className="text-blue-700 text-sm uppercase font-bold tracking-wider mb-1">
                  RAISED
                </p>
                <p className="text-3xl font-extrabold text-blue-900">
                  $3.2M / $5M
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
            About Quantum SEC
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-lg text-gray-700">
              QSE Token combines blockchain security, pilot AI, and quantum
              technology to create a safer, more efficient EV charging
              ecosystem. We focus on privacy-first payments, minimal data
              collection, and quantum-resistant security to ensure your
              transactions are safe and private.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-500 text-2xl">
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
                </span>
              </div>
              <h3 className="text-xl text-blue-600 font-medium text-center mb-2">
                Seamless Payments
              </h3>
              <p className="text-gray-600 text-center">
                Our blockchain enables instant, secure transactions across
                charging networks worldwide.
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-600 mt-4 rounded-full"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-500 text-2xl">
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
                </span>
              </div>
              <h3 className="text-xl text-blue-600 font-medium text-center mb-2">
                Global Coverage
              </h3>
              <p className="text-gray-600 text-center">
                Access the same payment system for charging your electric
                vehicle around the globe.
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-600 mt-4 rounded-full"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-500 text-2xl">
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
                </span>
              </div>
              <h3 className="text-xl text-blue-600 font-medium text-center mb-2">
                Low Transaction Fees
              </h3>
              <p className="text-gray-600 text-center">
                Pay less with our optimized blockchain that minimizes
                transaction costs.
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-600 mt-4 rounded-full"></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-500 text-2xl">
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
                </span>
              </div>
              <h3 className="text-xl text-blue-600 font-medium text-center mb-2">
                Sustainability Mission
              </h3>
              <p className="text-gray-600 text-center">
                Every transaction contributes to our sustainable energy and
                carbon offset initiatives.
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-600 mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="value">
        <CoreValues />
      </section>

      {/* The Future of QSE */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                The Future of Quantum SEC
              </h2>
              <p className="mb-8 text-blue-100">
                Quantum SEC is more than just a cryptocurrency - it's a complete
                ecosystem designed to accelerate the adoption of sustainable
                energy and services.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-3 text-blue-300">✓</span>
                  <span>Direct integration with charging networks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-300">✓</span>
                  <span>Smart contracts for automated payments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-300">✓</span>
                  <span>Energy trading capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-blue-300">✓</span>
                  <span>Carbon offset through renewable investments</span>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-blue-800 bg-opacity-30 rounded-2xl p-8 backdrop-filter backdrop-blur-sm border border-blue-700 border-opacity-30">
                <img
                  src="/assets/spin.png"
                  alt="Quantum Technology"
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* QSE Ecosystem Section */}
      <section id="ecosystem">
        <QSEEcosystem />
      </section>
      {/* Tokenomics Section */}
      <section id="tokenomics">
        <TokenomicsChart />
      </section>

      {/* Token Sale Section */}
      <section id="token-sale">
        <TokenSale />
      </section>
      <section id="roadmap">
        <RoadmapSection />
      </section>
      {/* Team Section */}
      <section id="team">
        <TeamSection />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* Newsletter Section */}
      <section id="newsletter">
        <NewsletterSection />
      </section>

      <section className="bg-[#040347] text-white pt-[30px] pb-[50px]">
        <div className="max-w-[1700px] mx-auto p-5">
          <h1 className="text-4xl font-bold text-center mb-20">
            Partners & Collaborators
          </h1>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-6 sm:grid-cols-3">
            <div>
              <a href="#">
                <img src="assets/slide_1.png" className="w-[150px] mx-auto" />
              </a>
            </div>
            <div>
              <a href="#">
                <img src="assets/slide_2.png" className="w-[150px] mx-auto" />
              </a>
            </div>
            <div>
              <a href="#">
                <img src="assets/slide_3.png" className="w-[150px] mx-auto" />
              </a>
            </div>
            <div>
              <a href="#">
                <img src="assets/slide_4.png" className="w-[150px] mx-auto" />
              </a>
            </div>
            <div>
              <a href="#">
                <img src="assets/slide_5.png" className="w-[150px] mx-auto" />
              </a>
            </div>
            <div>
              <a href="#">
                <img src="assets/slide_6.png" className="w-[150px] mx-auto" />
              </a>
            </div>
          </div>
        </div>
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
