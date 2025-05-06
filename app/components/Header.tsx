// app/components/Header.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import React, { useState, useEffect, useRef } from "react";
import TokenPurchaseModal from "./TokenPurchaseModal";
import { usePathname } from "next/navigation";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname(); // Get current path for active link highlighting
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    if (isClient) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isClient]);

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

    if (isClient) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen, isClient]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openPurchaseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeMobileMenu();
    setShowPurchaseModal(true);
  };

  const handlePDFView = () => {
    if (!isClient) return;

    const pdfPath = `${window.location.origin}/assets/whitepaper/QSETokenWhitePaper.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token Whitepaper</title>
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

  const handleTokenTheoryPDFView = () => {
    if (!isClient) return;

    const pdfPath = `${window.location.origin}/assets/token-theory/HCISS - QSE Token Theory.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token Theory</title>
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

  // Function to navigate to a section on the home page
  const navigateToHomeSection = (sectionId: string) => {
    if (!isClient) return;

    // If we're already on the home page, just scroll to the section
    if (pathname === "/" || pathname === "") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to the home page with the section hash
      window.location.href = `/${sectionId ? "#" + sectionId : ""}`;
    }
  };

  // Updated navigation links with Home added
  const navLinks = [
    {
      id: "home",
      href: "/",
      label: "Home",
      isHome: true,
    },
    {
      id: "whitepaper",
      href: "#",
      label: "Whitepaper",
      isWhitepaper: true,
    },
    {
      id: "tokenomics",
      href: "/tokenomics",
      label: "Tokenomics",
      isTokenomics: true,
    },
    {
      id: "token-theory",
      href: "/token-theory",
      label: "Token Theory",
      isTokenTheory: true,
    },
    // {
    //   id: "ecosystem",
    //   href: "#ecosystem",
    //   label: "Ecosystem",
    //   isSection: true,
    //   sectionId: "ecosystem",
    // },
    // {
    //   id: "roadmap",
    //   href: "#roadmap",
    //   label: "RoadMap",
    //   isRoadmap: true,
    //   sectionId: "roadmap",
    // },
    {
      id: "purchase-guide",
      href: "/purchase-guide",
      label: "Purchase Guide",
      isPurchaseGuide: true,
    },
  ];

  // Enhanced function to determine if a link is active
  const isLinkActive = (link: any): boolean => {
    if (!isClient) return false;

    // For the home page
    if (link.isHome && (pathname === "/" || pathname === "")) {
      // Active if we're on the home page with no hash
      return !window.location.hash;
    }

    // For section links on the home page
    if (link.isSection && pathname === "/" && link.sectionId) {
      return window.location.hash === `#${link.sectionId}`;
    }

    // For the token theory page
    if (link.isTokenTheory && pathname === "/token-theory") {
      return true;
    }

    // For the tokenomics page
    if (link.isTokenomics && pathname === "/tokenomics") {
      return true;
    }

    // For the roadmap section
    if (
      link.isRoadmap &&
      pathname === "/" &&
      window.location.hash === "#roadmap"
    ) {
      return true;
    }

    // For the purchase guide page
    if (link.isPurchaseGuide && pathname === "/purchase-guide") {
      return true;
    }

    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg py-2"
            : "bg-gradient-to-r from-blue-800 to-blue-700 py-3"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className="flex items-center group"
                onClick={(e) => {
                  e.preventDefault();
                  if (isClient) {
                    window.location.href = "/";
                  }
                }}
              >
                <div className="w-10 h-10 relative -mt-4 mr-2">
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

            {/* Desktop Navigation - Enhanced active state styling */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();

                      if (!isClient) return;

                      if (link.isHome) {
                        window.location.href = "/";
                      } else if (link.isWhitepaper) {
                        handlePDFView();
                      } else if (link.isTokenTheory) {
                        window.location.href = "/token-theory";
                      } else if (link.isTokenomics) {
                        window.location.href = "/tokenomics";
                        // } else if (link.isSection && link.sectionId) {
                        //   navigateToHomeSection(link.sectionId);
                        // } else if (link.isRoadmap && link.sectionId) {
                        //   navigateToHomeSection(link.sectionId);
                      } else if (link.isPurchaseGuide) {
                        window.location.href = "/purchase-guide";
                      }
                    }}
                    className={`relative px-4 py-2 text-sm lg:text-base transition-all duration-300 
                      group ${
                        active
                          ? "text-white font-bold"
                          : "text-white font-medium"
                      }`}
                  >
                    <span className="relative inline-block">
                      {link.label}
                      {active && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300"></span>
                      )}
                      {!active && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      )}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Buy $QSE Button - Desktop Only */}
            <div className="hidden md:block">
              <button
                onClick={openPurchaseModal}
                className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <div className="relative flex items-center">
                  <span>Buy $QSE</span>
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

            {/* Mobile Menu Controls - Improved */}
            <div className="md:hidden">
              <button
                ref={menuButtonRef}
                className="text-white p-2 rounded-md bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 flex items-center justify-center"
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

        {/* Redesigned Mobile Navigation Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 
            shadow-2xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-700/50">
              <div className="flex items-center">
                <div className="w-8 h-8 relative -mt-6 mr-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6">
                      <div className="spin"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-white text-lg font-bold tracking-wider">
                  QuantumSEC
                </span>
                {/* <span className="ml-3 text-white text-xl md:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                  QuantumSEC
                </span> */}
              </div>
              <button
                onClick={closeMobileMenu}
                className="text-white p-1 rounded-full hover:bg-blue-700/50 transition-colors"
              >
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
              </button>
            </div>

            {/* Buy $QSE Button in Mobile Menu Top Section */}
            <div className="px-6 py-4 border-b border-blue-700/50">
              <button
                onClick={openPurchaseModal}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center"
              >
                <span className="mr-2">Buy $QSE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

            {/* Mobile Menu Navigation Links */}
            <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();

                      if (!isClient) return;

                      if (link.isHome) {
                        window.location.href = "/";
                      } else if (link.isWhitepaper) {
                        handlePDFView();
                      } else if (link.isTokenTheory) {
                        window.location.href = "/token-theory";
                      } else if (link.isTokenomics) {
                        window.location.href = "/tokenomics";
                        // } else if (link.isSection && link.sectionId) {
                        //   navigateToHomeSection(link.sectionId);
                        // } else if (link.isRoadmap && link.sectionId) {
                        //   navigateToHomeSection(link.sectionId);
                      } else if (link.isPurchaseGuide) {
                        window.location.href = "/purchase-guide";
                      }

                      closeMobileMenu();
                    }}
                    className={`flex items-center justify-between px-6 py-4 border-b border-blue-700/30
                      ${
                        active
                          ? "bg-blue-700/40 border-l-4 border-l-blue-300"
                          : "hover:bg-blue-700/20"
                      }`}
                  >
                    <span
                      className={`${active ? "text-blue-200 font-semibold" : "text-white"}`}
                    >
                      {link.label}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${active ? "text-blue-300" : "text-blue-400"}`}
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
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700/30 bg-blue-900/80 backdrop-blur-sm">
              <div className="text-xs text-blue-300 text-center">
                &copy; {new Date().getFullYear()} QuantumSEC. All rights
                reserved.
              </div>
            </div>
          </div>
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
