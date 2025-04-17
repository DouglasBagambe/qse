// app/components/Header.tsx

/* eslint-disable @next/next/no-html-link-for-pages */
// app/components/Header.tsx

"use client";

import React, { useState } from "react";
import TokenPurchaseModal from "./TokenPurchaseModal";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const openPurchaseModal = () => {
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
  };

  return (
    <nav className="bg-[#2057B0] px-2 sm:px-4 z-[1000] fixed w-full">
      <div className="container mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <div className="w-8 h-8">
              <div className="spin"></div>
            </div>
            <span className="ml-4 text-white text-2xl font-semibold pl-3 tracking-wide">
              QuantumSEC
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="p-2 text-white rounded-md outline-none focus:border-gray-400 focus:border"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="text-white font-medium hover:text-blue-100 transition"
          >
            Home
          </a>
          <a
            href="#whitepaper"
            className="text-white font-medium hover:text-blue-100 transition"
          >
            Core Values
          </a>
          <a
            href="#token-info"
            className="text-white font-medium hover:text-blue-100 transition"
          >
            Token Info
          </a>
          <a
            href="#road-maps"
            className="text-white font-medium hover:text-blue-100 transition"
          >
            Roadmap
          </a>
          <a
            href="#whitepaper"
            className="text-white font-medium hover:text-blue-100 transition"
          >
            Whitepaper
          </a>
        </div>

        {/* Buy Token Button */}
        <div>
          <button
            onClick={openPurchaseModal}
            className="px-4 py-2 bg-[#0095FF] text-white font-medium rounded-md hover:bg-blue-500 transition flex items-center"
          >
            Buy Token
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-20 left-0 right-0 bg-[#2057B0] md:hidden transition-all duration-300 ease-in ${
            navbar ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-5 space-y-4">
            <a
              href="/"
              className="block text-white hover:text-blue-100 transition"
            >
              Home
            </a>
            <a
              href="#token-info"
              className="block text-white hover:text-blue-100 transition"
            >
              Token Info
            </a>
            <a
              href="#buy-token"
              className="block text-white hover:text-blue-100 transition"
            >
              Buy Token
            </a>
            <a
              href="#token-values"
              className="block text-white hover:text-blue-100 transition"
            >
              Token Values
            </a>
            <a
              href="#road-maps"
              className="block text-white hover:text-blue-100 transition"
            >
              Road Maps
            </a>
            <a
              href="#whitepaper"
              className="block text-white hover:text-blue-100 transition"
            >
              Whitepaper
            </a>
            <a
              href="#safety-guide"
              className="block text-white hover:text-blue-100 transition"
            >
              Safety Guide
            </a>
          </div>
        </div>
      </div>

      {/* Token Purchase Modal */}
      {showPurchaseModal && (
        <TokenPurchaseModal
          isOpen={showPurchaseModal}
          onClose={closePurchaseModal}
        />
      )}
    </nav>
  );
};

export default Header;
