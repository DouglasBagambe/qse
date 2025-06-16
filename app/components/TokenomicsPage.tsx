/* eslint-disable @typescript-eslint/no-unused-vars */
// TokenomicsPage.tsx

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
  X,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const TokenomicsPage = () => {
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
      id: "01",
      title: "TOKEN SUPPLY",
      icon: <Shield className="h-8 w-8" />,
      content:
        "<strong>Tokenomics for $QSE</strong><br/> Total Token Supply: 1,000,000,000 QSE<br/><br/> <strong>Allocation</strong><br/> Initial Distribution at Token Generation Event (TGE)<br/> Approximately 100,000,000 QSE (10% of Total Supply) will be released immediately at TGE.<br/> - 5% allocated to early contributors and private sale participants<br/> - 3% for liquidity provisioning (DEX/CEX listing pools)<br/> - 2% for marketing and community incentives<br/><br/> <strong>Vesting Schedule for Investments Wallet (Locked 1 Year):</strong><br/> Private Sale:<br/> - 10% unlocked at TGE (Token Generation Event)<br/> - Remaining 90% vested linearly over 12 months<br/><br/> <strong>Vesting Schedule for Team (Locked 2 Years):</strong><br/> • Team & Founders:<br/> - Locked for 24 months, then fully released<br/> • Advisors:<br/> - 12-month lock-up, then 6-month linear release",
    },
    {
      id: "02",
      title: "QSE MONTHLY UNLOCK SCHEDULE",
      icon: <Lock className="h-8 w-8" />,
      content:
        "<strong>Release schedule over next 17 month (Total: 345 million QSE).</strong><br/> Monthly Releases (2 – 18)<br/> - 7M QSE private sell releases per month<br/> - 20M QSE releases per month enabling liquidity stabilization and cross-platform growth.<br/><br/> <strong>$QSE Wallet Distribution:</strong><br/> - Cybersecurity Utility Fund: 350M QSE<br/> - Market Making (Partnerships & Integration): 100M QSE<br/> - Marketing Wallet: 100M QSE<br/> - Investment Fund Period (unlocked at 13 months): 150M QSE<br/><br/> <strong>$QSE Months 19-24 Releases</strong><br/> Monthly Releases (Months 19-24):<br/> - 515M QSE in total<br/> - Wallet Distribution:<br/> - Cybersecurity Utility Fund: 315M QSE (52M QSE per month)<br/> - Marketing (Partnerships & Integrations): 100M QSE (16M QSE per month)<br/><br/> <strong>$QSE Month 25 and Beyond - Team Release</strong><br/> - 100 million QSE released for the team",
    },
    {
      id: "03",
      title: "QSE UTILITY TOKEN",
      icon: <Zap className="h-8 w-8" />,
      content:
        "- The utility of QSE Tokens supports the operational functionality of the QSE Ecosystem—such as powering AI Security Agent Bots, identity validation tools, and zero-trust data protection services.<br/><br/> - Market making QSE tokens enhances liquidity and supports integration with key infrastructure partners and exchanges (CEX/DEX). Also incentivizes validator onboarding and service interoperability.<br/><br/> - Marketing QSE tokens drive awareness, adoption, and community growth across enterprises, clean energy, supply chain, logistics, finance and nonprofit sectors.<br/><br/> - Governance & Safeguards of QSE tokens promote transparency and long-term alignment with the project, many token ecosystems apply the following best practices after team tokens are released.<br/><br/> - Investment Fund of QSE tokens ensures capital reserve for long-term sustainability, strategic acquisitions, and enterprise deployment initiatives.",
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut" as const,
      },
    },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const sidebarVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        ease: "easeInOut" as const,
        duration: 0.3,
      },
    },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
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
              QSE Token Theory
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

export default TokenomicsPage;
