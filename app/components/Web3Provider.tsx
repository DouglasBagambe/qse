// app/components/Web3Provider.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import QSETokenArtifact from "../artifacts/contracts/QSE.sol/QSEToken.json";
import QSECrowdsaleArtifact from "../artifacts/contracts/QSECrowdsale.sol/QSECrowdsale.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const QSE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_QSE_TOKEN_ADDRESS ||
  "0x47cdE6190AE3718088Ca2305D97d0C622599b2F4";
const QSE_CROWDSALE_ADDRESS =
  process.env.NEXT_PUBLIC_QSE_CROWDSALE_ADDRESS ||
  "0xCe849ef42298587D7eA9761BF4d34F45395aE0F7";

// Define the supported payment methods
export type PaymentMethod = "ETH" | "USDT" | "USDC" | "USD";

// Define rates against USD (these would come from an API in production)
const PAYMENT_RATES = {
  ETH: { usdRate: 3000, tokenSymbol: "ETH" }, // 1 ETH = $3000 USD
  USDT: { usdRate: 1, tokenSymbol: "USDT" }, // 1 USDT = $1 USD
  USDC: { usdRate: 1, tokenSymbol: "USDC" }, // 1 USDC = $1 USD
  USD: { usdRate: 1, tokenSymbol: "$" }, // 1 USD = $1 USD (of course)
};

const QSE_TOKEN_PRICE_USD = 0.6; // QSE price in USD (e.g., $0.60 per QSE)

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df"
    ),
  },
  connectors: [injected()],
});

type Web3ContextType = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  qseToken: ethers.Contract | null;
  qseCrowdsale: ethers.Contract | null;
  connectWallet: () => Promise<boolean>;
  buyTokens: (
    amount: string,
    email: string,
    paymentMethod: PaymentMethod
  ) => Promise<{ success: boolean; message: string }>;
  isConnecting: boolean;
  isConnected: boolean;
  tokenRate: number;
  burnRate: number;
  networkError: string | null;
  switchToSepolia: () => Promise<boolean>;
  qseBalance: string;
  loadQSEBalance: () => Promise<void>;
  supportedPaymentMethods: PaymentMethod[];
  getQSEAmountFromPayment: (amount: string, method: PaymentMethod) => number;
  getPaymentRateForMethod: (method: PaymentMethod) => number;
};

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  qseToken: null,
  qseCrowdsale: null,
  connectWallet: async () => false,
  buyTokens: async () => ({ success: false, message: "" }),
  isConnecting: false,
  isConnected: false,
  tokenRate: 5000,
  burnRate: 2,
  networkError: null,
  switchToSepolia: async () => false,
  qseBalance: "0",
  loadQSEBalance: async () => {},
  supportedPaymentMethods: ["ETH", "USDT", "USDC", "USD"],
  getQSEAmountFromPayment: () => 0,
  getPaymentRateForMethod: () => 0,
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3ContextProvider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [qseToken, setQseToken] = useState<ethers.Contract | null>(null);
  const [qseCrowdsale, setQseCrowdsale] = useState<ethers.Contract | null>(
    null
  );
  const [tokenRate, setTokenRate] = useState(5000);
  const [burnRate, setBurnRate] = useState(2);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [qseBalance, setQseBalance] = useState<string>("0");
  const supportedPaymentMethods: PaymentMethod[] = [
    "ETH",
    "USDT",
    "USDC",
    "USD",
  ];

  // Function to get payment rate for a specific method
  const getPaymentRateForMethod = (method: PaymentMethod): number => {
    return PAYMENT_RATES[method].usdRate;
  };

  // Function to calculate QSE amount from payment amount and method
  const getQSEAmountFromPayment = (
    amount: string,
    method: PaymentMethod
  ): number => {
    if (!amount || isNaN(parseFloat(amount))) return 0;

    const paymentValue = parseFloat(amount) * PAYMENT_RATES[method].usdRate;
    return paymentValue / QSE_TOKEN_PRICE_USD;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      ethProvider
        .listAccounts()
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setIsConnected(true);
            initializeProviderAndContracts(ethProvider);
          }
        })
        .catch(console.error);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  // Function to load QSE token balance
  const loadQSEBalance = async () => {
    if (!qseToken || !account) {
      setQseBalance("0");
      return;
    }

    try {
      const balance = await qseToken.balanceOf(account);
      setQseBalance(ethers.formatUnits(balance, 18));
      console.log("QSE Balance:", ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error loading QSE balance:", error);
      setQseBalance("0");
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setNetworkError("MetaMask or compatible wallet not detected");
      return false;
    }

    setNetworkError(null);
    try {
      // Try to switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 0xaa36a7 is hex for 11155111 (Sepolia chainId)
      });
      return true;
    } catch (switchError: any) {
      // If the network doesn't exist in the wallet, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df",
                ],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
          setNetworkError("Failed to add Sepolia network to your wallet");
          return false;
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        setNetworkError(
          "Please switch to Sepolia network to use this application"
        );
        return false;
      }
      console.error("Error switching to Sepolia network:", switchError);
      setNetworkError("Failed to switch to Sepolia network");
      return false;
    }
  };

  const initializeProviderAndContracts = async (
    ethProvider: ethers.BrowserProvider
  ) => {
    try {
      setNetworkError(null);
      const network = await ethProvider.getNetwork();
      const signer = await ethProvider.getSigner();
      setSigner(signer);
      setChainId(Number(network.chainId));

      if (network.chainId !== BigInt(sepolia.id)) {
        setNetworkError(
          "Please switch to Sepolia network to use this application"
        );
        const switched = await switchToSepolia();
        if (!switched) {
          throw new Error(
            `Please switch to Sepolia network (chainId: ${sepolia.id})`
          );
        } else {
          // Recheck network after switching
          const updatedNetwork = await ethProvider.getNetwork();
          if (updatedNetwork.chainId !== BigInt(sepolia.id)) {
            setNetworkError(
              "Network switch failed. Please manually switch to Sepolia network"
            );
            throw new Error(
              `Network switch failed. Please manually switch to Sepolia network (chainId: ${sepolia.id})`
            );
          }
          // Clear error if switch was successful
          setNetworkError(null);
        }
      }

      if (QSE_TOKEN_ADDRESS) {
        const token = new ethers.Contract(
          QSE_TOKEN_ADDRESS,
          QSETokenArtifact.abi,
          signer
        );
        setQseToken(token);
        // Since the new QSEToken has a name() function, we can call it
        const tokenName = await token.name();
        console.log("QSE Token contract initialized, name:", tokenName);

        // Load QSE balance
        await loadQSEBalance();
      }

      if (QSE_CROWDSALE_ADDRESS) {
        const crowdsale = new ethers.Contract(
          QSE_CROWDSALE_ADDRESS,
          QSECrowdsaleArtifact.abi,
          signer
        );
        setQseCrowdsale(crowdsale);
        await loadContractData(crowdsale);
      }
    } catch (error: any) {
      console.error("Error initializing provider and contracts:", error);
      if (!networkError) {
        setNetworkError(
          error.message || "Failed to initialize blockchain connection"
        );
      }
    }
  };

  const loadContractData = async (crowdsale: ethers.Contract) => {
    try {
      const rate = await crowdsale.rate();
      setTokenRate(Number(rate));
      const burnRate = await crowdsale.BURN_RATE();
      setBurnRate(Number(burnRate));

      const saleStartTime = await crowdsale.saleStartTime();
      const saleEndTime = await crowdsale.saleEndTime();
      const tokenAddress = await crowdsale.token();

      // Use the provider for read-only calls
      const tokenContract = new ethers.Contract(
        tokenAddress,
        QSETokenArtifact.abi,
        provider // Use provider instead of signer
      );
      const tokenBalance = await tokenContract.balanceOf(QSE_CROWDSALE_ADDRESS);
      const currentTime = Math.floor(Date.now() / 1000);

      console.log("Contract State:");
      console.log("Rate:", Number(rate));
      console.log("Burn Rate:", Number(burnRate));
      console.log(
        "Sale Start Time:",
        Number(saleStartTime),
        new Date(Number(saleStartTime) * 1000)
      );
      console.log(
        "Sale End Time:",
        Number(saleEndTime),
        new Date(Number(saleEndTime) * 1000)
      );
      console.log("Current Time:", currentTime, new Date(currentTime * 1000));
      console.log("Token Address:", tokenAddress);
      console.log(
        "Crowdsale Token Balance:",
        ethers.formatUnits(tokenBalance, 18),
        "QSE"
      );
    } catch (error) {
      console.error("Error loading contract data:", error);
      setNetworkError("Failed to load contract data. Please try again.");
      throw error;
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setSigner(null);
      setQseToken(null);
      setQseCrowdsale(null);
      setIsConnected(false);
      setQseBalance("0");
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      if (provider) {
        // Check if we need to switch networks
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(sepolia.id)) {
          setNetworkError("Please switch to Sepolia network");
          await switchToSepolia();
        }

        provider.getSigner().then((newSigner) => {
          setSigner(newSigner);
          if (QSE_TOKEN_ADDRESS) {
            const tokenContract = new ethers.Contract(
              QSE_TOKEN_ADDRESS,
              QSETokenArtifact.abi,
              newSigner
            );
            setQseToken(tokenContract);
            // Load QSE balance
            loadQSEBalance();
          }
          if (QSE_CROWDSALE_ADDRESS) {
            const crowdsale = new ethers.Contract(
              QSE_CROWDSALE_ADDRESS,
              QSECrowdsaleArtifact.abi,
              newSigner
            );
            setQseCrowdsale(crowdsale);
            loadContractData(crowdsale).catch((err) => {
              setNetworkError(
                "Failed to load contract data: " +
                  (err.message || "Unknown error")
              );
            });
          }
        });
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!provider) {
      setNetworkError("MetaMask or compatible wallet not detected");
      return false;
    }

    setIsConnecting(true);
    setNetworkError(null);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // After connecting, check if we need to switch networks
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(sepolia.id)) {
        setNetworkError("Please switch to Sepolia network");
        await switchToSepolia();
      }

      handleAccountsChanged(accounts);
      return accounts.length > 0;
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setNetworkError("Wallet connection rejected. Please try again.");
      } else {
        setNetworkError(
          "Failed to connect wallet: " + (error.message || "Unknown error")
        );
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const buyTokens = async (
    amount: string,
    email: string,
    paymentMethod: PaymentMethod
  ) => {
    if (!signer || !qseCrowdsale) {
      return {
        success: false,
        message: "Wallet not connected or contract not initialized",
      };
    }

    try {
      if (chainId !== sepolia.id) {
        setNetworkError("Please switch to Sepolia network");
        const switched = await switchToSepolia();
        if (!switched) {
          return {
            success: false,
            message: "Please switch to Sepolia network to purchase tokens",
          };
        }
      }

      // For now, we only support ETH payments on-chain
      // In a production environment, you would integrate with payment processors for USD
      // and with other token contracts for USDT/USDC
      if (paymentMethod !== "ETH") {
        // This is a mock implementation - in production you'd handle other payment methods
        if (paymentMethod === "USD") {
          return {
            success: false,
            message:
              "USD payments are currently being processed off-chain. Our team will contact you via email.",
          };
        } else {
          return {
            success: false,
            message: `${paymentMethod} payments are not yet implemented on this network.`,
          };
        }
      }

      const weiAmount = ethers.parseEther(amount);

      // Calculate token amount based on USD value
      const ethUsdValue = parseFloat(amount) * getPaymentRateForMethod("ETH");
      const tokenAmount = BigInt(
        Math.floor((ethUsdValue / QSE_TOKEN_PRICE_USD) * 10 ** 18)
      );

      const netTokenAmount =
        (tokenAmount * BigInt(100 - burnRate)) / BigInt(100);

      const saleStartTime = await qseCrowdsale.saleStartTime();
      const saleEndTime = await qseCrowdsale.saleEndTime();
      const tokenAddress = await qseCrowdsale.token();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        QSETokenArtifact.abi,
        provider
      );
      const tokenBalance = await tokenContract.balanceOf(QSE_CROWDSALE_ADDRESS);
      const currentTime = Math.floor(Date.now() / 1000);

      console.log("Pre-transaction checks:");
      console.log("ETH Amount (wei):", weiAmount.toString());
      console.log(
        "Token Amount (gross):",
        ethers.formatUnits(tokenAmount, 18),
        "QSE"
      );
      console.log(
        "Token Amount (net):",
        ethers.formatUnits(netTokenAmount, 18),
        "QSE"
      );
      console.log(
        "Crowdsale Token Balance:",
        ethers.formatUnits(tokenBalance, 18),
        "QSE"
      );
      console.log("Current Time:", currentTime);
      console.log("Sale Start Time:", Number(saleStartTime));
      console.log("Sale End Time:", Number(saleEndTime));

      if (currentTime < Number(saleStartTime)) {
        return {
          success: false,
          message: "The token sale has not yet started",
        };
      }
      if (currentTime > Number(saleEndTime)) {
        return { success: false, message: "The token sale has ended" };
      }
      if (tokenBalance < netTokenAmount) {
        return {
          success: false,
          message: "Insufficient tokens in crowdsale contract",
        };
      }

      console.log("Purchase email:", email);

      const tx = await qseCrowdsale.buyTokens({
        value: weiAmount,
        gasLimit: 300000,
      });

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // After successful purchase, reload the user's QSE balance
      await loadQSEBalance();

      return { success: true, message: `Transaction: ${receipt.hash}` };
    } catch (error: any) {
      console.error("Buy Tokens Error:", error);
      let errorMessage = "Transaction failed";
      if (error.code === 4001) errorMessage = "Transaction rejected by user";
      else if (error.message.includes("insufficient funds"))
        errorMessage = "Insufficient funds in your wallet";
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    provider,
    signer,
    account,
    chainId,
    qseToken,
    qseCrowdsale,
    connectWallet,
    buyTokens,
    isConnecting,
    isConnected,
    tokenRate,
    burnRate,
    networkError,
    switchToSepolia,
    qseBalance,
    loadQSEBalance,
    supportedPaymentMethods,
    getQSEAmountFromPayment,
    getPaymentRateForMethod,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <Web3ContextProvider>{children}</Web3ContextProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
