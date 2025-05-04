// app/components/Web3Provider.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import QSEArtifact from "../../contracts/QSE.json";
import QSEPresaleArtifact from "../../contracts/QSEPresale.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const QSE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_QSE_TOKEN_ADDRESS ||
  "0xeCBBF174A4502A033B24582eC54df39A71b0A74C";
const QSE_PRESALE_ADDRESS =
  process.env.NEXT_PUBLIC_QSE_PRESALE_ADDRESS ||
  "0xCe849ef42298587D7eA9761BF4d34F45395aE0F7";

const STABLECOINS = {
  USDT: {
    mainnet:
      process.env.NEXT_PUBLIC_USDT_ADDRESS ||
      "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    sepolia:
      process.env.NEXT_PUBLIC_USDT_ADDRESS ||
      "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
  },
  USDC: {
    mainnet:
      process.env.NEXT_PUBLIC_USDC_ADDRESS ||
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    sepolia:
      process.env.NEXT_PUBLIC_USDC_ADDRESS ||
      "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
  },
  DAI: {
    mainnet:
      process.env.NEXT_PUBLIC_DAI_ADDRESS ||
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    sepolia:
      process.env.NEXT_PUBLIC_DAI_ADDRESS ||
      "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
  },
};

export type PaymentMethod = "ETH" | "USDT" | "USDC" | "DAI";

const PAYMENT_RATES = {
  ETH: { usdRate: 3000, tokenSymbol: "ETH" },
  USDT: { usdRate: 1, tokenSymbol: "USDT" },
  USDC: { usdRate: 1, tokenSymbol: "USDC" },
  DAI: { usdRate: 1, tokenSymbol: "DAI" },
};

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(
      "https://arbitrum-sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df"
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
  qsePresale: ethers.Contract | null;
  connectWallet: () => Promise<boolean>;
  buyTokens: (
    amount: string,
    paymentMethod: PaymentMethod,
    roundId: number
  ) => Promise<{ success: boolean; message: string }>;
  claimTokens: () => Promise<{ success: boolean; message: string }>;
  getClaimableAmount: (
    roundId: number
  ) => Promise<{ claimable: string; periodsPassed: number }>;
  getRounds: () => Promise<any[]>;
  getTokensAvailable: (roundId: number) => Promise<string>;
  isConnecting: boolean;
  isConnected: boolean;
  tokenPrice: number;
  burnRate: number;
  networkError: string | null;
  switchToArbitrumSepolia: () => Promise<boolean>;
  qseBalance: string;
  loadQSEBalance: () => Promise<void>;
  supportedPaymentMethods: PaymentMethod[];
  getQSEAmountFromPayment: (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ) => Promise<number>;
  getPaymentRateForMethod: (method: PaymentMethod) => number;
  currentRound: {
    roundId: number;
    tokenPrice: number;
    tokenAmount: number;
    startTime: number;
    endTime: number;
    soldAmount: number;
  } | null;
  tgeTime: number;
  isTgeSet: boolean;
};

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  qseToken: null,
  qsePresale: null,
  connectWallet: async () => false,
  buyTokens: async () => ({ success: false, message: "" }),
  claimTokens: async () => ({ success: false, message: "" }),
  getClaimableAmount: async () => ({ claimable: "0", periodsPassed: 0 }),
  getRounds: async () => [],
  getTokensAvailable: async () => "0",
  isConnecting: false,
  isConnected: false,
  tokenPrice: 0,
  burnRate: 2,
  networkError: null,
  switchToArbitrumSepolia: async () => false,
  qseBalance: "0",
  loadQSEBalance: async () => {},
  supportedPaymentMethods: ["ETH", "USDT", "USDC", "DAI"],
  getQSEAmountFromPayment: async () => 0,
  getPaymentRateForMethod: () => 0,
  currentRound: null,
  tgeTime: 0,
  isTgeSet: false,
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
  const [qsePresale, setQsePresale] = useState<ethers.Contract | null>(null);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [burnRate, setBurnRate] = useState(2);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [qseBalance, setQseBalance] = useState<string>("0");
  const [currentRound, setCurrentRound] = useState<{
    roundId: number;
    tokenPrice: number;
    tokenAmount: number;
    startTime: number;
    endTime: number;
    soldAmount: number;
  } | null>(null);
  const [tgeTime, setTgeTime] = useState(0);
  const [isTgeSet, setIsTgeSet] = useState(false);
  const supportedPaymentMethods: PaymentMethod[] = [
    "ETH",
    "USDT",
    "USDC",
    "DAI",
  ];

  const getPaymentRateForMethod = (method: PaymentMethod): number =>
    PAYMENT_RATES[method].usdRate;

  const getQSEAmountFromPayment = async (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ): Promise<number> => {
    if (!amount || isNaN(parseFloat(amount)) || !qsePresale) {
      console.error("Invalid amount or qsePresale not initialized");
      return 0;
    }

    try {
      let coinAddress = "";
      if (method === "USDT")
        coinAddress =
          chainId === 42161
            ? STABLECOINS.USDT.mainnet
            : STABLECOINS.USDT.sepolia;
      if (method === "USDC")
        coinAddress =
          chainId === 42161
            ? STABLECOINS.USDC.mainnet
            : STABLECOINS.USDC.sepolia;
      if (method === "DAI")
        coinAddress =
          chainId === 42161 ? STABLECOINS.DAI.mainnet : STABLECOINS.DAI.sepolia;

      if (method === "ETH") {
        const ethAmount = ethers.parseEther(amount);
        const tokenAmount =
          await qsePresale.estimatedTokenAmountAvailableWithETH(
            ethAmount,
            roundId
          );
        return Number(ethers.formatUnits(tokenAmount, 18));
      }

      if (coinAddress) {
        const coinContract = new ethers.Contract(
          coinAddress,
          ["function decimals() view returns (uint8)"],
          provider
        );
        const decimals = await coinContract.decimals();
        const coinAmount = ethers.parseUnits(amount, decimals);
        const tokenAmount =
          await qsePresale.estimatedTokenAmountAvailableWithCoin(
            coinAmount,
            coinAddress,
            roundId
          );
        return Number(ethers.formatUnits(tokenAmount, 18));
      }

      return 0;
    } catch (error) {
      console.error("Error in getQSEAmountFromPayment:", error);
      return 0;
    }
  };

  const getRounds = async () => {
    if (!qsePresale) {
      console.error("qsePresale not initialized");
      return [];
    }
    const rounds = [];
    try {
      for (let i = 1; i <= 10; i++) {
        const round = await qsePresale.getRound(BigInt(i));
        if (round.startTime > 0) {
          rounds.push({
            roundId: Number(round.roundId),
            tokenPrice: Number(round.tokenPrice) / 1e6,
            tokenAmount: Number(round.tokenAmount) / 1e18,
            startTime: Number(round.startTime),
            endTime: Number(round.endTime),
            soldAmount: Number(round.soldAmount) / 1e18,
          });
        } else {
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      setNetworkError("Failed to fetch presale rounds");
    }
    return rounds;
  };

  const getTokensAvailable = async (roundId: number): Promise<string> => {
    if (!qsePresale) return "0";
    try {
      const tokens = await qsePresale.getTokensAvailable(roundId);
      return ethers.formatUnits(tokens, 18);
    } catch (error) {
      console.error("Error fetching tokens available:", error);
      return "0";
    }
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
        .catch((error) => {
          console.error("Error listing accounts:", error);
          setNetworkError("Failed to connect to wallet");
        });

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
    } else {
      setNetworkError("No Ethereum wallet detected. Please install MetaMask.");
    }
  }, []);

  const loadQSEBalance = async () => {
    if (!qseToken || !account) {
      setQseBalance("0");
      return;
    }
    try {
      if (!qseToken || !account) {
        console.warn("qseToken or account is not initialized");
        setQseBalance("0");
        return;
      }
      const balance = await qseToken.balanceOf(account);
      setQseBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error loading QSE balance:", error);
      setQseBalance("0");
    }
  };

  const switchToArbitrumSepolia = async () => {
    if (!window.ethereum) {
      setNetworkError("MetaMask or compatible wallet not detected");
      return false;
    }
    setNetworkError(null);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x66eee" }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x66eee",
                chainName: "Arbitrum Sepolia",
                nativeCurrency: {
                  name: "Arbitrum ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
                blockExplorerUrls: ["https://sepolia.arbiscan.io"],
              },
            ],
          });
          return true;
        } catch (addError) {
          setNetworkError("Failed to add Arbitrum Sepolia network");
          return false;
        }
      } else if (switchError.code === 4001) {
        setNetworkError("Please switch to Arbitrum Sepolia network");
        return false;
      }
      setNetworkError("Failed to switch to Arbitrum Sepolia network");
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

      if (network.chainId !== BigInt(arbitrumSepolia.id)) {
        setNetworkError("Please switch to Arbitrum Sepolia network");
        const switched = await switchToArbitrumSepolia();
        if (!switched) throw new Error("Network switch failed");
        const updatedNetwork = await ethProvider.getNetwork();
        if (updatedNetwork.chainId !== BigInt(arbitrumSepolia.id)) {
          setNetworkError("Please manually switch to Arbitrum Sepolia");
          throw new Error("Network switch failed");
        }
        setNetworkError(null);
      }

      if (QSE_TOKEN_ADDRESS) {
        const token = new ethers.Contract(
          QSE_TOKEN_ADDRESS,
          QSEArtifact.abi,
          signer
        );
        setQseToken(token);
        await loadQSEBalance();
        try {
          const burnRate = await token.TRANSACTION_BURN_RATE();
          setBurnRate(Number(burnRate));
        } catch {
          console.warn("TRANSACTION_BURN_RATE not available on token contract");
        }
      }

      if (QSE_PRESALE_ADDRESS) {
        const presale = new ethers.Contract(
          QSE_PRESALE_ADDRESS,
          QSEPresaleArtifact.abi,
          signer
        );
        setQsePresale(presale);
        await loadContractData(presale);
      }
    } catch (error: any) {
      console.error("Error initializing provider:", error);
      setNetworkError(
        error.message || "Failed to initialize blockchain connection"
      );
    }
  };

  const loadContractData = async (presale: ethers.Contract) => {
    try {
      const roundId = 1; // Default to round 1; update based on active round in production
      const roundExists = await presale.roundExists(roundId); // Ensure the contract has a method to check if a round exists
      if (!roundExists) {
        throw new Error(`Round with ID ${roundId} does not exist`);
      }
      const round = await presale.rounds(roundId);
      const tgeTime = await presale.tgeTime();
      const isTgeSet = await presale.isTgeSet();

      setCurrentRound({
        roundId: Number(round.roundId),
        tokenPrice: Number(round.tokenPrice) / 1e6,
        tokenAmount: Number(round.tokenAmount) / 1e18,
        startTime: Number(round.startTime),
        endTime: Number(round.endTime),
        soldAmount: Number(round.soldAmount) / 1e18,
      });
      setTokenPrice(Number(round.tokenPrice) / 1e6);
      setTgeTime(Number(tgeTime));
      setIsTgeSet(isTgeSet);
    } catch (error) {
      console.error("Error loading contract data:", error);
      setNetworkError("Failed to load contract data");
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setSigner(null);
      setQseToken(null);
      setQsePresale(null);
      setIsConnected(false);
      setQseBalance("0");
      setCurrentRound(null);
      setTgeTime(0);
      setIsTgeSet(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      if (provider) {
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(arbitrumSepolia.id)) {
          setNetworkError("Please switch to Arbitrum Sepolia network");
          await switchToArbitrumSepolia();
        }
        provider
          .getSigner()
          .then((newSigner) => {
            setSigner(newSigner);
            if (QSE_TOKEN_ADDRESS) {
              const tokenContract = new ethers.Contract(
                QSE_TOKEN_ADDRESS,
                QSEArtifact.abi,
                newSigner
              );
              setQseToken(tokenContract);
              loadQSEBalance();
            }
            if (QSE_PRESALE_ADDRESS) {
              const presale = new ethers.Contract(
                QSE_PRESALE_ADDRESS,
                QSEPresaleArtifact.abi,
                newSigner
              );
              setQsePresale(presale);
              loadContractData(presale).catch((err) => {
                setNetworkError(
                  "Failed to load contract data: " +
                    (err.message || "Unknown error")
                );
              });
            }
          })
          .catch((error) => {
            console.error("Error getting signer:", error);
            setNetworkError("Failed to initialize signer");
          });
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!provider || !window.ethereum) {
      setNetworkError("MetaMask or compatible wallet not detected");
      return false;
    }
    setIsConnecting(true);
    setNetworkError(null);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(arbitrumSepolia.id)) {
        const switched = await switchToArbitrumSepolia();
        if (!switched) {
          setNetworkError("Please switch to Arbitrum Sepolia network");
          return false;
        }
      }
      await handleAccountsChanged(accounts);
      return accounts.length > 0;
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) setNetworkError("Wallet connection rejected");
      else
        setNetworkError(
          "Failed to connect wallet: " + (error.message || "Unknown error")
        );
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const buyTokens = async (
    amount: string,
    paymentMethod: PaymentMethod,
    roundId: number
  ) => {
    if (!signer || !qsePresale || !account) {
      return {
        success: false,
        message: "Wallet not connected or contract not initialized",
      };
    }
    try {
      if (chainId !== arbitrumSepolia.id) {
        setNetworkError("Please switch to Arbitrum Sepolia network");
        const switched = await switchToArbitrumSepolia();
        if (!switched)
          return {
            success: false,
            message: "Please switch to Arbitrum Sepolia network",
          };
      }

      const round = await qsePresale.rounds(roundId);
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenAmount = await getQSEAmountFromPayment(
        amount,
        paymentMethod,
        roundId
      );
      const tokenAmountWei = ethers.parseUnits(tokenAmount.toString(), 18);
      const tokensAvailable = await qsePresale.getTokensAvailable(roundId);

      if (currentTime < Number(round.startTime))
        return {
          success: false,
          message: "The token sale has not yet started",
        };
      if (currentTime > Number(round.endTime))
        return { success: false, message: "The token sale has ended" };
      if (tokenAmountWei > tokensAvailable)
        return {
          success: false,
          message: "Insufficient tokens available in presale",
        };

      let tx;
      if (paymentMethod === "ETH") {
        const ethAmount = ethers.parseEther(amount);
        tx = await qsePresale.buyWithETH(roundId, {
          value: ethAmount,
          gasLimit: 500000,
        });
      } else {
        let coinAddress = "";
        let decimals = 6;
        if (paymentMethod === "USDT")
          coinAddress =
            chainId === 42161
              ? STABLECOINS.USDT.mainnet
              : STABLECOINS.USDT.sepolia;
        if (paymentMethod === "USDC")
          coinAddress =
            chainId === 42161
              ? STABLECOINS.USDC.mainnet
              : STABLECOINS.USDC.sepolia;
        if (paymentMethod === "DAI")
          coinAddress =
            chainId === 42161
              ? STABLECOINS.DAI.mainnet
              : STABLECOINS.DAI.sepolia;

        const coinContract = new ethers.Contract(
          coinAddress,
          [
            "function decimals() view returns (uint8)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
          ],
          signer
        );
        decimals = await coinContract.decimals();
        const coinAmount = ethers.parseUnits(amount, decimals);
        const allowance = await coinContract.allowance(
          account,
          QSE_PRESALE_ADDRESS
        );

        if (allowance < coinAmount) {
          const approveTx = await coinContract.approve(
            QSE_PRESALE_ADDRESS,
            coinAmount,
            { gasLimit: 100000 }
          );
          await approveTx.wait();
        }

        if (paymentMethod === "USDT")
          tx = await qsePresale.buyWithUSDT(tokenAmountWei, roundId, {
            gasLimit: 300000,
          });
        else if (paymentMethod === "USDC")
          tx = await qsePresale.buyWithUSDC(tokenAmountWei, roundId, {
            gasLimit: 300000,
          });
        else if (paymentMethod === "DAI")
          tx = await qsePresale.buyWithDAI(tokenAmountWei, roundId, {
            gasLimit: 300000,
          });
      }

      const receipt = await tx.wait();
      await loadQSEBalance();
      return { success: true, message: `Transaction: ${receipt.hash}` };
    } catch (error: any) {
      console.error("Buy Tokens Error:", error);
      let errorMessage = "Transaction failed";
      if (error.code === 4001) errorMessage = "Transaction rejected by user";
      else if (error.message.includes("insufficient funds"))
        errorMessage = "Insufficient funds in your wallet";
      else if (error.message.includes("Round is not active"))
        errorMessage = "Selected round is not active";
      else if (error.message.includes("Insufficient allowance"))
        errorMessage = "Insufficient allowance for stablecoin";
      return { success: false, message: errorMessage };
    }
  };

  const claimTokens = async () => {
    if (!signer || !qsePresale || !account) {
      return {
        success: false,
        message: "Wallet not connected or contract not initialized",
      };
    }
    try {
      const isTgeSet = await qsePresale.isTgeSet();
      const tgeTime = await qsePresale.tgeTime();
      const currentTime = Math.floor(Date.now() / 1000);

      if (!isTgeSet) return { success: false, message: "TGE time not set yet" };
      if (currentTime < Number(tgeTime))
        return { success: false, message: "TGE has not occurred yet" };

      const userRounds = await qsePresale.getUserRounds(account);
      if (userRounds.length === 0)
        return { success: false, message: "No rounds to claim" };

      const tx = await qsePresale.claimTokens({ gasLimit: 500000 });
      const receipt = await tx.wait();
      await loadQSEBalance();
      return { success: true, message: `Claimed tokens: ${receipt.hash}` };
    } catch (error: any) {
      console.error("Claim Tokens Error:", error);
      let errorMessage = "Claim failed";
      if (error.code === 4001) errorMessage = "Transaction rejected by user";
      else if (error.message.includes("No tokens available to claim"))
        errorMessage = "No tokens available to claim";
      return { success: false, message: errorMessage };
    }
  };

  const getClaimableAmount = async (roundId: number) => {
    if (!qsePresale || !account) return { claimable: "0", periodsPassed: 0 };
    try {
      const result = await qsePresale.getClaimableAmount(
        account,
        BigInt(roundId)
      );
      const claimable = result[0];
      const periodsPassed = result[1];
      return {
        claimable: ethers.formatUnits(claimable, 18),
        periodsPassed: Number(periodsPassed),
      };
    } catch (error) {
      console.error("Error fetching claimable amount:", error);
      return { claimable: "0", periodsPassed: 0 };
    }
  };

  const value = {
    provider,
    signer,
    account,
    chainId,
    qseToken,
    qsePresale,
    connectWallet,
    buyTokens,
    claimTokens,
    getClaimableAmount,
    getRounds,
    getTokensAvailable,
    isConnecting,
    isConnected,
    tokenPrice,
    burnRate,
    networkError,
    switchToArbitrumSepolia,
    qseBalance,
    loadQSEBalance,
    supportedPaymentMethods,
    getQSEAmountFromPayment,
    getPaymentRateForMethod,
    currentRound,
    tgeTime,
    isTgeSet,
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
