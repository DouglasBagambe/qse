import React from "react";
import { FileText, Lightbulb, PieChart, Navigation } from "lucide-react";

const QSEEcosystem = () => {
  // Function to handle PDF viewing
  const handleWhitepaperPDFView = () => {
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
  const handleTokenTheoryPDFView = () => {
    const pdfPath = `${window.location.origin}/assets/token-theory/HCISS - QSE Token Theory.pdf`;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>QSE Token Theory</title>
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

  // Function to scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(30, 64, 175, 0.92), rgba(37, 99, 235, 0.9)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMCAyNSBMIDEwMCAyNSBNIDI1IDAgTCAyNSAxMDAgTSAwIDUwIEwgMTAwIDUwIE0gNTAgMCBMIDUwIDEwMCBNIDAgNzUgTCAxMDAgNzUgTSA3NSAwIEwgNzUgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSkiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSI+PC9yZWN0Pjwvc3ZnPg==')",
        backgroundSize: "75px 75px",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm px-6 py-2 rounded-full text-white text-sm font-medium mb-8 shadow-lg border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-300">
            Quantum Security For Everyone
          </div>
          <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">
            Dive into the QSE Ecosystem
          </h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Exploring the next generation of quantum-resistant security and
            AI-driven solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Whitepaper Card */}
          <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-xl text-left transform transition-all duration-300 hover:translate-y-(-1) border border-blue-100 group hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-lg mr-4 text-white group-hover:bg-blue-700 transition-colors duration-300">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Whitepaper</h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              Our comprehensive whitepaper outlines how QSE token transforms EV
              charging with blockchain security, AI-enabled solutions, and
              quantum-resistant cryptography—all designed with user privacy at
              its core.
            </p>
            <div className="flex justify-start">
              <button
                onClick={handleWhitepaperPDFView}
                className="group inline-flex items-center text-blue-600 font-medium text-lg bg-blue-50 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Token Theory Card */}
          <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-xl text-left transform transition-all duration-300 hover:translate-y-(-1) border border-blue-100 group hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-lg mr-4 text-white group-hover:bg-blue-700 transition-colors duration-300">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Token Theory</h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              The QuantumSEC Token represents a paradigm shift in digital trust
              and governance, built on three core principles: Security,
              Intelligence, and Trust—with AI Security Agents providing 24/7
              protection against emerging threats.
            </p>
            <div className="flex justify-start">
              <button
                onClick={handleTokenTheoryPDFView}
                className="group inline-flex items-center text-blue-600 font-medium text-lg bg-blue-50 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tokenomics Card */}
          <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-xl text-left transform transition-all duration-300 hover:translate-y-(-1) border border-blue-100 group hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-lg mr-4 text-white group-hover:bg-blue-700 transition-colors duration-300">
                <PieChart size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Tokenomics</h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              QSE features a total supply of 1 billion tokens with strategic
              allocation: 40% for development, 20% for community incentives, 20%
              for R&D, 15% for partnerships, and 5% reserve—with a 2% monthly
              burn rate from transaction fees.
            </p>
            <div className="flex justify-start">
              <button
                onClick={() => scrollToSection("tokenomics")}
                className="group inline-flex items-center text-blue-600 font-medium text-lg bg-blue-50 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Roadmap Card */}
          <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-95 p-8 rounded-2xl shadow-xl text-left transform transition-all duration-300 hover:translate-y-(-1) border border-blue-100 group hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-lg mr-4 text-white group-hover:bg-blue-700 transition-colors duration-300">
                <Navigation size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Roadmap</h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              Our 2025 roadmap outlines a methodical approach: Q1 foundation
              building and pilot launch, Q2 careful expansion, Q3 security
              enhancements with AI and quantum testing, and Q4 wider adoption
              with full-scale deployment.
            </p>
            <div className="flex justify-start">
              <button
                onClick={() => scrollToSection("roadmap")}
                className="group inline-flex items-center text-blue-600 font-medium text-lg bg-blue-50 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="opacity-20"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default QSEEcosystem;
