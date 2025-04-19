// app/components/Header.tsx

/* eslint-disable @next/next/no-html-link-for-pages */
// app/components/Header.tsx

// app/components/Header.tsx

"use client";

import React, { useState, useEffect } from "react";
import TokenPurchaseModal from "./TokenPurchaseModal";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLAnchorElement;
    if (target.getAttribute("href")?.startsWith("#")) {
      closeMobileMenu();
    }
  };

  const openPurchaseModal = () => {
    closeMobileMenu();
    setShowPurchaseModal(true);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#core-values", label: "Core Values" },
    { href: "#token-info", label: "Token Info" },
    { href: "#road-maps", label: "Roadmap" },
    { href: "#whitepaper", label: "Whitepaper" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#1a4da0] shadow-md" : "bg-[#2057B0]"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <div className="w-8 h-8">
                <div className="spin"></div>
              </div>
              <span className="ml-3 text-white text-xl md:text-2xl font-semibold tracking-wide">
                QuantumSEC
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white font-medium text-sm lg:text-base hover:text-blue-100 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Buy Token Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={openPurchaseModal}
              className="px-4 py-2 bg-[#0095FF] text-white font-medium rounded-md hover:bg-blue-500 transition-colors duration-200 flex items-center"
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

          {/* Mobile Menu Controls */}
          <div className="flex items-center md:hidden">
            <button
              onClick={openPurchaseModal}
              className="mr-4 px-3 py-1 bg-[#0095FF] text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors duration-200"
            >
              Buy
            </button>

            <button
              className="text-white p-1 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bg-gradient-to-b from-[#1a4da0] to-[#104090] transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleNavLinkClick}
              className="block py-3 px-2 text-white border-b border-blue-400/20 hover:bg-blue-600/30 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 mb-2 px-2">
            <button
              onClick={openPurchaseModal}
              className="w-full py-3 bg-[#0095FF] text-white font-medium rounded-md hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center"
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
        </nav>
      </div>

      {/* Token Purchase Modal */}
      {showPurchaseModal && (
        <TokenPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
