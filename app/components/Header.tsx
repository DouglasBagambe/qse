/* eslint-disable @next/next/no-html-link-for-pages */
// app/components/Header.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import TokenPurchaseModal from "./TokenPurchaseModal";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicking outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    closeMobileMenu();
  };

  const openPurchaseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 mb-8 ${
          scrolled
            ? "bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg py-2"
            : "bg-gradient-to-r from-blue-800 to-blue-700 py-3"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center group">
                <div className="w-10 h-10 relative -mt-4 mr-2">
                  <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8">
                      <div className="spin"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-3 text-white text-xl md:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                  QuantumSEC
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-white font-medium text-sm lg:text-base transition-all duration-300
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 
                  after:bg-blue-300 after:transition-all after:duration-300
                  hover:text-blue-200 hover:after:w-full ${index === 0 ? "text-blue-200 after:w-full" : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Buy Token Button - Desktop */}
            <div className="hidden md:block">
              <button
                onClick={openPurchaseModal}
                className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <div className="relative flex items-center">
                  <span>Buy Token</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
                </div>
              </button>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex items-center md:hidden">
              <button
                onClick={openPurchaseModal}
                className="mr-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all duration-200"
              >
                Buy
              </button>

              <button
                ref={menuButtonRef}
                className="text-white p-2 rounded-md bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
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

        {/* Mobile Navigation Menu - Epic Design */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden fixed right-0 top-16 w-3/4 max-h-[50vh] overflow-y-auto 
                  bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 
                  backdrop-blur-lg rounded-bl-2xl shadow-2xl 
                  border-l border-t-0 border-blue-600/30
                  transition-all duration-300 ease-in-out transform origin-top-right
                  ${mobileMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
        >
          <div className="absolute inset-0 bg-blue-500/5 bg-opacity-10 backdrop-filter backdrop-blur-sm"></div>
          <nav className="relative z-10">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavLinkClick}
                className={`block py-4 px-6 text-white border-b border-blue-700/50 
                        hover:bg-blue-700/30 transition-all duration-200 font-medium
                        flex items-center ${index === 0 ? "text-blue-300" : ""}`}
              >
                <span className="relative overflow-hidden group">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-auto text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            ))}
            <div className="mt-6 mb-4 px-4">
              <button
                onClick={openPurchaseModal}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">
                  Buy Token
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:scale-110 transition-transform duration-300"
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
      <div className="pt-20 md:pt-24"></div>
    </>
  );
};

export default Header;
