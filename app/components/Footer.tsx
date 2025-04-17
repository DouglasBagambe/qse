/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";

const Footer = () => {
  const handleDownload = () => {
    const fileUrl = "/assets/whitepaper/QSE_TokenEVCI_Use Case.pdf";

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "QSE_TokenEVCI_Use Case.pdf"); // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-[#10152b] py-16 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description Column */}
          <div>
            <div className="flex items-center mb-8">
              <a href="#" className="flex items-center">
                <div className="w-8 h-8">
                  <div className="spin"></div>
                </div>
                <span className="ml-6 text-xl font-medium">Quantum-SEC</span>
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Revolutionizing utility payments through blockchain technology,
              starting with EV charging infrastructure.
            </p>
            <a
              href="#top"
              className="text-[#0095FF] flex items-center hover:underline"
            >
              Back to top
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </a>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#tokenomics"
                  className="text-gray-400 hover:text-white transition"
                >
                  Tokenomics
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="text-gray-400 hover:text-white transition"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-gray-400 hover:text-white transition"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-white transition"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#whitepaper"
                  className="text-gray-400 hover:text-white transition"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  href="#smart-contract"
                  className="text-gray-400 hover:text-white transition"
                >
                  Smart Contract
                </a>
              </li>
              <li>
                <a
                  href="#token-audit"
                  className="text-gray-400 hover:text-white transition"
                >
                  Token Audit
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-400 hover:text-white transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#press-kit"
                  className="text-gray-400 hover:text-white transition"
                >
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#cookie"
                  className="text-gray-400 hover:text-white transition"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#disclaimer"
                  className="text-gray-400 hover:text-white transition"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; 2025 Quantum-SEC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
