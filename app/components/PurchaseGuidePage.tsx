/* eslint-disable @typescript-eslint/no-unused-vars */
// PurchaseGuidePage.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Lock,
  Shield,
  Zap,
  Globe,
  Cpu,
  BarChart3,
  Wallet,
  CreditCard,
  AlertCircle,
  HelpCircle,
  X,
  Menu,
  Eye,
  CheckCircle,
  DollarSign,
  Import,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PurchaseGuidePage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const sections = [
    {
      id: "00",
      title: "Introduction to QSE Token Purchase",
      icon: <Shield className="h-8 w-8" />,
      content:
        "Welcome to the QuantumSEC (QSE) Token purchase guide! Whether you're new to cryptocurrency or an experienced investor, this guide will help you successfully buy QSE Tokens with ease.<br/><br/>QSE Tokens power the QuantumSEC ecosystem, combining quantum-resistant cryptography with AI for next-generation blockchain security. Purchasing these tokens gives you access to our innovative platform and its growing applications.<br/><br/><strong>What you'll learn in this guide:</strong><br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Setting up a secure cryptocurrency wallet</li><li>Adding funds to purchase tokens</li><li>Connecting to the QuantumSEC platform</li><li>Purchasing and verifying your QSE Tokens</li></ul><br/>",
    },
    {
      id: "01",
      title: "Setting Up Your Wallet",
      icon: <Wallet className="h-8 w-8" />,
      content:
        "To purchase QSE Tokens, you'll need a cryptocurrency wallet. We recommend <strong>MetaMask</strong> for its security, ease of use, and seamless integration with our platform.<br/><br/><strong>Option 1: Set up MetaMask (Recommended)</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Visit the <a href='https://metamask.io/download/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>MetaMask Download Page</a> and install for your browser or mobile device.</li><li>Create a new wallet by following the on-screen instructions.</li><li>IMPORTANT: Securely record your 12-word Secret Recovery Phrase and never share it with anyone, including QuantumSEC support.</li></ol><br/><strong>Option 2: Alternative Wallets</strong><br/>While MetaMask is our recommended wallet, you can also use:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><a href='https://trustwallet.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Trust Wallet</a> - Mobile-friendly with an intuitive interface</li><li><a href='https://www.coinbase.com/wallet' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Coinbase Wallet</a> - Easy integration with Coinbase exchange</li><li>Any wallet that supports Ethereum-based tokens</li></ul><br/>For detailed wallet setup instructions, check the official documentation for your chosen wallet.<br/><br/><strong>Need help?</strong> For a comprehensive MetaMask setup guide, visit the <a href='https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>official MetaMask documentation</a>.",
    },
    {
      id: "02",
      title: "Adding Funds to Your Wallet",
      icon: <DollarSign className="h-8 w-8" />,
      content: `To purchase QSE Tokens, you'll need Ethereum (ETH) in your wallet. Here's how to add funds:<br/><br/><strong>Step 1: Purchase ETH</strong><br/>You can buy ETH from cryptocurrency exchanges like:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><a href='https://www.coinbase.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Coinbase</a> - User-friendly for beginners</li><li><a href='https://www.binance.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Binance</a> - Offers competitive fees</li><li><a href='https://www.kraken.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Kraken</a> - Secure and reliable</li></ul><br/><strong>Step 2: Transfer ETH to Your Wallet</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Copy your wallet address from MetaMask (the long string starting with "0x...").</li><li>In your exchange account, select Withdraw or Send ETH.</li><li>Paste your wallet address and specify the amount to send.</li><li>Confirm the transaction and wait for it to complete (typically 5-15 minutes).</li></ol><br/><img src='/assets/purchase-guide/copywalletaddressmetamask.png' alt='Copying address from MetaMask and pasting into exchange' className='w-full rounded-lg shadow-md my-4' />`,
    },
    {
      id: "03",
      title: "Connecting to the QuantumSEC Platform",
      icon: <Globe className="h-8 w-8" />,
      content:
        "Now that your wallet is set up and funded, let's connect to the QuantumSEC platform to purchase QSE Tokens.<br/><br/><strong>Step 1: Visit the QuantumSEC Website</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Go to the QuantumSEC website.</li><li>Navigate to the \"Buy QSE\" section.</li></ol><br/><img src='/assets/purchase-guide/buyqsebutton.jpg' alt='QuantumSEC homepage with Buy QSE button highlighted' className='w-full rounded-lg shadow-md my-4' /><br/><br/><strong>Step 2: Connect Your Wallet</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Click the \"Connect Wallet\" button.</li><li>Select MetaMask (or your chosen wallet) from the options.</li><li>Approve the connection request in your wallet's popup.</li><li>You'll see your wallet address appear on the site, confirming a successful connection.</li></ol><br/><img src='/assets/purchase-guide/connectwalletwithmetamaskpopup.jpg' alt='Wallet connection modal with MetaMask option highlighted' className='w-full rounded-lg shadow-md my-4' /><br/><br/><strong>Important:</strong> Always verify you're on the official QuantumSEC website before connecting your wallet.",
    },
    {
      id: "04",
      title: "Purchasing QSE Tokens",
      icon: <CreditCard className="h-8 w-8" />,
      content:
        "Now for the exciting part - purchasing your QSE Tokens!<br/><br/><strong>Step 1: Enter Purchase Amount</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>In the token purchase interface, you can enter either:</li><li>The amount of ETH you want to spend, or</li><li>The number of QSE Tokens you want to buy.</li><li>The system will automatically calculate the equivalent value.</li></ol><br/><strong>Step 2: Review and Confirm</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Review your purchase details, including:</li><li>Number of QSE Tokens</li><li>ETH amount</li><li>Network fee (gas fee)</li><li>Click the \"Buy QSE Tokens\" button.</li></ol><br/><img src='/assets/purchase-guide/buytokensinterface.png' alt='Token purchase interface' className='w-full rounded-lg shadow-md my-4' /><br/><br/><strong>Step 3: Approve the Transaction</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Your wallet will prompt you to approve the transaction.</li><li>Verify the transaction details, especially the recipient address.</li><li>Confirm the transaction in your wallet.</li></ol>",
    },
    {
      id: "05",
      title: "Verifying Your Purchase",
      icon: <Eye className="h-8 w-8" />,
      content:
        "After purchasing QSE Tokens, it's important to verify your tokens are in your wallet.<br/><br/><strong>Step 1: Check Transaction Status</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>The QuantumSEC platform will display a \"Purchase Successful!\" message once the transaction is confirmed.</li><li>You can check the transaction details by clicking on the transaction hash link.</li></ol><br/><strong>Step 2: Add QSE Token to Your Wallet</strong><br/>For MetaMask:<br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Open MetaMask and click \"Import Tokens\" at the bottom of the Assets tab.</li><li>Select \"Custom Token\" and enter:</li><li>- Token Contract Address: <span className='font-semibold'>[Token Contract Address]</span></li><li>- Token Symbol: QSE</li><li>- Decimals of Precision: 18</li><li>Click \"Add Custom Token\" then \"Import Tokens\".</li></ol><br/><img src='/assets/purchase-guide/importtoken.jpg_large' alt='MetaMask Import Token screen with QSE details' className='w-full rounded-lg shadow-md my-4' /><br/><br/><strong>Step 3: View Your QSE Balance</strong><br/><ol className='list-decimal pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Your QSE Tokens will now appear in your wallet's asset list.</li><li>The balance should reflect the number of tokens you purchased.</li></ol>",
    },
    {
      id: "06",
      title: "Troubleshooting & FAQ",
      icon: <HelpCircle className="h-8 w-8" />,
      content:
        "<strong>Common Issues & Solutions</strong><br/><br/><div className='bg-blue-50 p-4 rounded-lg mb-4'><strong className='text-blue-700'>Transaction Pending Too Long</strong><br/>If your transaction is pending for more than 15 minutes:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Check the network status for congestion.</li><li>Consider speeding up the transaction by increasing gas fees through your wallet.</li></ul></div><br/><div className='bg-blue-50 p-4 rounded-lg mb-4'><strong className='text-blue-700'>Wallet Connection Issues</strong><br/>If you're having trouble connecting your wallet:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Refresh the page and try again.</li><li>Ensure your wallet is unlocked.</li><li>Clear your browser cache and restart your browser.</li></ul></div><br/><div className='bg-blue-50 p-4 rounded-lg mb-4'><strong className='text-blue-700'>QSE Tokens Not Visible</strong><br/>If you don't see your tokens after a successful purchase:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Double-check you've added the correct token contract address.</li><li>Ensure you're viewing the correct network in your wallet.</li></ul></div><br/><strong>Frequently Asked Questions</strong><br/><br/><strong>Q: Is my purchase secure?</strong><br/>A: Yes, all transactions occur directly on the blockchain. Always verify you're on the official QuantumSEC website before connecting your wallet.",
    },
    {
      id: "07",
      title: "Contact & Support",
      icon: <CheckCircle className="h-8 w-8" />,
      content:
        "Congratulations on purchasing QSE Tokens! If you need any assistance, our support team is here to help.<br/><br/><strong>Need Help?</strong><br/>Contact us through any of these channels:<br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><strong>Email:</strong> <a href='mailto:support@quantumsec.com' className='text-blue-600 hover:underline'>support@quantumsec.com</a></li><li><strong>Website:</strong> Use the live chat on our website</li></ul><br/><div className='bg-green-50 p-6 rounded-lg mb-4'><strong className='text-green-700 text-lg'>Welcome to the QuantumSEC Ecosystem!</strong><br/><p className='mt-2'>By holding QSE Tokens, you're now part of a revolutionary platform that's shaping the future of blockchain security. Stay updated on project developments and token utilities through our website and social channels.</p></div><br/><strong>Safety Tips</strong><br/><ul className='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Never share your wallet's recovery phrase or private keys with anyone.</li><li>Always verify you're on the official QuantumSEC website before connecting your wallet.</li><li>Be wary of scammers impersonating QuantumSEC team members on social media or chat platforms.</li></ul>",
    },
  ];

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : prev));
  };

  const router = useRouter();

  const goToHome = () => {
    if (typeof window !== "undefined") {
      router.push("/");
    }
  };

  const goToSection = (index: React.SetStateAction<number>) => {
    setCurrentSection(index);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Navigation Bar for Mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm lg:hidden mt-20">
        <div className="flex items-center justify-between py-3 px-4">
          <motion.button
            onClick={toggleSidebar}
            className="text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </motion.button>

          <div className="flex-1 px-2">
            <h1 className="text-blue-600 font-bold font-lato text-sm truncate">
              QSE Purchase Guide
            </h1>
          </div>

          {/* <motion.button
            onClick={goToHome}
            className="text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to home page"
          >
            <Home size={24} />
          </motion.button> */}
        </div>
      </div>

      {/* Home Button (Desktop only) */}
      {/* <motion.div
        className="fixed top-6 right-6 z-50 hidden lg:block"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={goToHome}
          className="bg-white text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Go to home page"
        >
          <Home
            size={24}
            className="group-hover:text-blue-800 transition-colors"
          />
        </button>
      </motion.div> */}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-14 lg:pt-0">
        {/* Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="sidebar-overlay"
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              ref={sidebarRef}
              className="fixed lg:sticky top-0 left-0 h-full w-3/4 lg:w-1/4 z-40 lg:z-0 bg-white lg:bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden mt-20"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-8 h-full overflow-y-auto">
                {/* Close button for mobile */}
                <motion.button
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-800 p-1 bg-gray-100 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
                <h2 className="text-lg font-bold mb-6 text-gray-600 font-lato">
                  Content
                </h2>
                <ul className="space-y-2">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <button
                        onClick={() => goToSection(index)}
                        className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-300 flex items-center ${
                          index === currentSection
                            ? "bg-blue-50 text-blue-500 border-l-4 border-blue-500"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-lato text-sm font-bold">
                          {section.id}. {section.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 p-6 lg:p-16 sm:mb-12">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {sections.length > 0 && (
                  <>
                    {/* Header Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        {sections[currentSection].icon}
                        <h1 className="text-lg font-bold text-blue-500 font-lato ml-2">
                          {sections[currentSection].id}{" "}
                          <span className="text-4xl px-8">
                            {sections[currentSection].title}
                          </span>
                        </h1>
                      </div>
                      <div
                        className="prose text-gray-900 font-inter"
                        dangerouslySetInnerHTML={{
                          __html: sections[currentSection].content,
                        }}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
                      {currentSection > 0 && (
                        <motion.button
                          onClick={goToPrevious}
                          className="flex-1 min-h-[100px] border border-blue-500 bg-white rounded-xl p-4 text-left hover:bg-gray-50 transition-all flex items-start"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ChevronLeft className="text-blue-500 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-blue-600 font-lato font-bold text-sm block">
                              Previous - {sections[currentSection - 1].id}
                            </span>
                            <h3 className="text-lg font-medium font-poppins text-gray-900 mt-1 break-words">
                              {sections[currentSection - 1].title}
                            </h3>
                          </div>
                        </motion.button>
                      )}

                      {currentSection < sections.length - 1 && (
                        <motion.button
                          onClick={goToNext}
                          className="flex-1 min-h-[100px] border border-blue-500 bg-white rounded-xl p-4 text-left hover:bg-gray-50 transition-all flex items-start justify-between"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-blue-600 font-lato font-bold text-sm block">
                              Next - {sections[currentSection + 1].id}
                            </span>
                            <h3 className="text-lg font-medium font-poppins text-gray-900 mt-1 break-words">
                              {sections[currentSection + 1].title}
                            </h3>
                          </div>
                          <ChevronRight className="text-blue-500 h-5 w-5 ml-2 mt-1 flex-shrink-0" />
                        </motion.button>
                      )}
                    </div>

                    {/* Back to Home Button */}
                    <motion.button
                      onClick={goToHome}
                      className="mt-6 w-full border border-blue-500 bg-white rounded-xl p-4 text-center sm:text-right hover:bg-gray-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center sm:justify-end">
                        <h3 className="text-xl font-poppins text-blue-500">
                          Back to Home
                        </h3>
                      </div>
                    </motion.button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
        .font-lato {
          font-family: "Lato", sans-serif;
        }
        .font-inter {
          font-family: "Inter", sans-serif;
        }
        .prose {
          font-size: 18px;
          line-height: 140%;
          letter-spacing: -0.01em;
        }
        .prose strong {
          color: #111827;
          font-weight: 600;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        h2.text-5xl {
          font-size: 44px;
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 120%;
        }
        @media (max-width: 1024px) {
          .prose {
            font-size: 16px;
          }
          h2.text-3xl {
            font-size: 24px;
            line-height: 130%;
          }
        }
        body {
          overscroll-behavior: none;
        }
        body.sidebar-open {
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default PurchaseGuidePage;
