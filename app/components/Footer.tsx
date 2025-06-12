/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const handleDownload = (fileUrl: string, fileName: string) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName); // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhitepaperView = () => {
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

  const handleTokenTheoryView = () => {
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

  const handleTokenomicsView = () => {
    const pdfPath = `${window.location.origin}/assets/tokenomics/Tokenomics for QSE.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Tokenomics</title>
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

  const handlePurchaseGuideView = () => {
    const pdfPath = `${window.location.origin}/assets/purchase-guide/QSETokenPurchaseGuide.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token Purchase Guide</title>
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

  const handleUseCaseView = () => {
    const pdfPath = `${window.location.origin}/assets/whitepaper/QSE_TokenEVCI_Use_Case.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token EVCI Use Case</title>
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

  const handleAuditView = () => {
    const pdfPath = `${window.location.origin}/assets/audit/SmartContract_Audit_Solidproof_QuantumSec.ai_5.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token Audit Report</title>
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
                  href="#ecosystem"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Ecosystem
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
                <button
                  onClick={handleWhitepaperView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Whitepaper
                </button>
              </li>
              <li>
                <button
                  onClick={handleTokenTheoryView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Token Theory
                </button>
              </li>
              <li>
                <button
                  onClick={handlePurchaseGuideView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  The Purchase Guide
                </button>
              </li>
              <li>
                <button
                  onClick={handleTokenomicsView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Tokenomics
                </button>
              </li>
              <li>
                <button
                  onClick={handleUseCaseView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Use Case
                </button>
              </li>
              <li>
                <button
                  onClick={handleAuditView}
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Audit Report
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-blue-700">Legal</h3>
            <ul className="space-y-3">
              {/* <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-[#952dc0] transition"
                >
                  Terms of Service
                </a>
              </li> */}
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

          {/* Downloads Column */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Documents
            </h3>
            <div className="space-y-3">
              <button
                onClick={() =>
                  handleDownload(
                    "/assets/whitepaper/QSETokenWhitePaper.pdf",
                    "QSETokenWhitePaper.pdf"
                  )
                }
                className="text-white bg-blue-700 hover:bg-blue-500 rounded-full px-6 py-2 w-full transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Whitepaper
              </button>

              <button
                onClick={() =>
                  handleDownload(
                    "/assets/token-theory/HCISS - QSE Token Theory.pdf",
                    "HCISS - QSE Token Theory.pdf"
                  )
                }
                className="text-white border border-blue-700 rounded-full px-6 py-2 w-full hover:bg-blue-700 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QSE Token Theory
              </button>

              <button
                onClick={() =>
                  handleDownload(
                    "/assets/purchase-guide/QSETokenPurchaseGuide.pdf",
                    "QSETokenPurchaseGuide.pdf"
                  )
                }
                className="text-white border border-blue-700 rounded-full px-6 py-2 w-full hover:bg-blue-700 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download The Purchase Guide
              </button>

              <button
                onClick={() =>
                  handleDownload(
                    "/assets/audit/SmartContract_Audit_Solidproof_QuantumSec.ai_5.pdf",
                    "SmartContract_Audit_Solidproof_QuantumSec.ai_5.pdf"
                  )
                }
                className="text-white border border-blue-700 rounded-full px-6 py-2 w-full hover:bg-blue-700 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Audit Report
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Section - Moved below the main content and above copyright */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-6 text-blue-700">
            Connect With Us
          </h3>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.facebook.com/Health-Blockchain-Security-Services-HCISS-LLC-756609304405798/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <Facebook className="text-blue-500 hover:text-blue-400 w-5 h-5" />
              </div>
            </a>
            <a
              href="https://x.com/hciss_qse"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-500 hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/company/health-blockchain-security-services-hciss/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <Linkedin className="text-blue-500 hover:text-blue-400 w-5 h-5" />
              </div>
            </a>
            <a
              href="https://www.instagram.com/hciss_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <Instagram className="text-blue-500 hover:text-blue-400 w-5 h-5" />
              </div>
            </a>
            <a
              href="https://t.me/hciss_llc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-500 hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
            </a>
            <a
              href="https://discord.gg/QS74yWsqQ5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-blue-500 hover:border-blue-400 hover:bg-blue-500/10 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-500 hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#2a305e] text-center text-gray-500 text-sm">
          &copy; 2025 QuantumSEC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
