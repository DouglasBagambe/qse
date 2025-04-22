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
    }, 1000); // 1-second artificial delay

    // Close sidebar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Close sidebar on escape key
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
      content: `In an era defined by quantum threats, digital insecurity, and the ethical challenges of artificial
intelligence, the QuantumSEC (QSE) Token emerges as a next-generation cryptographic utility
designed to empower AI-native cybersecurity ecosystems. More than a transactional token, QSE
represents a paradigm shift in how digital trust, governance, and resilience are structured across
industries—particularly in clean energy, critical infrastructure, and decentralized systems.`,
    },
    {
      id: "01",
      title: "Core Principles of the QuantumSEC Ecosystem",
      icon: <Lock className="h-8 w-8" />,
      content: `<strong>Informed Decision-Making:</strong><br/>
Built on three foundational principles that set it apart in the world of digital assets: Security,
Intelligence, and Trust- we prioritize making choices based on comprehensive data
analysis. By continuously monitoring market trends and utilizing advanced analytics, we
ensure that every action taken within the QSE ecosystem is well-informed. This approach
minimizes risks and enhances the potential for favorable outcomes, providing confidence to
our token holders.<br/><br/>
<strong>Smart Risk Management:</strong><br/>
HCISS, LLC (BSECAEnergy) knows risk comes from all sides—market shifts, cyber threats,
and disruptions. That's why the QSE Token is protected by HCISS AI Security Agents—our
always-on, intelligent BSECA.ai Bots. These digital AI guardians monitor threats and
irregularities around the clock, adapting in real-time to outsmart hackers—like your
personal cybersecurity team, always on watch.`,
    },
    {
      id: "02",
      title: "QuantumSEC AI Security Agentic Bots – Transformative Features",
      icon: <Cpu className="h-8 w-8" />,
      content: `<strong>Predictive Threat Neutralization:</strong><br/>
Unlike traditional systems that react to breaches, AI Security Agentic (BSECA.ai)
bots anticipate and eliminate risks before they strike. In decentralized finance (DeFi), they
prevent flash loan attacks and smart contract exploits. For energy grids, they detect
abnormal consumption patterns, stopping fraud or cyber-physical sabotage.<br/><br/>
<strong>Self-Healing Automation:</strong><br/>
These bots don't just find problems, they fix them instantly. In logistics, if a GPS tracker is
hacked, it's quickly shut off, repaired, and brought back online without delay. For storage, if
data is tampered with, it automatically restores itself. No waiting, no downtime, just smart,
fast protection.<br/><br/>
<strong>Regulatory Intelligence:</strong><br/>
BSECA.ai bots auto-enforce compliance, slashing costs. In DeFi, they validate Know-Your-
Customers-Know-Your-Transactions-Anti-Money-Laundering - KYC/KYT/AML rules across
chains. For energy traders, they certify carbon credits and audit transactions against global
standards—no manual oversight needed.<br/><br/>
<strong>Advanced Security Features:</strong><br/>
HCISS AI Security Agent Bots integrates several advanced features that set it apart in the
competitive landscape: -<br/>
Autonomous Threat Intervention: Unlike many bots that simply detect threats, HCISS AI
Security Agents can act autonomously—blocking, isolating, or mitigating risks in real time
without waiting for manual approval.<br/>
Behavioral Biometrics for Access Control: The agents can analyze user behavior patterns
(mouse movements, keystroke dynamics, transaction timing) to detect impersonation or
insider threats—an edge most traditional systems don't offer.<br/>
Cross-Chain Threat Intelligence: With multi-chain interoperability, the agents aggregate
threat data across multiple blockchain networks, allowing for a more comprehensive
security net—critical for decentralized finance systems operating across platforms.<br/>
Sentiment-Based Attack Prediction: Using natural language processing (NLP), the bots
scrape social media, forums, and dark web chatter to detect early signs of coordinated
attacks or market manipulation—a proactive shield rather than reactive patchwork.<br/>
Quantum-Resilient Cryptography Readiness: Futureproofing is baked in. The bots are
designed to upgrade to quantum-safe encryption standards, making them ready for post-
quantum threats as quantum computing becomes more accessible.`,
    },
    {
      id: "03",
      title: "(QSE) Token Theory Introduction",
      icon: <Zap className="h-8 w-8" />,
      content: `The QuantumSEC (QSE) Token represents a revolutionary leap in digital security, combining
quantum-proof encryption, AI-powered threat prevention, and self-securing blockchain
technology. Unlike traditional security solutions that merely react to threats, QSE proactively
neutralizes risks before they emerge – delivering military-grade protection for financial
transactions, sensitive communications, and critical infrastructure in the quantum
computing era.`,
    },
    {
      id: "04",
      title: "QSE Token as an Investment Vehicle",
      icon: <BarChart3 className="h-8 w-8" />,
      content: `<strong>Investment Principles:</strong><br/>
HCISS LLC BSECAEnergy strategically designed the QuantumSEC QSE Token to be more
than just a digital asset; it's a gateway to a dynamic and prosperous investment ecosystem.
With opportunities for passive income, portfolio diversification, and access to emerging
financial innovations, QSE offers a comprehensive investment experience tailored for
today's forward-thinking investors.<br/><br/>
<strong>Dividends and Returns:</strong><br/>
QSE Token holders can earn regular dividends simply by holding and staking their tokens.
This gives investors a way to earn passive income while supporting the growth of the
QuantumSEC ecosystem. As the platform expands and performs well, your returns grow
with it—rewarding your commitment with real value over time. It's a smart way to stay
invested and earn while the system works for you.`,
    },
    {
      id: "05",
      title: "QSE Accessing Liquidity Pools",
      icon: <Globe className="h-8 w-8" />,
      content: `<strong>Seamless Access to Liquidity:</strong><br/>
By holding QSE Tokens, you can participate in liquidity pools that are carefully managed to
ensure ample liquidity for trading activities. This means you can execute trades smoothly
and efficiently without the delays often found in less liquid markets.<br/><br/>
<strong>Enhanced Trading Experience:</strong><br/>
Access to these liquidity pools allows for faster trade execution at competitive prices. This
setup minimizes slippage—the difference between expected and actual trade prices
assuring you get the most value out of your transactions.<br/><br/>
<strong>Passive Income Opportunities:</strong><br/>
Beyond trading, participating in liquidity pools enables investors to earn a share of the
trading fees generated within the QuantumSEC ecosystem. This offers a potential passive
income stream, adding another layer of value to your investment. The QSE Tokens can
facilitate efficient trading and provide opportunities for additional earnings through active
participation in the platform's liquidity pools.`,
    },
    {
      id: "06",
      title: "Staking Mechanism for Dividends",
      icon: <Lock className="h-8 w-8" />,
      content: `<strong>Staking Dynamics:</strong><br/>
Staking QSE Tokens unlocks dual rewards: earn 5-15% annual yields while helping secure
the quantum-resistant network. Your staked tokens power critical operations—like
validating transactions and running AI security bots—and in return, you receive regular
payouts from ecosystem fees and penalties on bad actors. Staking is simple, with flexible
lock-up periods to match your goals. The more the network grows, the more you earn.<br/><br/>
<strong>Dividend Distribution:</strong><br/>
The QSE Token rewards holders with real-world profits. Each quarter, 10-20% of ecosystem
revenue (from fees, licenses, and partnerships) is shared directly with token holders—like a
stock dividend. We also use 5% of profits to buy back and permanently remove QSE tokens
from circulation, increasing scarcity. It's simple: hold QSE, earn passive income, and benefit
as the ecosystem grows.`,
    },
    {
      id: "07",
      title:
        "Leveraging QSE Token for Investments in Energy, Clean Technology, and DeFi Products",
      icon: <Zap className="h-8 w-8" />,
      content: `<strong>The Rise of Clean Technology:</strong><br/>
The clean tech sector is booming, with investments expected to surpass $2 trillion by 2030.
HCISS LLC uses the QSE Token to power this growth, offering quantum-secure, AI-driven
tools for safer and smarter transactions. From solar trading to EV networks, QSE helps scale
clean innovations while making green tech a profitable, future-ready investment.`,
    },
    {
      id: "08",
      title: "QSE Token as an Investment Vehicle in DeFi",
      icon: <BarChart3 className="h-8 w-8" />,
      content: `<strong>Diversify through DeFi Protocols:</strong><br/>
The QSE Token expands its value by integrating with DeFi protocols, allowing investors to
earn through staking and liquidity pools. Its quantum-secure tech protects against hacks,
making DeFi safer and more attractive. This means a steady income for holders and a
stronger, more secure ecosystem for everyone.<br/><br/>
<strong>Access to Growing Clean Technology Start-Ups:</strong><br/>
The QSE Token empowers clean technology startups with advanced cybersecurity tools
designed for the digital energy era. It enables secure asset tokenization, protects IoT
systems, and ensures compliance while attracting investors. With AI-powered grid defense
and quantum-safe data protection, QSE provides the security backbone that clean
technology startups need to thrive in a connected world.`,
    },
    {
      id: "09",
      title: "The Future of Investments with QSE Token",
      icon: <Globe className="h-8 w-8" />,
      content: `<strong>Innovation and Risk Management:</strong><br/>
The QSE Token combines innovation with built-in risk management to give
investors a smarter, safer way to grow their wealth. Powered by AI and quantum-
resistant security, it actively protects against fraud, cyber threats, and market
manipulation. At the same time, QSE opens doors to emerging sectors like DeFi and
clean technology. For investors and clients, it's a forward-looking asset designed to
secure returns while minimizing risk in a fast-changing digital world.<br/><br/>
<strong>Building QuantumSEC Ecosystem:</strong><br/>
HCISS LLC – BSECAEnergy is using the QSE Token to build a strong, secure QuantumSEC
ecosystem. By investing in cybersecurity, DeFi, and clean technology startups, QSE Token
fuels real-world innovation while strengthening the digital economy. Each investment
supports long-term growth, creating a trusted network that benefits both investors and the
broader community. The result is a sustainable, future-ready ecosystem where security,
innovation, and opportunity grow together.`,
    },
    {
      id: "10",
      title: "QSE Token Theory Conclusion",
      icon: <Shield className="h-8 w-8" />,
      content: `The QuantumSEC (QSE) Token, powered by HCISS LLC – BSECAEnergy, is more than a
digital asset—it's a gateway to secure, intelligent investing in a rapidly changing world.
Designed for long-term growth and stability, QSE offers investors real value through
dividends earned via staking, seamless access to liquidity pools, and direct exposure to
high-potential sectors like clean technology, decentralized finance, and AI-driven
cybersecurity. Every feature of the QSE Token is purpose-built to meet the needs of modern
investors, those seeking both innovation and protection.<br/><br/>
By fusing financial opportunity with quantum-secure infrastructure and always-on AI risk
management, the QSE Token creates a trusted environment for building wealth. This unique
combination sets it apart from conventional tokens and reflects HCISS's vision of reshaping
how capital flows in the digital age. Investors don't just hold QSE—they participate in a
future-focused ecosystem designed for resilience, impact, and financial growth.<br/><br/>
As industries like energy, logistics, and DeFi evolve, the QSE Token stands as a foundation
for innovation and security. It's a forward-thinking investment vehicle built to thrive in a
digital-first world—inviting investors to be part of a smarter, safer, and more sustainable
financial future.`,
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

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      {/* Home Button - Fixed at the top */}
      <motion.div
        className="fixed top-6 right-6 z-50"
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

      {/* Mobile sidebar toggle - Only show when sidebar is closed */}
      <AnimatePresence mode="wait">
        {!isSidebarOpen && (
          <motion.div
            className="fixed top-6 left-6 z-50 block lg:hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <button
              onClick={toggleSidebar}
              className="bg-white text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Sidebar for Mobile with AnimatePresence */}
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

          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                ref={sidebarRef}
                className="fixed lg:relative top-0 left-0 h-full lg:h-auto w-4/5 lg:w-1/4 z-40 lg:z-0 bg-white lg:bg-transparent"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 h-full lg:h-auto overflow-auto">
                  {/* Close button for mobile - only visible on mobile */}
                  <motion.button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-800 p-1 bg-gray-100 rounded-full"
                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <h2 className="text-xl font-bold mb-6 flex items-center text-blue-800">
                    <div className="bg-blue-100 p-2 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                    </div>
                    Contents
                  </h2>

                  <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-1">
                      {sections.map((section, index) => (
                        <motion.li
                          key={section.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => goToSection(index)}
                            className={`text-left w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center ${
                              index === currentSection
                                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                                index === currentSection
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {section.id}
                            </div>
                            <span className="line-clamp-1 font-medium">
                              {section.title}
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-8">
                    <div className="text-sm text-gray-600 mb-2 font-medium">
                      Progress
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                        style={{
                          width: `${(currentSection / (sections.length - 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Section {currentSection + 1} of {sections.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area with elevated card effect */}
          <motion.div
            className="lg:w-3/4 w-full"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-gray-100">
              {/* Background decorative elements */}
              <div className="absolute -right-24 -top-24 w-64 h-64 bg-blue-200 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-blue-100 opacity-20 rounded-full blur-3xl"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  {/* Section header with visual elements */}
                  <motion.div
                    className="flex flex-col md:flex-row md:items-center mb-10 gap-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      variants={itemVariants}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl mr-4 text-blue-600 shadow-md transform transition-transform hover:scale-105 border border-blue-200"
                    >
                      {sections[currentSection]?.icon}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="text-sm font-mono text-blue-500 mb-1">
                        Section {sections[currentSection]?.id}
                      </div>
                      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                        {sections[currentSection]?.title}
                      </h2>
                    </motion.div>
                  </motion.div>

                  {/* Content with subtle animation and styled typography */}
                  <motion.div
                    className="prose prose-lg max-w-none prose-headings:text-blue-700 prose-strong:text-blue-700 prose-strong:font-bold"
                    dangerouslySetInnerHTML={{
                      __html: sections[currentSection]?.content,
                    }}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  />

                  {/* Navigation Buttons with enhanced design */}
                  <motion.div
                    className="mt-16 flex flex-col sm:flex-row justify-between gap-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToPrevious}
                      disabled={currentSection === 0}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl sm:w-auto w-full
                        ${
                          currentSection === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-300/30"
                        } 
                        transition-all duration-300`}
                    >
                      <ChevronLeft size={20} />
                      <span>Previous</span>
                    </motion.button>

                    <div className="hidden sm:flex items-center space-x-2">
                      {Array.from({ length: Math.min(5, sections.length) }).map(
                        (_, idx) => {
                          const dotIndex =
                            currentSection < 2
                              ? idx
                              : currentSection > sections.length - 3
                                ? sections.length - 5 + idx
                                : currentSection - 2 + idx;

                          if (dotIndex >= 0 && dotIndex < sections.length) {
                            return (
                              <motion.button
                                key={idx}
                                className={`h-3 rounded-full transition-all ${
                                  dotIndex === currentSection
                                    ? "w-6 bg-blue-600"
                                    : "w-3 bg-blue-200"
                                }`}
                                onClick={() => goToSection(dotIndex)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              />
                            );
                          }
                          return null;
                        }
                      )}
                    </div>

                    <motion.button
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToNext}
                      disabled={currentSection === sections.length - 1}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl sm:w-auto w-full
                        ${
                          currentSection === sections.length - 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-300/30"
                        } 
                        transition-all duration-300`}
                    >
                      <span>Next</span>
                      <ChevronRight size={20} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section indicators on mobile (bottom of screen) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center lg:hidden z-30">
        <motion.div
          className="bg-white rounded-full shadow-lg px-4 py-2 flex space-x-1"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
        >
          {Array.from({ length: Math.min(7, sections.length) }).map(
            (_, idx) => {
              const dotIndex =
                currentSection < 3
                  ? idx
                  : currentSection > sections.length - 4
                    ? sections.length - 7 + idx
                    : currentSection - 3 + idx;

              if (dotIndex >= 0 && dotIndex < sections.length) {
                return (
                  <motion.button
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      dotIndex === currentSection
                        ? "w-6 bg-blue-600"
                        : "w-2 bg-gray-200"
                    }`}
                    onClick={() => goToSection(dotIndex)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                );
              }
              return null;
            }
          )}
        </motion.div>
      </div>

      {/* Add global styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* Animated word entrance */
        .word-animation span {
          display: inline-block;
          opacity: 0;
          transform: translateY(10px);
          animation: fadeInUp 0.5s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Add more responsiveness */
        @media (max-width: 640px) {
          .prose {
            font-size: 16px;
          }
        }

        /* Prevent body scrolling when sidebar is open on mobile */
        body.sidebar-open {
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default TokenTheoryPage;
