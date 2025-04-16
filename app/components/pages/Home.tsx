// app/components/pages/Home.tsx

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import RoadmapSection from "../RoadmapSection";
import TokenomicsChart from "../TokenomicsChart";

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
      <section className="bg-[#040347] text-white lg:pt-[100px] lg:pb-[50px] py-[50px]">
        <div className="max-w-[1300px] mx-auto p-5 pt-[4.5rem]">
          <div className="flex lg:flex-row gap-[80px] flex-col">
            <div className="flex-1">
              <div>
                <h1 className="lg:text-[2.5rem] font-bold text-[1.8rem] pr-7">
                  Revolutionizing Blockchain Security with Quantum-Resistant AI
                </h1>
                <p className="lg:text-[18px] text-[16px] mt-7 pr-7">
                  The QuantumSEC (QSE) Token merges quantum computing and
                  artificial intelligence to revolutionize industries like
                  finance, renewable energy, supply chain logistics, and
                  cybersecurity. Built on a quantum-resistant blockchain with an
                  AI-driven consensus mechanism, QSE delivers unmatched
                  efficiency, security, and scalability. <br />
                  <br />
                  This isn't just a cryptocurrency—it's the foundation of a
                  decentralized quantum AI revolution. QSE is poised to become
                  the leading token for the quantum AI era. Don't just witness
                  the future—be a part of it.
                </p>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] flex items-center">
                      <span className="text-blue-400 mr-2">🔹</span>
                      Early Investors Get Exclusive Bonuses
                    </p>
                    <p className="text-[16px] flex items-center">
                      <span className="text-blue-400 mr-2">🔹</span>
                      AI & Quantum Security-Powered Transactions
                    </p>
                    <p className="text-[16px] flex items-center">
                      <span className="text-blue-400 mr-2">🔹</span>
                      Limited Supply with Deflationary Tokenomics
                    </p>
                  </div>
                  <div className="flex md:flex-row flex-col lg:gap-2 gap-5 mt-[20px]">
                    <button
                      onClick={handlePDFView}
                      className="px-6 button-g py-2 rounded-[15px] min-w-[300px] text-center bg-gradient-to-r from-[#a42e9a] to-[#5951f6] hover:opacity-90 transition-opacity"
                    >
                      Whitepaper
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <img
                className="w-full h-[auto]"
                src="/assets/banner.gif"
                width="100%"
                alt="QSE Token - Quantum AI Revolution"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#040347] text-white">
        <div className="max-w-[1200px] mx-auto p-5">
          <div className="grid lg:grid-cols-4 grid-cols-2">
            <div className="text-center lg:mb-0 mb-[50px]">
              <span className="bg-[#5964da] w-[80px] h-[80px] flex justify-center items-center mx-auto mb-3 inline-block px-[20px] py-[20px] rounded-full">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-[30px] text-[#09090a]"
                />
              </span>
              <p className="text-[15px] mb-3">Security</p>
              <p>End-to-End Encryption</p>
            </div>

            <div className="text-center lg:mb-0 mb-[50px]">
              <span className="bg-[#5964da] w-[80px] h-[80px] flex justify-center items-center mx-auto mb-3 inline-block px-[20px] py-[20px] rounded-full">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-[30px] text-[#09090a]"
                />
              </span>
              <p className="text-[15px] mb-3">Authentication</p>
              <p>Multi-Factor Security</p>
            </div>

            <div className="text-center lg:mb-0 mb-[50px]">
              <span className="bg-[#5964da] w-[80px] h-[80px] flex justify-center items-center mx-auto mb-3 inline-block px-[20px] py-[20px] rounded-full">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-[30px] text-[#09090a]"
                />
              </span>
              <p className="text-[15px] mb-3">Detection</p>
              <p>Real-Time Monitoring</p>
            </div>

            <div className="text-center lg:mb-0 mb-[50px]">
              <span className="bg-[#5964da] w-[80px] h-[80px] flex justify-center items-center mx-auto mb-3 inline-block px-[20px] py-[20px] rounded-full">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-[30px] text-[#09090a]"
                />
              </span>
              <p className="text-[15px] mb-3">Payments</p>
              <p>Secure Integration</p>
            </div>
          </div>
        </div>
      </section>
      <section
        className="bg-[#040347] text-white lg:py-[50px] pb-[50px]"
        id="buy"
      >
        <div className="max-w-[1200px] mx-auto p-5">
          <div className="flex lg:flex-row flex-col lg:gap-[150px] gap-[50px]">
            <div className="flex-1 flex justify-center items-center">
              <img src="assets/banner-2.png" className="w-full h-[auto] ball" />
            </div>
            <div className="flex-1">
              <div>
                <h1 className="lg:text-[2.5rem] font-bold text-[2rem] pr-7">
                  Why Choose QSE Token?
                </h1>
                <p className="lg:text-[18px] text-[16px] mt-4 pr-7">
                  QSE Token combines blockchain security, pilot AI, and quantum
                  technology to create a safer, more efficient EV charging
                  ecosystem. We focus on privacy-first payments, minimal data
                  collection, and quantum-resistant security to ensure your
                  transactions are safe and private.
                </p>
                <button
                  onClick={openPurchaseModal}
                  className="buytoken px-6 py-2 text-white rounded-[15px] lg:min-w-[300px] min-w-[250px] text-center py-3 inline-block mt-[30px] px-[40px] bg-gradient-to-r from-[#a42e9a] to-[#5951f6]"
                >
                  Buy Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:py-[100px] py-[50px]">
        <div className="max-w-[1300px] mx-auto p-5">
          <h3 className="lg:text-[25px] text-black text-[22px] mb-[50px] text-center font-bold">
            Core Features
          </h3>
          <div className="grid lg:grid-cols-4 lg:gap-[80px] gap-[30px] grid-cols-1">
            <div className="text-center">
              <div className="bg-[#313a82] scale-100 hover:scale-110 hover:bg-[#0E34F0] cursor-pointer ease-in duration-500 text-white px-6 pt-8 pb-3 custom-shadow rounded-[20px] h-full md:w-full h-[22rem]">
                <img
                  src="assets/cybersecurity.webp"
                  className="h-[60px] mb-1 inline-block mx-auto"
                />
                <p className="mb-4 text-[20px]">Secure Mobile Application</p>
                <p className="mb-4 text-[15px] flex text-center justify-center">
                  Simple, privacy-centered payments that make sense to everyday
                  EV owners. Pay with QSE tokens or credit/debit cards with
                  minimal data collection.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-[#313a82] scale-100 hover:scale-110 hover:bg-[#0E34F0] cursor-pointer ease-in duration-500 text-white px-6 pt-8 pb-3 custom-shadow rounded-[20px] h-full md:w-full h-[22rem]">
                <img
                  src="assets/smartcontract.webp"
                  className="h-[60px] mb-1 inline-block mx-auto"
                />
                <p className="mb-1 text-[20px]">End-to-End Encryption</p>
                <p className="mb-2 text-[15px]">
                  Advanced encryption protocols ensure your transactions and
                  data remain secure throughout the entire charging process.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-[#313a82] scale-100 hover:scale-110 hover:bg-[#0E34F0] cursor-pointer ease-in duration-500 text-white px-6 pt-8 pb-3 cutom-shadow rounded-[20px] h-full md:w-full h-[22rem]">
                <img
                  src="assets/NFTs.webp"
                  className="h-[60px] mb-1 inline-block mx-auto"
                />
                <p className="mb-3 text-[20px]">Real-Time Monitoring</p>
                <p className="mb-4 text-[15px]">
                  Advanced threat detection and real-time anomaly monitoring
                  ensure your charging sessions remain secure and efficient.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-[#313a82] scale-100 hover:scale-110 hover:bg-[#0E34F0] cursor-pointer ease-in duration-500 text-white px-6 pt-8 pb-3 cutom-shadow rounded-[20px] h-full md:w-full h-[22rem]">
                <img
                  src="assets/graph.webp"
                  className="h-[60px] mb-1 inline-block mx-auto"
                />
                <p className="mb-4 text-[20px]">Compliance Management</p>
                <p className="mb-4 text-[15px]">
                  Comprehensive compliance management system ensuring adherence
                  to regulatory requirements while maintaining user privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#040347] text-white pt-[90px] lg:pb-[70px]"
        id="value"
      >
        <div className="max-w-[900px] mx-auto p-5">
          <h4 className="text-white lg:text-[35px] text-[22px] text-center lg:mb-[50px] mb-[30px]">
            Our Core Values
          </h4>
          <div className="flex lg:flex-row flex-col py-[50px] items-center lg:gap-[150px] gap-[50px]">
            <div className="flex-1">
              <h1 className="lg:text-[2.5rem] lg:text-left text-center uppercase mb-[50px] font-bold text-[2rem] pr-7">
                OUR VISION
              </h1>
              <p className="lg:text-[18px] lg:text-left text-center text-[16px] mt-4 lg:pr-7">
                HCISS, LLC (BSECAENERGY) imagines a world where QSE powers a
                safer, greener EV charging scene. By 2028, we want top-notch
                security and sustainability in e-mobility.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="assets/rainbow.gif"
                className="lg:h-[300px] h-[250px]"
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col items-center py-[50px] lg:gap-[150px] gap-[50px]">
            <div className="flex-1 lg:order-1 order-2">
              <img src="assets/mission1.gif" className="h-[300px]" />
            </div>
            <div className="flex-1 lg:order-2 order-1">
              <h1 className="lg:text-[2.5rem] lg:text-left text-center uppercase mb-[50px] font-bold text-[2rem] pr-7">
                OUR MISSION
              </h1>
              <p className="lg:text-[18px] lg:text-left text-center text-[16px] mt-4 lg:pr-7">
                Our mission is to speed up EV adoption by delivering advanced
                yet careful AI and Quantum solutions. We respect user data and
                want to support people in many cultures who seek clean energy
                and trust.
              </p>
            </div>
          </div>
          <div className="flex lg:flex-row items-center flex-col pt-[65px] lg:gap-[150px] gap-[50px]">
            <div className="flex-1">
              <h1 className="lg:text-[2.2rem] lg:text-left text-center mb-[50px] text-[2rem] pr-7">
                Our Promise
              </h1>
              <p className="lg:text-[18px] lg:text-left text-center text-[16px] mt-4 lg:pr-7">
                We promise simple, secure EV charging for all communities, with
                a focus on privacy, real-world pilot tests, mindful tech
                adoption, and a blend of AI and Quantum technology.
              </p>
            </div>
            <div className="flex-1">
              <img src="assets/value.gif" className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>
      <section
        className="bg-[#040347] text-white pt-[6.9rem] lg:pb-[50px]"
        id="tokenomics"
      >
        <h1 className="text-4xl font-bold text-center mb-5">Tokenomics</h1>
        <TokenomicsChart />
      </section>
      <section id="roadmap">
        <RoadmapSection />
      </section>
      <section className="bg-[#040347] text-white pt-[30px] pb-[50px]">
        <div className="max-w-[1700px] mx-auto p-5">
          <h1 className="text-4xl font-bold text-center mb-10">
            2025 Outcome Goals
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-20">
            <div className="text-center p-6 bg-[#313a82] rounded-lg">
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p>Offer QSE-charging in 15+ regions</p>
            </div>
            <div className="text-center p-6 bg-[#313a82] rounded-lg">
              <h3 className="text-xl font-bold mb-3">User Adoption</h3>
              <p>Aim for 500,000 active users</p>
            </div>
            <div className="text-center p-6 bg-[#313a82] rounded-lg">
              <h3 className="text-xl font-bold mb-3">Eco Efforts</h3>
              <p>Handle around 1 million daily transactions without lag</p>
            </div>
            <div className="text-center p-6 bg-[#313a82] rounded-lg">
              <h3 className="text-xl font-bold mb-3">Scalability</h3>
              <p>Have at least 30% of stations using renewables</p>
            </div>
          </div>

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
