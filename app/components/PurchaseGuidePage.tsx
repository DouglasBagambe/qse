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
        "Welcome to the world of cryptocurrency and the QuantumSEC (QSE) Token! This guide is designed for complete beginners who have never worked with cryptocurrencies before. We'll walk you through every step, from setting up a cryptocurrency wallet to successfully purchasing QSE Tokens during our Initial Coin Offering (ICO). Our goal is to make this process as simple and approachable as possible, with clear instructions to guide you. While we support multiple wallets, this guide focuses primarily on MetaMask, one of the most popular and user-friendly options.<br/><br/>By the end of this guide, you'll have the confidence to securely purchase QSE Tokens and become part of the QuantumSEC ecosystem, which is revolutionizing blockchain security with quantum-resistant AI.",
    },
    {
      id: "01",
      title: "What You'll Need Before You Start",
      icon: <CheckCircle className="h-8 w-8" />,
      content:
        "To successfully purchase QSE Tokens, you'll need:<br/><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><span class='font-semibold'>A Computer or Smartphone:</span> A device with a web browser (Google Chrome or Firefox recommended for MetaMask).</li><li><span class='font-semibold'>Internet Connection:</span> A stable connection to access the QuantumSEC website and complete transactions.</li><li><span class='font-semibold'>An Email Address:</span> For receiving updates or support (no email is required for the token purchase itself).</li><li><span class='font-semibold'>Funds to Purchase ETH:</span> You'll need Ethereum (ETH) to buy QSE Tokens. You can use a credit/debit card, bank account, or other payment methods via a cryptocurrency exchange.</li><li><span class='font-semibold'>Basic Computer Skills:</span> If you can browse the web and follow instructions, you're ready!</li><li><span class='font-semibold'>A Secure Environment:</span> Use a personal device and avoid public Wi-Fi for security.</li></ul>",
    },
    {
      id: "02",
      title: "Understanding Cryptocurrency and QSE Tokens",
      icon: <HelpCircle className="h-8 w-8" />,
      content:
        "<strong>What is Cryptocurrency?</strong><br/>Cryptocurrency is digital money that operates on a decentralized network called a blockchain. Unlike traditional money, it's not controlled by banks or governments. Ethereum (ETH) is one of the most popular cryptocurrencies, and it's what you'll use to purchase QSE Tokens.<br/><br/><strong>What are QSE Tokens?</strong><br/>QSE Tokens are the digital currency of the QuantumSEC ecosystem, designed to power secure blockchain transactions, particularly for electric vehicle charging and other innovative applications. By purchasing QSE Tokens, you're investing in a project that combines AI, quantum-resistant cryptography, and cybersecurity.<br/><br/><strong>Why MetaMask?</strong><br/>MetaMask is a free, secure cryptocurrency wallet that acts like a digital wallet for storing and managing your ETH and QSE Tokens. It's easy to use and integrates seamlessly with the QuantumSEC website. You'll install MetaMask as a browser extension or mobile app.",
    },
    {
      id: "03",
      title: "Setting Up a MetaMask Wallet",
      icon: <Wallet className="h-8 w-8" />,
      content:
        "Let's set up your MetaMask wallet. Follow these steps carefully.<br/><br/><strong>1. Install MetaMask</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Visit the Official MetaMask Website (metamask.io) using Google Chrome or Firefox.</li><li>Click Download.</li><li>Choose Install MetaMask for Chrome (or your preferred browser) or select the mobile app for iOS/Android.</li><li>If using Chrome, you'll be redirected to the Chrome Web Store.</li><li>Click Add to Chrome and then Add Extension.</li><li>Once installed, the MetaMask fox icon will appear in your browser's toolbar.</li><li>Click the MetaMask fox icon in your browser toolbar.</li><li>You'll see a welcome screen. Click Get Started.</li></ul><br/><strong>2. Create a New Wallet</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>On the MetaMask welcome screen, select Create a Wallet.</li><li>Agree to the terms and conditions.</li><li>Create a password with at least 8 characters, including letters, numbers, and symbols.</li><li>Write down your password and store it securely (e.g., in a password manager or a safe physical location).</li><li>MetaMask will generate a 12-word Secret Recovery Phrase. This is the key to your wallet and must be kept private.</li><li>Write down the 12 words in the exact order shown and store them in a secure, offline location (e.g., on paper in a safe).</li><li>Never share your Secret Recovery Phrase with anyone, including QuantumSEC support. Scammers may pretend to be support staff to steal your funds.</li><li>Confirm your Secret Recovery Phrase by selecting the words in the correct order when prompted.</li></ul><br/><strong>3. Verify Your Wallet</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Ensure you can log in to MetaMask using your password.</li><li>Double-check that you've securely stored your Secret Recovery Phrase.</li></ul>",
    },
    {
      id: "04",
      title: "Adding Funds to Your MetaMask Wallet",
      icon: <DollarSign className="h-8 w-8" />,
      content:
        "To purchase QSE Tokens, you need Ethereum (ETH) in your MetaMask wallet. You'll buy ETH through a cryptocurrency exchange and transfer it to your MetaMask wallet.<br/><br/><strong>1. Choose a Cryptocurrency Exchange</strong><br/>Popular exchanges for beginners include:<br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Coinbase: User-friendly, supports credit/debit cards and bank transfers.</li><li>Binance: Offers competitive fees (not available in some regions).</li><li>Kraken: Secure and reliable.</li><li>Gemini: Beginner-friendly with strong security.</li></ul>For this guide, we'll use Coinbase as an example, but the process is similar on other exchanges.<br/><br/><strong>2. Sign Up for Coinbase</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Go to coinbase.com and click Sign Up.</li><li>Enter your name, email, and a strong password.</li><li>Coinbase requires identity verification (KYC) to comply with regulations.</li><li>Upload a government-issued ID (e.g., driver\'s license or passport) and follow the prompts to verify your identity.</li><li>This may take a few minutes to a few hours.</li><li>Go to Settings > Payment Methods in Coinbase.</li><li>Add a credit/debit card or link a bank account. Credit/debit cards are faster but may have higher fees.</li></ul><br/><strong>3. Buy Ethereum (ETH)</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>In Coinbase, click Buy & Sell or the Trade tab.</li><li>Select Ethereum (ETH) from the list of cryptocurrencies.</li><li>Enter the amount you want to spend (e.g., $100 USD).</li><li>Check the fees and the amount of ETH you\'ll receive. For QSE Tokens, we recommend purchasing at least 0.05 ETH to cover the minimum purchase (50 QSE Tokens) and transaction fees.</li><li>Choose your payment method (e.g., credit card or bank account).</li><li>Confirm the transaction. Funds may take a few minutes (credit card) or days (bank transfer) to appear in your Coinbase account.</li></ul><br/><strong>4. Transfer ETH to MetaMask</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Open MetaMask and click your account address (starts with \"0x…\") to copy it to your clipboard.</li><li>In Coinbase, go to Portfolio or Assets and select Ethereum (ETH).</li><li>Click Send.</li><li>Paste your MetaMask wallet address in the \"To\" field.</li><li>Enter the amount of ETH to send (leave some ETH in Coinbase for fees, e.g., send 0.04 ETH if you bought 0.05 ETH).</li><li>Double-check the address to ensure it\'s correct. Sending to the wrong address cannot be undone.</li><li>Confirm the transaction.</li><li>The transfer may take 5–30 minutes, depending on the Ethereum network.</li><li>Once complete, your ETH balance will appear in MetaMask.</li></ul>",
    },
    {
      id: "05",
      title: "Connecting MetaMask to the Sepolia Test Network",
      icon: <Zap className="h-8 w-8" />,
      content: `The QSE Token sale is conducted on the Sepolia Test Network, a testing environment for Ethereum. You need to switch MetaMask to Sepolia to interact with the QuantumSEC ICO.<br/><br/><strong>1. Check Your Current Network</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Open MetaMask and check the network dropdown at the top (it likely says "Ethereum Mainnet").</li><li>If it already says "Sepolia Test Network," skip to the next section.</li></ul><br/><strong>2. Add and Switch to Sepolia Test Network</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>In MetaMask, click the network dropdown and select Add Network.</li><li>Click Add a network manually and enter the following details:</li><li>Network Name: Sepolia Test Network</li><li>New RPC URL: https://sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df</li><li>Chain ID: 11155111</li><li>Currency Symbol: ETH</li><li>Block Explorer URL: https://sepolia.etherscan.io</li><li>Click Save.</li><li>In the network dropdown, select Sepolia Test Network.</li><li>Your wallet will now show your ETH balance on Sepolia (it may be 0 if you haven't added testnet ETH).</li></ul><br/><strong>3. Get Sepolia Testnet ETH</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Since Sepolia is a test network, you'll need testnet ETH to perform transactions. These are free and used for testing purposes.</li><li>Go to a trusted Sepolia faucet, such as Infura's Sepolia Faucet or Alchemy's Sepolia Faucet.</li><li>You may need to sign up for a free account with Infura or Alchemy.</li><li>Paste your MetaMask wallet address (copied from MetaMask).</li><li>Request 0.1–0.5 testnet ETH (enough for multiple transactions).</li><li>The ETH will appear in your MetaMask wallet within minutes.</li><li>In MetaMask, ensure your Sepolia network balance shows the testnet ETH you received.</li></ul>`,
    },
    {
      id: "06",
      title: "Visiting the QuantumSEC Website",
      icon: <Globe className="h-8 w-8" />,
      content:
        "Now that your wallet is funded, let's head to the QuantumSEC website to purchase QSE Tokens.<br/><br/><strong>1. Open the Website</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Go to quantumsec.io</li><li>Use Google Chrome or Firefox with MetaMask installed.</li></ul><br/><strong>2. Explore the Site</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Take a moment to read about the QSE Token, its use cases, and the team behind QuantumSEC.</li><li>Check the Whitepaper and Tokenomics sections for more details about the project.</li></ul><br/><strong>3. Ensure MetaMask is Ready</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Confirm that MetaMask is set to the Sepolia Test Network and shows your testnet ETH balance.</li></ul>",
    },
    {
      id: "07",
      title: "Purchasing QSE Tokens",
      icon: <CreditCard className="h-8 w-8" />,
      content: `Here's how to buy QSE Tokens using the QuantumSEC website.<br/><br/><strong>1. Connect Your MetaMask Wallet</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>On the QuantumSEC homepage, locate the Buy $QSE button (or similar, e.g., "Buy Token").</li><li>Click it to open the Token Purchase Modal.</li><li>In the Token Purchase Modal, you'll see a Connect Wallet button if your wallet isn't connected.</li><li>Click Connect Wallet. MetaMask will pop up, asking you to connect.</li><li>Select your MetaMask account and click Next, then Connect.</li><li>Once connected, the modal will display your wallet address (shortened, e.g., "0x…1234") and your QSE balance (initially 0).</li></ul><br/><strong>2. Select Payment Method and Amount</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>The modal supports multiple payment methods (ETH, USDT, USDC, USD). For this guide, select ETH (the only on-chain option on Sepolia).</li><li>You'll see the exchange rate (e.g., 1 ETH = ~1666.67 QSE, based on $0.60 per QSE and $3000 per ETH).</li><li>You can enter either:</li><li>- The amount of ETH you want to spend (e.g., 0.03 ETH).</li><li>- The number of QSE Tokens you want to buy (e.g., 100 QSE).</li><li>The modal automatically calculates the other field. For example, entering 100 QSE will show ~0.02 ETH (plus fees).</li><li>The minimum purchase is 50 QSE Tokens (~$30 USD or ~0.01 ETH).</li><li>The modal shows:</li><li>- Gross Amount: Total QSE Tokens purchased (e.g., 100 QSE).</li><li>- Burn Amount: 2% of tokens burned (e.g., 2 QSE).</li><li>- You Receive: Net tokens after burn (e.g., 98 QSE).</li><li>Ensure you have enough ETH to cover the purchase and gas fees (~0.001–0.005 ETH).</li><li>For faster purchases, select a preset amount (e.g., 100, 250, 500 QSE) from the Quick Buy section.</li></ul><br/><strong>3. Confirm the Purchase</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Click the Buy QSE Tokens button in the modal.</li><li>MetaMask will pop up, showing the transaction details (ETH amount, gas fees, and contract address).</li><li>Review the transaction in MetaMask. Ensure the "To" address matches the QSE Crowdsale contract (starts with "0xCe…").</li><li>Click Confirm to send the transaction.</li><li>If you see a "Reject" option, do not click it unless you want to cancel.</li><li>The modal will show "Processing…" while the transaction is being confirmed on the Sepolia network (usually 10–60 seconds).</li><li>Once confirmed, you'll see a Purchase Successful! message with transaction details.</li><li>Click Close to exit the modal. Your QSE Tokens are now in your MetaMask wallet.</li></ul>`,
    },
    {
      id: "08",
      title: "Verifying Your Purchase",
      icon: <Eye className="h-8 w-8" />,
      content:
        "Let's confirm that your QSE Tokens are in your wallet.<br/><br/><strong>1. Add QSE Token to MetaMask</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>By default, MetaMask may not display QSE Tokens. You need to add it manually.</li><li>Find the QSE Token contract address on the QuantumSEC website (e.g., \"0x47cdE6190AE3718088Ca2305D97d0C622599b2F4\").</li><li>Alternatively, it's shown in the Token Purchase Modal after a successful purchase.</li><li>Open MetaMask and ensure you're on the Sepolia Test Network.</li><li>Click Import Tokens (under the \"Assets\" tab).</li><li>Paste the QSE Token contract address in the Token Contract Address field.</li><li>The Token Symbol (QSE) and Decimals of Precision (18) should auto-fill.</li><li>Click Add Custom Token, then Import Tokens.</li><li>Your QSE Token balance (e.g., 98 QSE) should now appear in MetaMask under the \"Assets\" tab.</li></ul><br/><strong>2. Verify on Sepolia Etherscan</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Go to sepolia.etherscan.io.</li><li>Paste the Transaction Hash from the purchase confirmation into the search bar.</li><li>You'll see details like:</li><li>- Transaction status (Success).</li><li>- From (your wallet address).</li><li>- To (QSE Crowdsale contract address).</li><li>- Amount of ETH spent and QSE Tokens received.</li><li>This confirms your purchase is recorded on the blockchain.</li></ul>",
    },
    {
      id: "09",
      title: "Using Other Wallets (Optional)",
      icon: <Wallet className="h-8 w-8" />,
      content:
        "While MetaMask is recommended, you can use other wallets like Trust Wallet, Coinbase Wallet, or WalletConnect-compatible wallets. Here's a brief overview:<br/><br/><strong>Trust Wallet</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Download Trust Wallet from the App Store or Google Play. Create a new wallet and secure your 12-word recovery phrase.</li><li>Buy ETH via an exchange (e.g., Binance) and transfer it to your Trust Wallet address.</li><li>Add the Sepolia Test Network manually (same details as MetaMask).</li><li>Visit the QuantumSEC website using Trust Wallet's built-in browser and connect to the Token Purchase Modal.</li></ul><br/><strong>Coinbase Wallet</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Download Coinbase Wallet (separate from the Coinbase exchange app). Create a wallet and secure your recovery phrase.</li><li>Transfer ETH from Coinbase exchange to Coinbase Wallet.</li><li>Switch to Sepolia Test Network in the wallet settings.</li><li>Use the Coinbase Wallet browser to access the QuantumSEC website and connect.</li></ul><br/><strong>WalletConnect</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li>Many wallets support WalletConnect, allowing you to connect to the QuantumSEC website.</li><li>In the Token Purchase Modal, select WalletConnect, scan the QR code with your wallet app, and follow the prompts to connect and purchase.</li></ul><br/>Note: The steps for purchasing QSE Tokens are similar across wallets, but MetaMask offers the smoothest integration. If you use another wallet, ensure it supports the Sepolia Test Network and custom tokens.",
    },
    {
      id: "10",
      title: "Troubleshooting Common Issues",
      icon: <AlertCircle className="h-8 w-8" />,
      content:
        "Here are solutions to common problems you might encounter:<br/><br/><strong>1. MetaMask Won't Connect</strong><br/>Solution: Ensure MetaMask is installed and unlocked. Refresh the QuantumSEC website and try connecting again. Check that you're on the Sepolia Test Network.<br/><br/><strong>2. Insufficient Funds</strong><br/>Solution: Verify your ETH balance in MetaMask (on Sepolia). Transfer more ETH from your exchange or request additional testnet ETH from a faucet. Account for gas fees (~0.001–0.005 ETH).<br/><br/><strong>3. Transaction Rejected</strong><br/>Solution: This usually means you clicked \"Reject\" in MetaMask or the gas limit was too low. Try the purchase again, ensuring you click \"Confirm.\" If it persists, increase the gas limit in MetaMask's advanced settings.<br/><br/><strong>4. QSE Tokens Not Visible</strong><br/>Solution: Manually add the QSE Token to MetaMask using the contract address (see Verifying Your Purchase). Ensure you're on the Sepolia Test Network.<br/><br/><strong>5. Network Error (Wrong Network)</strong><br/>Solution: MetaMask must be on the Sepolia Test Network. Follow the guide to switch networks. If Sepolia isn't listed, add it manually.<br/><br/><strong>6. Slow Transaction</strong><br/>Solution: Sepolia transactions typically take 10–60 seconds. If it's taking longer, check the transaction status on sepolia.etherscan.io using the transaction hash. Do not resubmit until the first transaction is confirmed or failed.<br/><br/>If you encounter other issues, contact QuantumSEC support.",
    },
    {
      id: "11",
      title: "FAQs and Safety Tips",
      icon: <HelpCircle className="h-8 w-8" />,
      content:
        "<strong>Frequently Asked Questions</strong><br/><br/><strong>Q: Do I need to provide an email to purchase QSE Tokens?</strong><br/>A: No, the QuantumSEC platform automatically generates a dummy email for the transaction. Your purchase is tied to your wallet address.<br/><br/><strong>Q: What is the minimum purchase amount?</strong><br/>A: The minimum purchase is 50 QSE Tokens, equivalent to ~$30 USD or ~0.01 ETH (plus gas fees).<br/><br/><strong>Q: Why is there a 2% burn rate?</strong><br/>A: A 2% burn rate means 2% of your purchased tokens are removed from circulation to reduce the total supply, potentially increasing the value of remaining tokens.<br/><br/><strong>Q: Can I use USD or other cryptocurrencies?</strong><br/>A: Currently, only ETH is supported for on-chain purchases on the Sepolia Test Network. USD, USDT, and USDC options are placeholders for future mainnet integration. Contact support for off-chain USD payment options.<br/><br/><strong>Q: Is my purchase secure?</strong><br/>A: Yes, transactions are processed on the blockchain, ensuring transparency and security. Always use the official QuantumSEC website and verify contract addresses.<br/><br/><strong>Q: What happens after I purchase QSE Tokens?</strong><br/>A: Your tokens are sent to your MetaMask wallet. You can hold them, use them in the QuantumSEC ecosystem (once launched), or trade them on supported exchanges (post-ICO).<br/><br/><strong>Safety Tips for Crypto Beginners</strong><br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><strong>Never Share Your Secret Recovery Phrase:</strong> This gives full access to your wallet. QuantumSEC will never ask for it.</li><li><strong>Use the Official Website:</strong> Only visit quantumsec.io Beware of phishing sites that mimic the official page.</li><li><strong>Double-Check Addresses:</strong> Always verify wallet and contract addresses before sending funds.</li><li><strong>Secure Your Device:</strong> Use antivirus software and avoid public Wi-Fi when managing your wallet.</li><li><strong>Start Small:</strong> If you're new, begin with a small purchase to familiarize yourself with the process.</li><li><strong>Enable Two-Factor Authentication (2FA):</strong> On exchanges like Coinbase, enable 2FA for added security.</li><li><strong>Backup Your Wallet:</strong> Store your Secret Recovery Phrase and password in multiple secure locations.</li></ul>",
    },
    {
      id: "12",
      title: "Contact Support & Conclusion",
      icon: <CheckCircle className="h-8 w-8" />,
      content:
        "<strong>Contact Support</strong><br/>If you need help at any point, our team is here for you:<br/><ul class='list-disc pl-6 mt-2 space-y-2 text-gray-800 font-medium'><li><strong>Email:</strong> support@quantumsec.io</li><li><strong>Telegram:</strong> Join our official Telegram community at t.me/QuantumSEC</li><li><strong>Website:</strong> Use the live chat or contact form on quantumsec.io.</li><li><strong>Response Time:</strong> We aim to respond within 24 hours.</li></ul><br/><strong>Congratulations!</strong><br/>You've completed the guide and successfully purchased QSE Tokens! You're now part of the QuantumSEC ecosystem, helping to shape the future of secure blockchain technology. Keep your MetaMask wallet secure, stay updated via our website and social media, and explore how QSE Tokens will power innovative applications.<br/><br/>If you have feedback or want to learn more about using QSE Tokens, reach out to our support team or check our Whitepaper and Blog on the QuantumSEC website.<br/><br/>Welcome aboard, and thank you for joining QuantumSEC!",
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
              QSE Purchase Guide
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
                  Purchase Guide
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
