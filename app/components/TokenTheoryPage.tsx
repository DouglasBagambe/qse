/* eslint-disable @typescript-eslint/no-unused-vars */
// TokenTheoryPage.tsx

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
import { motion, AnimatePresence } from "framer-motion";

const TokenTheoryPage = () => {
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
      title: "INTRODUCING QSE TOKEN",
      icon: <Shield className="h-8 w-8" />,
      content:
        "In an era defined by quantum threats, digital insecurity, and the ethical challenges of artificial intelligence, the QuantumSEC (QSE) Token emerges as a next-generation cryptographic utility designed to empower AI-native cybersecurity ecosystems. More than a transactional token, QSE represents a paradigm shift in how digital trust, governance, and resilience are structured across industries—particularly in clean energy, critical infrastructure, and decentralized systems.",
    },
    {
      id: "01",
      title: "Core Principles of the QuantumSEC Ecosystem",
      icon: <Lock className="h-8 w-8" />,
      content:
        "<strong>Informed Decision-Making:</strong><br/> Built on three foundational principles that set it apart in the world of digital assets: Security, Intelligence, and Trust—we prioritize making choices based on comprehensive data analysis. By continuously monitoring market trends and utilizing advanced analytics, we ensure that every action taken within the QSE ecosystem is well-informed. This approach minimizes risks and enhances the potential for favorable outcomes, providing confidence to our token holders.<br/><br/> <strong>Smart Risk Management:</strong><br/> HCISS, LLC (BSECAEnergy) knows risk comes from all sides—market shifts, cyber threats, and disruptions. That's why the QSE Token is protected by HCISS AI Security Agents—our always-on, intelligent BSECA.ai Bots. These digital AI guardians monitor threats and irregularities around the clock, adapting in real-time to outsmart hackers—like your personal cybersecurity team, always on watch.",
    },
    {
      id: "02",
      title: "QuantumSEC AI Security Agentic Bots – Transformative Features",
      icon: <Cpu className="h-8 w-8" />,
      content: `
  <strong>Predictive Threat Neutralization:</strong><br/>
  Unlike traditional systems that react to breaches, AI Security Agentic (BSECA.ai) bots anticipate and eliminate risks before they strike. In decentralized finance (DeFi), they prevent flash loan attacks and smart contract exploits. For energy grids, they detect abnormal consumption patterns, stopping fraud or cyber-physical sabotage.<br/><br/>

  <strong>Self-Healing Automation:</strong><br/>
  These bots don't just find problems, they fix them instantly. In logistics, if a GPS tracker is hacked, it's quickly shut off, repaired, and brought back online without delay. For storage, if data is tampered with, it automatically restores itself. No waiting, no downtime—just smart, fast protection.<br/><br/>

  <strong>Regulatory Intelligence:</strong><br/>
  BSECA.ai bots auto-enforce compliance, slashing costs. In DeFi, they validate Know-Your-Customers-Know-Your-Transactions-Anti-Money-Laundering (KYC/KYT/AML) rules across chains. For energy traders, they certify carbon credits and audit transactions against global standards—no manual oversight needed.<br/><br/>

  <strong>Advanced Security Features:</strong><br/>
  HCISS AI Security Agent Bots offer a suite of cutting-edge capabilities that elevate security beyond standard protocols:
  <ul class="list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium">
    <li><span class="font-semibold">Autonomous Threat Intervention:</span> Acts immediately—blocking, isolating, or mitigating risks in real time without human input.</li>
    <li><span class="font-semibold">Behavioral Biometrics for Access Control:</span> Monitors keystrokes, mouse movements, and timing patterns to detect impersonation or insider threats.</li>
    <li><span class="font-semibold">Cross-Chain Threat Intelligence:</span> Aggregates threat data across multiple blockchains to provide a unified, proactive defense strategy.</li>
    <li><span class="font-semibold">Sentiment-Based Attack Prediction:</span> Uses NLP to monitor social media, forums, and dark web chatter to anticipate coordinated attacks or manipulations.</li>
    <li><span class="font-semibold">Quantum-Resilient Cryptography Readiness:</span> Built with future-proof architecture to adapt to quantum-safe encryption standards.</li>
  </ul>
`,
    },

    {
      id: "03",
      title: "(QSE) Token Theory Introduction",
      icon: <Zap className="h-8 w-8" />,
      content:
        "The QuantumSEC (QSE) Token represents a revolutionary leap in digital security, combining quantum-proof encryption, AI-powered threat prevention, and self-securing blockchain technology. Unlike traditional security solutions that merely react to threats, QSE proactively neutralizes risks before they emerge – delivering military-grade protection for financial transactions, sensitive communications, and critical infrastructure in the quantum computing era.",
    },
    {
      id: "04",
      title: "QSE Token as an Investment Vehicle",
      icon: <BarChart3 className="h-8 w-8" />,
      content:
        "<strong>Investment Principles:</strong><br/> HCISS LLC BSECAEnergy strategically designed the QuantumSEC QSE Token to be more than just a digital asset; it's a gateway to a dynamic and prosperous investment ecosystem. With opportunities for passive income, portfolio diversification, and access to emerging financial innovations, QSE offers a comprehensive investment experience tailored for today's forward-thinking investors.<br/><br/> <strong>Dividends and Returns:</strong><br/> QSE Token holders can earn regular dividends simply by holding and staking their tokens. This gives investors a way to earn passive income while supporting the growth of the QuantumSEC ecosystem. As the platform expands and performs well, your returns grow with it—rewarding your commitment with real value over time. It's a smart way to stay invested and earn while the system works for you.",
    },
    {
      id: "05",
      title: "QSE Accessing Liquidity Pools",
      icon: <Globe className="h-8 w-8" />,
      content:
        "<strong>Seamless Access to Liquidity:</strong><br/> By holding QSE Tokens, you can participate in liquidity pools that are carefully managed to ensure ample liquidity for trading activities. This means you can execute trades smoothly and efficiently without the delays often found in less liquid markets.<br/><br/> <strong>Enhanced Trading Experience:</strong><br/> Access to these liquidity pools allows for faster trade execution at competitive prices. This setup minimizes slippage—the difference between expected and actual trade prices assuring you get the most value out of your transactions.<br/><br/> <strong>Passive Income Opportunities:</strong><br/> Beyond trading, participating in liquidity pools enables investors to earn a share of the trading fees generated within the QuantumSEC ecosystem. This offers a potential passive income stream, adding another layer of value to your investment. The QSE Tokens can facilitate efficient trading and provide opportunities for additional earnings through active participation in the platform's liquidity pools.",
    },
    {
      id: "06",
      title: "Staking Mechanism for Dividends",
      icon: <Lock className="h-8 w-8" />,
      content:
        "<strong>Staking Dynamics:</strong><br/> Staking QSE Tokens unlocks dual rewards: earn 5-15% annual yields while helping secure the quantum-resistant network. Your staked tokens power critical operations—like validating transactions and running AI security bots—and in return, you receive regular payouts from ecosystem fees and penalties on bad actors. Staking is simple, with flexible lock-up periods to match your goals. The more the network grows, the more you earn.<br/><br/> <strong>Dividend Distribution:</strong><br/> The QSE Token rewards holders with real-world profits. Each quarter, 10-20% of ecosystem revenue (from fees, licenses, and partnerships) is shared directly with token holders—like a stock dividend. We also use 5% of profits to buy back and permanently remove QSE tokens from circulation, increasing scarcity. It's simple: hold QSE, earn passive income, and benefit as the ecosystem grows.",
    },
    {
      id: "07",
      title:
        "Leveraging QSE Token for Investments in Energy, Clean Technology, and DeFi Products",
      icon: <Zap className="h-8 w-8" />,
      content:
        "<strong>The Rise of Clean Technology:</strong><br/> The clean tech sector is booming, with investments expected to surpass $2 trillion by 2030. HCISS LLC uses the QSE Token to power this growth, offering quantum-secure, AI-driven tools for safer and smarter transactions. From solar trading to EV networks, QSE helps scale clean innovations while making green tech a profitable, future-ready investment.",
    },
    {
      id: "08",
      title: "QSE Token as an Investment Vehicle in DeFi",
      icon: <BarChart3 className="h-8 w-8" />,
      content:
        "<strong>Diversify through DeFi Protocols:</strong><br/> The QSE Token expands its value by integrating with DeFi protocols, allowing investors to earn through staking and liquidity pools. Its quantum-secure tech protects against hacks, making DeFi safer and more attractive. This means a steady income for holders and a stronger, more secure ecosystem for everyone.<br/><br/> <strong>Access to Growing Clean Technology Start-Ups:</strong><br/> The QSE Token empowers clean technology startups with advanced cybersecurity tools designed for the digital energy era. It enables secure asset tokenization, protects IoT systems, and ensures compliance while attracting investors. With AI-powered grid defense and quantum-safe data protection, QSE provides the security backbone that clean technology startups need to thrive in a connected world.",
    },
    {
      id: "09",
      title: "The Future of Investments with QSE Token",
      icon: <Globe className="h-8 w-8" />,
      content:
        "<strong>Innovation and Risk Management:</strong><br/> The QSE Token combines innovation with built-in risk management to give investors a smarter, safer way to grow their wealth. Powered by AI and quantum-resistant security, it actively protects against fraud, cyber threats, and market manipulation. At the same time, QSE opens doors to emerging sectors like DeFi and clean technology. For investors and clients, it's a forward-looking asset designed to secure returns while minimizing risk in a fast-changing digital world.<br/><br/> <strong>Building QuantumSEC Ecosystem:</strong><br/> HCISS LLC – BSECAEnergy is using the QSE Token to build a strong, secure QuantumSEC ecosystem. By investing in cybersecurity, DeFi, and clean technology startups, QSE Token fuels real-world innovation while strengthening the digital economy. Each investment supports long-term growth, creating a trusted network that benefits both investors and the broader community. The result is a sustainable, future-ready ecosystem where security, innovation, and opportunity grow together.",
    },
    {
      id: "10",
      title: "QSE Token Theory Conclusion",
      icon: <Shield className="h-8 w-8" />,
      content:
        "The QuantumSEC (QSE) Token, powered by HCISS LLC – BSECAEnergy, is more than a digital asset—it's a gateway to secure, intelligent investing in a rapidly changing world. Designed for long-term growth and stability, QSE offers investors real value through dividends earned via staking, seamless access to liquidity pools, and direct exposure to high-potential sectors like clean technology, decentralized finance, and AI-driven cybersecurity. Every feature of the QSE Token is purpose-built to meet the needs of modern investors, those seeking both innovation and protection.<br/><br/> By fusing financial opportunity with quantum-secure infrastructure and always-on AI risk management, the QSE Token creates a trusted environment for building wealth. This unique combination sets it apart from conventional tokens and reflects HCISS's vision of reshaping how capital flows in the digital age. Investors don't just hold QSE—they participate in a future-focused ecosystem designed for resilience, impact, and financial growth.<br/><br/> As industries like energy, logistics, and DeFi evolve, the QSE Token stands as a foundation for innovation and security. It's a forward-thinking investment vehicle built to thrive in a digital-first world—inviting investors to be part of a smarter, safer, and more sustainable financial future.",
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
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm lg:hidden">
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

          <motion.button
            onClick={goToHome}
            className="text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to home page"
          >
            <Home size={24} />
          </motion.button>
        </div>
      </div>

      {/* Home Button (Desktop only) */}
      <motion.div
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
      </motion.div>

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
              className="fixed lg:sticky top-0 left-0 h-full w-3/4 lg:w-1/4 z-40 lg:z-0 bg-white lg:bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden"
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
                        <span className="font-lato text-sm">
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

export default TokenTheoryPage;
