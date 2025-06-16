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
import { arbitrumSepolia, sepolia, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import QSEArtifact from "../../contracts/QSE.json";
import QSEPrivateSaleArtifact from "../../contracts/QSEPrivatesale.json";

const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    ),
    [mainnet.id]: http(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    ),
  },
  connectors: [injected()],
});

const CONTRACTS = {
  QSE_TOKEN:
    process.env.NEXT_PUBLIC_QSE_TOKEN_ADDRESS ||
    "0x94E011e06E89660a4385762050084996990754D",
  QSE_PRESALE:
    process.env.NEXT_PUBLIC_QSE_PRESALE_ADDRESS ||
    "0x5b4Ec7FAF7A366728E94f662F69C2F6df3B43E46",
  STABLECOINS: {
    USDT:
      process.env.NEXT_PUBLIC_USDT_ADDRESS ||
      "0x4F5D783857e4e137452d38580E1d53C61b6c7a4d",
    USDC:
      process.env.NEXT_PUBLIC_USDC_ADDRESS ||
      "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    DAI:
      process.env.NEXT_PUBLIC_DAI_ADDRESS ||
      "0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357",
  },
};

const getPaymentRates = (
  currentEthPrice: number
): Record<PaymentMethod, { usdRate: number; symbol: string }> => ({
  ETH: { usdRate: currentEthPrice, symbol: "ETH" },
  USDT: { usdRate: 1, symbol: "USDT" },
  USDC: { usdRate: 1, symbol: "USDC" },
  DAI: { usdRate: 1, symbol: "DAI" },
});

export type PaymentMethod = "ETH" | "USDT" | "USDC" | "DAI";

interface Round {
  roundId: number;
  tokenPrice: number;
  tokenAmount: number;
  startTime: number;
  endTime: number;
  soldAmount: number;
}

interface Investment {
  usdtAmount: string;
  usdcAmount: string;
  daiAmount: string;
}

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  networkError: string | null;
  tokenPrice: number;
  currentRound: Round | null;
  qseBalance: string;
  fundsRaised: string;
  ethPrice: number;
  supportedPaymentMethods: PaymentMethod[];
  connectWallet: () => Promise<boolean>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  buyTokens: (
    tokenAmount: string,
    method: PaymentMethod,
    roundId: number,
    slippage?: number
  ) => Promise<{ success: boolean; message: string }>;
  getRounds: () => Promise<Round[]>;
  getTokensAvailable: (roundId: number) => Promise<string>;
  loadQSEBalance: () => Promise<void>;
  getTokenAmountFromPayment: (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ) => Promise<number>;
  getPaymentAmountForTokens: (
    tokenAmount: string,
    method: PaymentMethod,
    roundId: number
  ) => Promise<number>;
  getPaymentRateForMethod: (method: PaymentMethod) => number;
  getContractOwner: () => Promise<string | undefined>;
  createRound: (
    roundId: number,
    tokenPrice: number,
    tokenAmount: number,
    startTime: number,
    endTime: number
  ) => Promise<{ success: boolean; message: string }>;
  endRound: (roundId: number) => Promise<{ success: boolean; message: string }>;
  extendRound: (
    roundId: number,
    newEndTime: number
  ) => Promise<{ success: boolean; message: string }>;
  refundBatch: (
    roundId: number,
    batchSize: number
  ) => Promise<{ success: boolean; message: string }>;
  initiateWithdrawal: (
    roundId: number
  ) => Promise<{ success: boolean; message: string }>;
  withdraw: () => Promise<{ success: boolean; message: string }>;
  cancelWithdrawal: () => Promise<{ success: boolean; message: string }>;
  setDefaultSlippageTolerance: (
    slippageBasisPoints: number
  ) => Promise<{ success: boolean; message: string }>;
  setWallet: (
    walletAddress: string
  ) => Promise<{ success: boolean; message: string }>;
  recoverToken: (
    tokenAddress: string,
    amount: string
  ) => Promise<{ success: boolean; message: string }>;
  refundUnsoldToken: (
    roundId: number
  ) => Promise<{ success: boolean; message: string }>;
  getFundsRaised: () => Promise<string>;
  getTokenAmountForInvestor: (investor: string) => Promise<string>;
  getUserRoundTokenAmount: (
    investor: string,
    roundId: number
  ) => Promise<string>;
  getInvestments: (investor: string) => Promise<Investment>;
  getPrivateInvestors: () => Promise<string[]>;
  getRemainingTimeForPresaleStart: (roundId: number) => Promise<number>;
  getRemainingTimeForPresaleEnd: (roundId: number) => Promise<number>;
  getUserRounds: (user: string) => Promise<number[]>;
  pause: () => Promise<{ success: boolean; message: string }>;
  unpause: () => Promise<{ success: boolean; message: string }>;
  approveTokens: (
    spender: string,
    amount: string
  ) => Promise<{ success: boolean; message: string }>;
  transferTokens: (
    to: string,
    amount: string
  ) => Promise<{ success: boolean; message: string }>;
  getTokenBalance: (address: string) => Promise<string>;
  transferOwnership: (
    newOwner: string
  ) => Promise<{ success: boolean; message: string }>;
  getRound: (roundId: number) => Promise<Round | null>;
  getPauseStatus: () => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);
export const useWeb3 = () => useContext(Web3Context);

const Web3ContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [qseToken, setQseToken] = useState<ethers.Contract | null>(null);
  const [qsePresale, setQsePresale] = useState<ethers.Contract | null>(null);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [qseBalance, setQseBalance] = useState("0");
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [fundsRaised, setFundsRaised] = useState("0");
  const [ethPrice, setEthPrice] = useState(3000); // Default fallback
  const [lastEthPriceUpdate, setLastEthPriceUpdate] = useState(0);

  const supportedPaymentMethods: PaymentMethod[] = [
    "ETH",
    "USDT",
    "USDC",
    "DAI",
  ];

  const fetchEthPrice = async (): Promise<void> => {
    try {
      const now = Date.now();
      // Only fetch if it's been more than 5 minutes since last update
      if (now - lastEthPriceUpdate < 5 * 60 * 1000) {
        return;
      }

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();

      if (data.ethereum && data.ethereum.usd) {
        setEthPrice(data.ethereum.usd);
        setLastEthPriceUpdate(now);
      }
    } catch (error) {
      console.warn(
        "Failed to fetch ETH price, using previous value:",
        ethPrice
      );
      // Keep using the previous ethPrice value
    }
  };

  // Define supported chain IDs as a more specific type
  const supportedChainIds = [
    arbitrumSepolia.id,
    sepolia.id,
    mainnet.id,
  ] as const;
  type SupportedChainId = (typeof supportedChainIds)[number];

  const getCurrentActiveRound = async (
    rounds: Round[]
  ): Promise<Round | null> => {
    const currentTime = Math.floor(Date.now() / 1000);
    return (
      rounds.find(
        (round) =>
          currentTime >= round.startTime && currentTime <= round.endTime
      ) || null
    );
  };

  const initializeContracts = async (signer: ethers.JsonRpcSigner) => {
    try {
      const provider = signer.provider;
      const network = await provider.getNetwork();

      // Check if the chainId is in our supported list
      const chainId = Number(network.chainId);
      if (!supportedChainIds.includes(chainId as SupportedChainId)) {
        setNetworkError(
          "Please switch to a supported network: Arbitrum Sepolia, Ethereum Sepolia, or Ethereum Mainnet"
        );
        return;
      }

      const codeAtToken = await provider.getCode(CONTRACTS.QSE_TOKEN);
      const codeAtPresale = await provider.getCode(CONTRACTS.QSE_PRESALE);
      if (codeAtToken === "0x" || codeAtPresale === "0x") {
        setNetworkError("Contracts not deployed on this network");
        return;
      }

      const token = new ethers.Contract(
        CONTRACTS.QSE_TOKEN,
        QSEArtifact.abi,
        signer
      );
      const presale = new ethers.Contract(
        CONTRACTS.QSE_PRESALE,
        QSEPrivateSaleArtifact.abi,
        signer
      );

      setQseToken(token);
      setQsePresale(presale);

      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
      if (activeRound) {
        setTokenPrice(Number(ethers.formatUnits(activeRound.tokenPrice, 6)));
      }

      await loadQSEBalance();
      await loadFundsRaised();
      await fetchEthPrice();
      setupEventListeners(presale);
    } catch (error) {
      setNetworkError(
        `Failed to initialize contracts: ${(error as Error).message}`
      );
    }
  };

  const setupEventListeners = (presale: ethers.Contract) => {
    presale.on("RoundCreated", async () => {
      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
      if (activeRound) {
        setTokenPrice(Number(ethers.formatUnits(activeRound.tokenPrice, 6)));
      }
    });

    presale.on("TokensBought", async (buyer: string) => {
      if (buyer.toLowerCase() === account?.toLowerCase()) {
        await loadQSEBalance();
      }
      await loadFundsRaised();
      await fetchEthPrice();
    });

    presale.on("RoundEnded", async () => {
      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
    });

    presale.on("RoundExtended", async () => {
      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
    });

    presale.on("FundsRefunded", async () => {
      await loadFundsRaised();
      await fetchEthPrice();
    });

    presale.on("FundsWithdrawn", async () => {
      await loadFundsRaised();
      await fetchEthPrice();
    });

    presale.on("Paused", async () => {
      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
    });

    presale.on("Unpaused", async () => {
      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
    });
  };

  // Rename the function to be more generic
  const switchNetwork = async (chainId: number): Promise<boolean> => {
    if (!window.ethereum) {
      setNetworkError("MetaMask not detected");
      return false;
    }

    // Convert chainId to hex format
    const chainIdHex = `0x${chainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      setNetworkError(null);
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          // If the chain isn't added, add it
          if (chainId === arbitrumSepolia.id) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: "Arbitrum Sepolia",
                  nativeCurrency: {
                    name: "Arbitrum Sepolia ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://arbitrum-sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df",
                  ],
                  blockExplorerUrls: ["https://sepolia.arbiscan.io"],
                },
              ],
            });
          } else if (chainId === sepolia.id) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: "Ethereum Sepolia",
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
          }
          setNetworkError(null);
          return true;
        } catch (addError) {
          setNetworkError(`Failed to add network`);
          return false;
        }
      }
      setNetworkError("Failed to switch network");
      return false;
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      setNetworkError("MetaMask not detected");
      return false;
    }
    setIsConnecting(true);
    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      if (!accounts.length) {
        setNetworkError("No accounts found");
        return false;
      }
      const network = await ethProvider.getNetwork();
      const chainId = Number(network.chainId);

      // Type assertion to check if chainId is one of our supported IDs
      if (!supportedChainIds.includes(chainId as SupportedChainId)) {
        // You could let user select which network they want to switch to
        // or default to one of them
        const switched = await switchNetwork(arbitrumSepolia.id);
        if (!switched) {
          setNetworkError("Please switch to a supported network");
          return false;
        }
      }
      const signer = await ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(signer);
      setAccount(accounts[0]);
      setIsConnected(true);
      setNetworkError(null);
      await initializeContracts(signer);
      return true;
    } catch (error) {
      setNetworkError(`Wallet connection failed: ${(error as Error).message}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const loadQSEBalance = async () => {
    if (!qseToken || !account) {
      setQseBalance("0");
      return;
    }
    try {
      const balance = await qseToken.balanceOf(account);
      setQseBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      setQseBalance("0");
      setNetworkError(`Failed to load balance: ${(error as Error).message}`);
    }
  };

  const loadFundsRaised = async () => {
    if (!qsePresale) {
      setFundsRaised("0");
      return;
    }
    try {
      const funds = await qsePresale.getFundsRaised();
      setFundsRaised(ethers.formatUnits(funds, 6));
    } catch (error) {
      setFundsRaised("0");
      setNetworkError(
        `Failed to load funds raised: ${(error as Error).message}`
      );
    }
  };

  const getTokenAmountFromPayment = async (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ): Promise<number> => {
    if (
      !qsePresale ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      return 0;
    }
    try {
      if (method === "ETH") {
        const ethAmount = ethers.parseEther(amount);
        const tokenAmount =
          await qsePresale.estimatedTokenAmountAvailableWithETH(
            ethAmount,
            roundId
          );
        return Number(ethers.formatUnits(tokenAmount, 18));
      }
      const coinAddress = CONTRACTS.STABLECOINS[method];
      if (!coinAddress) return 0;
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
    } catch (error) {
      setNetworkError(`Failed to estimate tokens: ${(error as Error).message}`);
      return 0;
    }
  };

  const getPaymentAmountForTokens = async (
    tokenAmount: string,
    method: PaymentMethod,
    roundId: number
  ): Promise<number> => {
    if (
      !qsePresale ||
      !tokenAmount ||
      isNaN(parseFloat(tokenAmount)) ||
      parseFloat(tokenAmount) <= 0
    ) {
      return 0;
    }
    try {
      const tokens = ethers.parseUnits(tokenAmount, 18);
      if (method === "ETH") {
        const ethAmount = await qsePresale.estimatedEthAmountForTokenAmount(
          tokens,
          roundId
        );
        return Number(ethers.formatUnits(ethAmount, 18));
      }
      const coinAddress = CONTRACTS.STABLECOINS[method];
      if (!coinAddress) return 0;
      const coinContract = new ethers.Contract(
        coinAddress,
        ["function decimals() view returns (uint8)"],
        provider
      );
      const decimals = await coinContract.decimals();
      const coinAmount = await qsePresale.estimatedCoinAmountForTokenAmount(
        tokens,
        coinAddress,
        roundId
      );
      return Number(ethers.formatUnits(coinAmount, decimals));
    } catch (error) {
      setNetworkError(
        `Failed to estimate payment amount: ${(error as Error).message}`
      );
      return 0;
    }
  };

  const getRounds = async (): Promise<Round[]> => {
    if (!qsePresale) return [];
    const rounds: Round[] = [];
    try {
      const currentProvider = signer?.provider || provider;
      if (!currentProvider) return [];

      const presaleContract = new ethers.Contract(
        CONTRACTS.QSE_PRESALE,
        QSEPrivateSaleArtifact.abi,
        currentProvider
      );

      // Get the current block number
      const currentBlock = await currentProvider.getBlockNumber();

      // Get all RoundCreated events from block 0 to current block
      const roundCreatedFilter = presaleContract.filters.RoundCreated();
      const events = await presaleContract.queryFilter(
        roundCreatedFilter,
        0,
        currentBlock
      );

      // Process each event to get round details
      for (const event of events) {
        if ("args" in event) {
          const roundId = Number(event.args[0]);
          const round = await presaleContract.getRound(roundId);

          if (
            round &&
            round.tokenPrice &&
            round.tokenPrice.toString() !== "0"
          ) {
            rounds.push({
              roundId: Number(round.roundId),
              tokenPrice: Number(round.tokenPrice),
              tokenAmount: Number(round.tokenAmount),
              startTime: Number(round.startTime),
              endTime: Number(round.endTime),
              soldAmount: Number(round.soldAmount),
            });
          }
        }
      }

      // Format the values after all rounds are fetched
      rounds.forEach((round) => {
        round.tokenPrice = round.tokenPrice / 1e6;
        round.tokenAmount = round.tokenAmount / 1e18;
        round.soldAmount = round.soldAmount / 1e18;
      });

      // Only update state if we have rounds
      if (rounds.length > 0) {
        const activeRound = await getCurrentActiveRound(rounds);
        setCurrentRound(activeRound);
        if (activeRound) setTokenPrice(activeRound.tokenPrice);
      } else {
        setCurrentRound(null);
        setTokenPrice(0);
      }

      return rounds;
    } catch (error: any) {
      console.error("Error fetching rounds:", error);
      return [];
    }
  };

  const getTokensAvailable = async (roundId: number): Promise<string> => {
    if (!qsePresale) return "0";
    try {
      const tokens = await qsePresale.getTokensAvailable(roundId);
      return ethers.formatUnits(tokens, 18);
    } catch (error) {
      setNetworkError(
        `Failed to fetch available tokens: ${(error as Error).message}`
      );
      return "0";
    }
  };

  const buyTokens = async (
    tokenAmount: string,
    method: PaymentMethod,
    roundId: number,
    slippage: number = 300
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (
      !tokenAmount ||
      isNaN(parseFloat(tokenAmount)) ||
      parseFloat(tokenAmount) <= 0
    ) {
      return { success: false, message: "Invalid token amount" };
    }
    try {
      const round = await qsePresale.getRound(roundId);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < Number(round.startTime)) {
        return { success: false, message: "Sale not started" };
      }
      if (currentTime > Number(round.endTime)) {
        return { success: false, message: "Sale ended" };
      }
      const tokensAvailable = await qsePresale.getTokensAvailable(roundId);
      const tokens = ethers.parseUnits(tokenAmount, 18);
      if (tokens > tokensAvailable) {
        return { success: false, message: "Insufficient tokens available" };
      }

      let tx;
      if (method === "ETH") {
        const ethAmount = await qsePresale.estimatedEthAmountForTokenAmount(
          tokens,
          roundId
        );
        tx = await qsePresale.buyWithETH(roundId, slippage, {
          value: ethAmount,
          gasLimit: 600000,
        });
      } else {
        const coinAddress = CONTRACTS.STABLECOINS[method];
        if (!coinAddress) {
          return { success: false, message: "Invalid payment method" };
        }
        const coinContract = new ethers.Contract(
          coinAddress,
          [
            "function decimals() view returns (uint8)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function balanceOf(address owner) view returns (uint256)",
          ],
          signer
        );
        const decimals = await coinContract.decimals();
        const coinAmount = await qsePresale.estimatedCoinAmountForTokenAmount(
          tokens,
          coinAddress,
          roundId
        );
        const balance = await coinContract.balanceOf(account);
        if (balance < coinAmount) {
          return { success: false, message: `Insufficient ${method} balance` };
        }
        const allowance = await coinContract.allowance(
          account,
          CONTRACTS.QSE_PRESALE
        );
        if (allowance < coinAmount) {
          const approveTx = await coinContract.approve(
            CONTRACTS.QSE_PRESALE,
            coinAmount,
            {
              gasLimit: 100000,
            }
          );
          await approveTx.wait();
        }
        const methodMap: Record<PaymentMethod, string | undefined> = {
          USDT: "buyWithUSDT",
          USDC: "buyWithUSDC",
          DAI: "buyWithDAI",
          ETH: undefined,
        };
        const buyMethod = methodMap[method];
        if (!buyMethod) {
          return { success: false, message: "Unsupported payment method" };
        }
        tx = await qsePresale[buyMethod](tokens, roundId, {
          gasLimit: 400000,
        });
      }
      const receipt = await tx.wait();
      await loadQSEBalance();
      await loadFundsRaised();
      await fetchEthPrice();
      return {
        success: true,
        message: `Purchased ${tokenAmount} QSE tokens: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message =
        error.code === "ACTION_REJECTED"
          ? "Transaction was cancelled"
          : error.message.includes("insufficient funds")
            ? "Not enough funds to complete the transaction"
            : error.message.includes("paused")
              ? "Token sale is currently paused"
              : error.message.includes("execution reverted")
                ? "Transaction failed - please try again"
                : error.message.includes("user rejected")
                  ? "Transaction was rejected"
                  : "Unable to complete the transaction - please try again";
      return { success: false, message };
    }
  };

  const createRound = async (
    roundId: number,
    tokenPrice: number,
    tokenAmount: number,
    startTime: number,
    endTime: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (
      roundId <= 0 ||
      tokenPrice <= 0 ||
      tokenAmount <= 0 ||
      startTime >= endTime ||
      startTime < Math.floor(Date.now() / 1000)
    ) {
      return { success: false, message: "Invalid round parameters" };
    }
    try {
      const tokenPriceWei = ethers.parseUnits(tokenPrice.toString(), 6);
      const tokenAmountWei = ethers.parseUnits(tokenAmount.toString(), 18);
      const balance = await qseToken?.balanceOf(account);
      if (!balance || balance < tokenAmountWei) {
        return { success: false, message: "Insufficient QSE token balance" };
      }
      const allowance = await qseToken?.allowance(
        account,
        CONTRACTS.QSE_PRESALE
      );
      if (!allowance || allowance < tokenAmountWei) {
        const approveTx = await qseToken?.approve(
          CONTRACTS.QSE_PRESALE,
          tokenAmountWei,
          {
            gasLimit: 100000,
          }
        );
        await approveTx?.wait();
      }
      const tx = await qsePresale.createRound(
        roundId,
        tokenPriceWei,
        tokenAmountWei,
        startTime,
        endTime,
        {
          gasLimit: 400000,
        }
      );
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Round ${roundId} created: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("Round already exists")
        ? "Round ID already exists"
        : error.message.includes("NotOwner")
          ? "Only contract owner can create rounds"
          : `Failed to create round: ${error.message}`;
      return { success: false, message };
    }
  };

  const endRound = async (
    roundId: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.endRound(roundId, { gasLimit: 200000 });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Round ${roundId} ended: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can end rounds"
        : error.message.includes("Round is not active")
          ? "Round is not active"
          : `Failed to end round: ${error.message}`;
      return { success: false, message };
    }
  };

  const extendRound = async (
    roundId: number,
    newEndTime: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (newEndTime <= Math.floor(Date.now() / 1000)) {
      return { success: false, message: "New end time must be in the future" };
    }
    try {
      const tx = await qsePresale.extendRound(roundId, newEndTime, {
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Round ${roundId} extended: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can extend rounds"
        : error.message.includes("Round is not active")
          ? "Round is not active"
          : `Failed to extend round: ${error.message}`;
      return { success: false, message };
    }
  };

  const refundBatch = async (
    roundId: number,
    batchSize: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (batchSize <= 0) {
      return { success: false, message: "Invalid batch size" };
    }
    try {
      const tx = await qsePresale.refundBatch(roundId, batchSize, {
        gasLimit: 600000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Batch refund processed: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can refund"
        : error.message.includes("presale is still in progress")
          ? "Round is still active"
          : `Failed to refund batch: ${error.message}`;
      return { success: false, message };
    }
  };

  const initiateWithdrawal = async (
    roundId: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.initiateWithdrawal(roundId, {
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Withdrawal initiated for round ${roundId}: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can initiate withdrawal"
        : error.message.includes("Withdrawal already initiated")
          ? "Withdrawal already initiated"
          : error.message.includes("Wallet not set")
            ? "Withdrawal wallet not set"
            : `Failed to initiate withdrawal: ${error.message}`;
      return { success: false, message };
    }
  };

  const withdraw = async (): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.withdraw({ gasLimit: 400000 });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Funds withdrawn: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can withdraw"
        : error.message.includes("Withdrawal not initiated")
          ? "Withdrawal not initiated"
          : error.message.includes("Timelock period not ended")
            ? "Withdrawal timelock not ended"
            : error.message.includes("No funds available")
              ? "No funds to withdraw"
              : `Failed to withdraw: ${error.message}`;
      return { success: false, message };
    }
  };

  const cancelWithdrawal = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.cancelWithdrawal({ gasLimit: 200000 });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Withdrawal cancelled: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can cancel withdrawal"
        : error.message.includes("No withdrawal to cancel")
          ? "No withdrawal to cancel"
          : `Failed to cancel withdrawal: ${error.message}`;
      return { success: false, message };
    }
  };

  const setDefaultSlippageTolerance = async (
    slippageBasisPoints: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (slippageBasisPoints <= 0 || slippageBasisPoints > 2000) {
      return { success: false, message: "Invalid slippage value" };
    }
    try {
      const tx = await qsePresale.setDefaultSlippageTolerance(
        slippageBasisPoints,
        { gasLimit: 200000 }
      );
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Slippage tolerance set to ${slippageBasisPoints} basis points: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can set slippage"
        : error.message.includes("Exceeds maximum")
          ? "Slippage exceeds maximum allowed"
          : `Failed to set slippage tolerance: ${error.message}`;
      return { success: false, message };
    }
  };

  const setWallet = async (
    walletAddress: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (!ethers.isAddress(walletAddress)) {
      return { success: false, message: "Invalid wallet address" };
    }
    try {
      const tx = await qsePresale.setWallet(walletAddress, {
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Wallet set to ${walletAddress}: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can set wallet"
        : error.message.includes("Invalid address")
          ? "Invalid wallet address"
          : `Failed to set wallet: ${error.message}`;
      return { success: false, message };
    }
  };

  const recoverToken = async (
    tokenAddress: string,
    amount: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    if (
      !ethers.isAddress(tokenAddress) ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      return { success: false, message: "Invalid token address or amount" };
    }
    try {
      const coinContract = new ethers.Contract(
        tokenAddress,
        ["function decimals() view returns (uint8)"],
        signer
      );
      const decimals = await coinContract.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);
      const tx = await qsePresale.recoverToken(tokenAddress, amountWei, {
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Recovered ${amount} tokens: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can recover tokens"
        : error.message.includes("Cannot recover presale token")
          ? "Cannot recover QSE tokens"
          : `Failed to recover token: ${error.message}`;
      return { success: false, message };
    }
  };

  const refundUnsoldToken = async (
    roundId: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.refundUnsoldToken(roundId, {
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Unsold tokens refunded for round ${roundId}: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can refund tokens"
        : error.message.includes("Round not ended")
          ? "Round has not ended"
          : error.message.includes("No unsold tokens")
            ? "No unsold tokens to refund"
            : `Failed to refund unsold tokens: ${error.message}`;
      return { success: false, message };
    }
  };

  const getFundsRaised = async (): Promise<string> => {
    if (!qsePresale) return "0";
    try {
      const funds = await qsePresale.getFundsRaised();
      return ethers.formatUnits(funds, 6);
    } catch (error) {
      setNetworkError(
        `Failed to fetch funds raised: ${(error as Error).message}`
      );
      return "0";
    }
  };

  const getTokenAmountForInvestor = async (
    investor: string
  ): Promise<string> => {
    if (!qsePresale || !ethers.isAddress(investor)) return "0";
    try {
      const amount = await qsePresale.getTokenAmountForInvestor(investor);
      return ethers.formatUnits(amount, 18);
    } catch (error) {
      setNetworkError(
        `Failed to fetch investor tokens: ${(error as Error).message}`
      );
      return "0";
    }
  };

  const getUserRoundTokenAmount = async (
    investor: string,
    roundId: number
  ): Promise<string> => {
    if (!qsePresale || !ethers.isAddress(investor)) return "0";
    try {
      const amount = await qsePresale.getUserRoundTokenAmount(
        investor,
        roundId
      );
      return ethers.formatUnits(amount, 18);
    } catch (error) {
      setNetworkError(
        `Failed to fetch round tokens: ${(error as Error).message}`
      );
      return "0";
    }
  };

  const getInvestments = async (investor: string): Promise<Investment> => {
    if (!qsePresale || !ethers.isAddress(investor)) {
      return { usdtAmount: "0", usdcAmount: "0", daiAmount: "0" };
    }
    try {
      const [usdtAmount, usdcAmount, daiAmount] =
        await qsePresale.getInvestments(investor);
      return {
        usdtAmount: ethers.formatUnits(usdtAmount, 6),
        usdcAmount: ethers.formatUnits(usdcAmount, 6),
        daiAmount: ethers.formatUnits(daiAmount, 18),
      };
    } catch (error) {
      setNetworkError(
        `Failed to fetch investments: ${(error as Error).message}`
      );
      return { usdtAmount: "0", usdcAmount: "0", daiAmount: "0" };
    }
  };

  const getPrivateInvestors = async (): Promise<string[]> => {
    if (!qsePresale) return [];
    try {
      return await qsePresale.getPrivateInvestors();
    } catch (error) {
      setNetworkError(`Failed to fetch investors: ${(error as Error).message}`);
      return [];
    }
  };

  const getRemainingTimeForPresaleStart = async (
    roundId: number
  ): Promise<number> => {
    if (!qsePresale) return 0;
    try {
      const time = await qsePresale.getRemainingTimeForPresaleStart(roundId);
      return Number(time);
    } catch (error) {
      setNetworkError(
        `Failed to fetch start time: ${(error as Error).message}`
      );
      return 0;
    }
  };

  const getRemainingTimeForPresaleEnd = async (
    roundId: number
  ): Promise<number> => {
    if (!qsePresale) return 0;
    try {
      const time = await qsePresale.getRemainingTimeForPresaleEnd(roundId);
      return Number(time);
    } catch (error) {
      setNetworkError(`Failed to fetch end time: ${(error as Error).message}`);
      return 0;
    }
  };

  const getUserRounds = async (user: string): Promise<number[]> => {
    if (!qsePresale || !ethers.isAddress(user)) return [];
    try {
      const rounds = await qsePresale.getUserRounds(user);
      return rounds.map((r: ethers.BigNumberish) => Number(r));
    } catch (error) {
      setNetworkError(
        `Failed to fetch user rounds: ${(error as Error).message}`
      );
      return [];
    }
  };

  const pause = async (): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.pause({ gasLimit: 200000 });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Contract paused: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can pause"
        : `Failed to pause contract: ${error.message}`;
      return { success: false, message };
    }
  };

  const unpause = async (): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.unpause({ gasLimit: 200000 });
      const receipt = await tx.wait();
      return {
        success: true,
        message: `Contract unpaused: ${receipt.transactionHash}`,
      };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can unpause"
        : `Failed to unpause contract: ${error.message}`;
      return { success: false, message };
    }
  };

  // New Token Management Functions
  const approveTokens = async (
    spender: string,
    amount: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qseToken || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await qseToken.approve(spender, amountWei, {
        gasLimit: 100000,
      });
      await tx.wait();
      return {
        success: true,
        message: `Approved ${amount} tokens for ${spender}`,
      };
    } catch (error: any) {
      const message = error.message.includes("insufficient")
        ? "Insufficient token balance"
        : `Failed to approve tokens: ${error.message}`;
      return { success: false, message };
    }
  };

  const transferTokens = async (
    to: string,
    amount: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qseToken || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await qseToken.transfer(to, amountWei, {
        gasLimit: 100000,
      });
      await tx.wait();
      return {
        success: true,
        message: `Transferred ${amount} tokens to ${to}`,
      };
    } catch (error: any) {
      const message = error.message.includes("insufficient")
        ? "Insufficient token balance"
        : `Failed to transfer tokens: ${error.message}`;
      return { success: false, message };
    }
  };

  const getTokenBalance = async (address: string): Promise<string> => {
    if (!qseToken) return "0";
    try {
      const balance = await qseToken.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error("Failed to get token balance:", error);
      return "0";
    }
  };

  const getPauseStatus = async (): Promise<boolean> => {
    if (!qsePresale) return false;
    try {
      return await qsePresale.paused();
    } catch (error) {
      console.error("Failed to get pause status:", error);
      return false;
    }
  };

  const transferOwnership = async (
    newOwner: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!signer || !qsePresale || !account) {
      return { success: false, message: "Wallet not connected" };
    }
    try {
      const tx = await qsePresale.transferOwnership(newOwner, {
        gasLimit: 100000,
      });
      await tx.wait();
      return { success: true, message: `Ownership transferred to ${newOwner}` };
    } catch (error: any) {
      const message = error.message.includes("NotOwner")
        ? "Only contract owner can transfer ownership"
        : `Failed to transfer ownership: ${error.message}`;
      return { success: false, message };
    }
  };

  const getRound = async (roundId: number): Promise<Round | null> => {
    if (!qsePresale) return null;
    try {
      const round = await qsePresale.getRound(roundId);

      if (!round || !round.tokenPrice || round.tokenPrice.toString() === "0") {
        return null;
      }

      return {
        roundId: Number(round.roundId),
        tokenPrice: Number(ethers.formatUnits(round.tokenPrice, 6)),
        tokenAmount: Number(ethers.formatUnits(round.tokenAmount, 18)),
        startTime: Number(round.startTime),
        endTime: Number(round.endTime),
        soldAmount: Number(ethers.formatUnits(round.soldAmount, 18)),
      };
    } catch (error) {
      console.error("Failed to get round:", error);
      return null;
    }
  };

  useEffect(() => {
    // Fetch ETH price on mount
    fetchEthPrice();

    // Set up interval to fetch ETH price every 5 minutes
    const interval = setInterval(fetchEthPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!window.ethereum) {
      setNetworkError("MetaMask not detected");
      return;
    }
    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    const checkAccounts = async () => {
      try {
        const accounts = await ethProvider.listAccounts();
        if (accounts.length) {
          setAccount(accounts[0].address);
          setIsConnected(true);
          setProvider(ethProvider);
          const signer = await ethProvider.getSigner();
          setSigner(signer);
          await initializeContracts(signer);
        }
      } catch (error) {
        setNetworkError(
          `Failed to check accounts: ${(error as Error).message}`
        );
      }
    };
    checkAccounts();

    window.ethereum?.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        // Disconnected
        setAccount(null);
        setIsConnected(false);
        setQseToken(null);
        setQsePresale(null);
        setQseBalance("0");
        setFundsRaised("0");
        setCurrentRound(null);
        setTokenPrice(0);
        setSigner(null);
        setProvider(null);
      } else {
        // New account connected
        const signer = await ethProvider.getSigner();
        setAccount(accounts[0]);
        setIsConnected(true);
        setSigner(signer);
        await initializeContracts(signer);
      }
    });

    window.ethereum?.on("chainChanged", () => {
      window.location.reload();
    });

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, []);

  const value: Web3ContextType = {
    account,
    isConnected,
    isConnecting,
    networkError,
    tokenPrice,
    currentRound,
    qseBalance,
    fundsRaised,
    ethPrice,
    supportedPaymentMethods,
    connectWallet,
    switchNetwork,
    buyTokens,
    getRounds,
    getTokensAvailable,
    loadQSEBalance,
    getTokenAmountFromPayment,
    getPaymentAmountForTokens,
    getPaymentRateForMethod: (method) =>
      getPaymentRates(ethPrice)[method].usdRate,
    getContractOwner: async () => {
      if (!qsePresale) return undefined;
      try {
        const owner = await qsePresale.getOwner();
        console.log("Contract Owner Address:", owner);
        return owner;
      } catch (error) {
        setNetworkError(`Failed to fetch owner: ${(error as Error).message}`);
        return undefined;
      }
    },
    createRound,
    endRound,
    extendRound,
    refundBatch,
    initiateWithdrawal,
    withdraw,
    cancelWithdrawal,
    setDefaultSlippageTolerance,
    setWallet,
    recoverToken,
    refundUnsoldToken,
    getFundsRaised,
    getTokenAmountForInvestor,
    getUserRoundTokenAmount,
    getInvestments,
    getPrivateInvestors,
    getRemainingTimeForPresaleStart,
    getRemainingTimeForPresaleEnd,
    getUserRounds,
    pause,
    unpause,
    approveTokens,
    transferTokens,
    getTokenBalance,
    transferOwnership,
    getRound,
    getPauseStatus,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <WagmiProvider config={config}>
    <Web3ContextProvider>{children}</Web3ContextProvider>
  </WagmiProvider>
);

export default Web3Provider;
