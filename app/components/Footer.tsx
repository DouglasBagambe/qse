"use client";

import React from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
  Linkedin,
  Download,
} from "lucide-react";

const Footer = () => {
  const handleDownloadWhitepaper = () => {
    const fileUrl = "/assets/whitepaper/QSE_TokenEVCI_Use Case.pdf";

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "QSE_TokenEVCI_Use Case.pdf"); // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTokenTheory = () => {
    const fileUrl = "/assets/token-theory/HCISS - QSE Token Theory.pdf";

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "HCISS - QSE Token Theory.pdf"); // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-gradient-to-b from-[#10152b] to-[#080c1a] py-16 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and Description Column */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-8">
              <a href="#" className="flex items-center">
                <div className="w-8 h-8 -mt-4 mr-2">
                  <div className="spin"></div>
                </div>
                <span className="text-blue-700 ml-3 text-xl font-bold">
                  QuantumSEC
                </span>
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Simplifying digital security with AI, blockchain, and
              cybersecurity, QSE empowers individuals and organizations to adopt
              technology safely and securely.
            </p>
            <a
              href="#top"
              className="text-blue-700 flex items-center hover:underline"
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
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-blue-700">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#tokenomics"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Tokenomics
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-blue-700">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#whitepaper"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  href="#smart-contract"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Smart Contract
                </a>
              </li>
              <li>
                <a
                  href="#token-audit"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Token Audit
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#press-kit"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-blue-700">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#cookie"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#disclaimer"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media and Downloads Column */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-6 text-blue-700">
              Follow Us
            </h3>
            <div className="grid grid-cols-6 gap-2 mb-8">
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <Instagram className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <Twitter className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <Facebook className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <MessageCircle className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <Send className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2">
                <div className="border border-blue-500 hover:bg-white transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                  <Linkedin className="text-blue-500 hover:text-white w-5 h-5" />
                </div>
              </a>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleDownloadWhitepaper}
                className="text-white bg-blue-700 hover:bg-blue-500 rounded-full px-6 py-2 w-full transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Whitepaper
              </button>

              <button
                onClick={handleDownloadTokenTheory}
                className="text-white border border-blue-700 rounded-full px-6 py-2 w-full hover:bg-blue-700 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                QSE Token Theory
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[#2a305e] text-center text-gray-500 text-sm">
          &copy; 2025 QuantumSEC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
