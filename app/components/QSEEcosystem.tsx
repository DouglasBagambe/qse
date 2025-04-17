import React from "react";

const QSEEcosystem = () => {
  return (
    <div
      className="bg-blue-100 py-16 px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(219, 234, 254, 0.95), rgba(191, 219, 254, 0.95)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')",
        backgroundSize: "auto",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <button className="bg-white text-gray-700 px-4 py-1 rounded-full text-sm mb-6">
            Learn more
          </button>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Dive into the QSE Ecosystem
          </h2>
          <p className="text-gray-600">Exploring the AI Solution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First card - Secure Mobile Application */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Secure Mobile Application
            </h3>
            <p className="text-gray-600 mb-4">
              Simple, privacy-centered payments that make sense to everyday EV
              owners. Pay with QSE tokens or credit/debit cards with minimal
              data collection.
            </p>
            <div className="flex justify-start">
              <a
                href="#"
                className="inline-flex items-center text-blue-600 font-medium text-sm"
              >
                Learn more
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
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Second card - End-to-End Encryption */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              End-to-End Encryption
            </h3>
            <p className="text-gray-600 mb-4">
              Advanced encryption protocols ensure your transactions and data
              remain secure throughout the entire charging process.
            </p>
            <div className="flex justify-start">
              <a
                href="#"
                className="inline-flex items-center text-blue-600 font-medium text-sm"
              >
                Learn more
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
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Third card - Real-Time Monitoring */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Real-Time Monitoring
            </h3>
            <p className="text-gray-600 mb-4">
              Advanced threat detection and real-time anomaly monitoring ensure
              your charging sessions remain secure and efficient.
            </p>
            <div className="flex justify-start">
              <a
                href="#"
                className="inline-flex items-center text-blue-600 font-medium text-sm"
              >
                Learn more
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
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Fourth card - Compliance Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-left">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Compliance Management
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive compliance management system ensuring adherence to
              regulatory requirements while maintaining user privacy.
            </p>
            <div className="flex justify-start">
              <a
                href="#"
                className="inline-flex items-center text-blue-600 font-medium text-sm"
              >
                Learn more
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
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QSEEcosystem;
