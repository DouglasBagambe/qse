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

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(
      "https://arbitrum-sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df"
    ),
  },
  connectors: [injected()],
});

const CONTRACTS = {
  QSE_TOKEN:
    process.env.NEXT_PUBLIC_QSE_TOKEN_ADDRESS ||
    "0x94E011e06E89660a4385762050084996990754D",
  QSE_PRESALE:
    process.env.NEXT_PUBLIC_QSE_PRESale_ADDRESS ||
    "0xda07bFf9a6Ab0d8AeA004879889FaD919C30d848",
  STABLECOINS: {
    USDT:
      process.env.NEXT_PUBLIC_USDT_ADDRESS ||
      "0x70C19cAE7F2e0298c64cB219e6408ef7b0726CE8",
    USDC:
      process.env.NEXT_PUBLIC_USDC_ADDRESS ||
      "0x0e6538E2888c56247211C116390EE43DBAc0f6b4",
    DAI:
      process.env.NEXT_PUBLIC_DAI_ADDRESS ||
      "0x8682F1d14E9C5A38f25BF849d0013123B5Db699C",
  },
};

const PAYMENT_RATES: Record<
  PaymentMethod,
  { usdRate: number; symbol: string }
> = {
  ETH: { usdRate: 3000, symbol: "ETH" },
  USDT: { usdRate: 1, symbol: "USDT" },
  USDC: { usdRate: 1, symbol: "USDC" },
  DAI: { usdRate: 1, symbol: "DAI" },
};

export type PaymentMethod = "ETH" | "USDT" | "USDC" | "DAI";
type Round = {
  roundId: number;
  tokenPrice: number;
  tokenAmount: number;
  startTime: number;
  endTime: number;
  soldAmount: number;
};

type Web3ContextType = {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  networkError: string | null;
  tokenPrice: number;
  currentRound: Round | null;
  qseBalance: string;
  burnRate: number;
  tgeTime: number;
  isTgeSet: boolean;
  supportedPaymentMethods: PaymentMethod[];
  claimableAmount: string;
  connectWallet: () => Promise<boolean>;
  switchToArbitrumSepolia: () => Promise<boolean>;
  buyTokens: (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ) => Promise<{ success: boolean; message: string }>;
  claimTokens: () => Promise<{ success: boolean; message: string }>;
  getClaimableAmount: (
    roundId?: number
  ) => Promise<{ claimable: string; periodsPassed: number }>;
  getRounds: () => Promise<Round[]>;
  getTokensAvailable: (roundId: number) => Promise<string>;
  loadQSEBalance: () => Promise<void>;
  getQSEAmountFromPayment: (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ) => Promise<number>;
  getPaymentRateForMethod: (method: PaymentMethod) => number;
};

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
  const [burnRate, setBurnRate] = useState(2);
  const [qseBalance, setQseBalance] = useState("0");
  const [claimableAmount, setClaimableAmount] = useState("0");
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [tgeTime, setTgeTime] = useState(0);
  const [isTgeSet, setIsTgeSet] = useState(false);

  const supportedPaymentMethods: PaymentMethod[] = [
    "ETH",
    "USDT",
    "USDC",
    "DAI",
  ];

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

      const codeAtToken = await provider.getCode(CONTRACTS.QSE_TOKEN);
      const codeAtPresale = await provider.getCode(CONTRACTS.QSE_PRESALE);

      if (codeAtToken === "0x" || codeAtPresale === "0x") {
        setNetworkError("Contract not found on this network");
        return;
      }

      const token = new ethers.Contract(
        CONTRACTS.QSE_TOKEN,
        [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
          "function symbol() view returns (string)",
          "function name() view returns (string)",
        ],
        signer
      );

      const presale = new ethers.Contract(
        CONTRACTS.QSE_PRESALE,
        [
          "function getRound(uint8 roundId) view returns (uint8 roundId, uint256 tokenPrice, uint256 tokenAmount, uint256 startTime, uint256 endTime, uint256 soldAmount, uint256 vestingDuration, uint8 releasePercentageAtTGE, uint8 releasePercentageInVestingPerMonth)",
          "function getTokensAvailable(uint8 roundId) view returns (uint256)",
          "function tgeTime() view returns (uint256)",
          "function isTgeSet() view returns (bool)",
          "function estimatedTokenAmountAvailableWithETH(uint256 ethAmount, uint8 roundId) view returns (uint256)",
          "function estimatedTokenAmountAvailableWithCoin(uint256 coinAmount, address coinAddress, uint8 roundId) view returns (uint256)",
          "function buyWithETH(uint8 roundId) payable returns (bool)",
          "function buyWithUSDT(uint256 usdtAmount, uint8 roundId) returns (bool)",
          "function buyWithUSDC(uint256 usdcAmount, uint8 roundId) returns (bool)",
          "function buyWithDAI(uint256 daiAmount, uint8 roundId) returns (bool)",
          "function getClaimableAmount(address user, uint8 roundId) view returns (uint256, uint256)",
          "function claimTokens() returns (bool)",
          "event TokensPurchased(address indexed buyer, uint8 roundId, uint256 amount, uint256 paymentAmount, address paymentToken)",
        ],
        signer
      );

      setQseToken(token);
      setQsePresale(presale);

      setTgeTime(Number(await presale.tgeTime()));
      setIsTgeSet(await presale.isTgeSet());

      const rounds = await getRounds();
      const activeRound = await getCurrentActiveRound(rounds);
      setCurrentRound(activeRound);
      if (activeRound) setTokenPrice(activeRound.tokenPrice);

      await loadQSEBalance();
      await updateClaimableAmount();
    } catch (error: any) {
      setNetworkError(`Failed to initialize contracts: ${error.message}`);
    }
  };

  const switchToArbitrumSepolia = async (): Promise<boolean> => {
    if (!window.ethereum) {
      setNetworkError("MetaMask not detected");
      return false;
    }
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x66eed" }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x66eed",
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
        return true;
      }
      setNetworkError("Network switch failed");
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
      if (!accounts.length) return false;
      const network = await ethProvider.getNetwork();
      if (
        Number(network.chainId) !== arbitrumSepolia.id &&
        !(await switchToArbitrumSepolia())
      ) {
        setNetworkError("Please switch to Arbitrum Sepolia");
        return false;
      }
      const signer = await ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(signer);
      setAccount(accounts[0]);
      setIsConnected(true);
      await initializeContracts(signer);
      return true;
    } catch (error: any) {
      setNetworkError(error.message || "Wallet connection failed");
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
    } catch (error: any) {
      setQseBalance("0");
    }
  };

  const updateClaimableAmount = async () => {
    const result = await getClaimableAmount();
    setClaimableAmount(result.claimable);
  };

  const getQSEAmountFromPayment = async (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ): Promise<number> => {
    if (!qsePresale || !amount || isNaN(parseFloat(amount))) return 0;
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
    } catch (error: any) {
      return 0;
    }
  };

  const getRounds = async (): Promise<Round[]> => {
    if (!qsePresale) return [];
    const rounds: Round[] = [];
    try {
      const provider = signer?.provider;
      if (!provider) return [];

      const presaleContract = new ethers.Contract(
        CONTRACTS.QSE_PRESALE,
        [
          "function getRound(uint8 roundId) view returns (uint8 roundId, uint256 tokenPrice, uint256 tokenAmount, uint256 startTime, uint256 endTime, uint256 soldAmount, uint256 vestingDuration, uint8 releasePercentageAtTGE, uint8 releasePercentageInVestingPerMonth)",
        ],
        provider
      );

      for (let i = 1; i <= 10; i++) {
        try {
          const round = await presaleContract.getRound(i);
          if (Number(round.startTime) > 0) {
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
        } catch (error) {
          break;
        }
      }

      if (rounds.length > 0) {
        const activeRound = await getCurrentActiveRound(rounds);
        setCurrentRound(activeRound);
        if (activeRound) setTokenPrice(activeRound.tokenPrice);
      }
    } catch (error: any) {}
    return rounds;
  };

  const getTokensAvailable = async (roundId: number): Promise<string> => {
    if (!qsePresale) return "0";
    try {
      const tokens = await qsePresale.getTokensAvailable(roundId);
      return ethers.formatUnits(tokens, 18);
    } catch (error: any) {
      return "0";
    }
  };

  const buyTokens = async (
    amount: string,
    method: PaymentMethod,
    roundId: number
  ) => {
    if (!signer || !qsePresale || !account)
      return { success: false, message: "Wallet not connected" };
    try {
      const presaleContract = new ethers.Contract(
        CONTRACTS.QSE_PRESALE,
        [
          "function getRound(uint8 roundId) view returns (uint8 roundId, uint256 tokenPrice, uint256 tokenAmount, uint256 startTime, uint256 endTime, uint256 soldAmount, uint256 vestingDuration, uint8 releasePercentageAtTGE, uint8 releasePercentageInVestingPerMonth)",
        ],
        signer
      );

      const round = await presaleContract.getRound(roundId);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < Number(round.startTime))
        return { success: false, message: "Sale not started" };
      if (currentTime > Number(round.endTime))
        return { success: false, message: "Sale ended" };

      let tx;
      if (method === "ETH") {
        tx = await qsePresale.buyWithETH(roundId, {
          value: ethers.parseEther(amount),
          gasLimit: 500000,
        });
      } else {
        const coinAddress = CONTRACTS.STABLECOINS[method];
        if (!coinAddress)
          return { success: false, message: "Invalid payment method" };
        const coinContract = new ethers.Contract(
          coinAddress,
          [
            "function decimals() view returns (uint8)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
          ],
          signer
        );
        const decimals = await coinContract.decimals();
        const coinAmount = ethers.parseUnits(amount, decimals);
        const allowance = await coinContract.allowance(
          account,
          CONTRACTS.QSE_PRESALE
        );
        if (allowance < coinAmount) {
          const approveTx = await coinContract.approve(
            CONTRACTS.QSE_PRESALE,
            coinAmount
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
        if (!buyMethod)
          return { success: false, message: "Unsupported payment method" };
        tx = await qsePresale[buyMethod](coinAmount, roundId, {
          gasLimit: 300000,
        });
      }
      const receipt = await tx.wait();
      await loadQSEBalance();
      await updateClaimableAmount();
      return {
        success: true,
        message: `Transaction successful: ${receipt.hash}`,
      };
    } catch (error: any) {
      const message =
        error.code === 4001
          ? "Transaction rejected"
          : error.message.includes("insufficient funds")
            ? "Insufficient funds"
            : `Transaction failed: ${error.message}`;
      return { success: false, message };
    }
  };

  const getClaimableAmount = async (roundId?: number) => {
    if (!qsePresale || !account) return { claimable: "0", periodsPassed: 0 };
    try {
      let totalClaimable = BigInt(0);
      let totalPeriodsPassed = 0;
      const rounds = await getRounds();

      if (roundId) {
        const [claimable, periods] = await qsePresale.getClaimableAmount(
          account,
          roundId
        );
        return {
          claimable: ethers.formatUnits(claimable, 18),
          periodsPassed: Number(periods),
        };
      } else {
        for (const round of rounds) {
          const [claimable, periods] = await qsePresale.getClaimableAmount(
            account,
            round.roundId
          );
          totalClaimable += BigInt(claimable);
          totalPeriodsPassed += Number(periods);
        }
        return {
          claimable: ethers.formatUnits(totalClaimable, 18),
          periodsPassed: totalPeriodsPassed,
        };
      }
    } catch (error: any) {
      return { claimable: "0", periodsPassed: 0 };
    }
  };

  const claimTokens = async () => {
    if (!signer || !qsePresale || !account)
      return { success: false, message: "Wallet not connected" };
    try {
      const isTgeSetValue = await qsePresale.isTgeSet();
      if (!isTgeSetValue) return { success: false, message: "TGE not set" };

      const tgeTimeValue = Number(await qsePresale.tgeTime());
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < tgeTimeValue)
        return { success: false, message: "TGE has not occurred yet" };

      const { claimable } = await getClaimableAmount();
      if (parseFloat(claimable) <= 0)
        return { success: false, message: "No tokens available to claim" };

      const tx = await qsePresale.claimTokens({ gasLimit: 500000 });
      const receipt = await tx.wait();
      await loadQSEBalance();
      await updateClaimableAmount();
      return {
        success: true,
        message: `Tokens claimed successfully: ${receipt.hash}`,
      };
    } catch (error: any) {
      let message = "Claim failed";
      if (error.code === 4001) {
        message = "Transaction rejected by user";
      } else if (error.message.includes("No tokens")) {
        message = "No tokens available to claim";
      } else if (error.message.includes("TGE")) {
        message = error.message.includes("not set")
          ? "TGE not set"
          : "TGE has not occurred yet";
      } else if (error.data) {
        try {
          const iface = new ethers.Interface(QSEPresaleArtifact.abi);
          const decodedError = iface.parseError(error.data);
          switch (decodedError?.name) {
            case "NoTokensPurchased":
              message = "No tokens purchased in this round";
              break;
            default:
              message = `Claim failed: ${decodedError?.name || "Unknown error"}`;
          }
        } catch {
          message = `Claim failed: ${error.message}`;
        }
      } else {
        message = `Claim failed: ${error.message}`;
      }
      return { success: false, message };
    }
  };

  useEffect(() => {
    if (!window.ethereum) return setNetworkError("MetaMask not detected");
    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    ethProvider.listAccounts().then(async (accounts) => {
      if (accounts.length) {
        setAccount(accounts[0].address);
        setIsConnected(true);
        setProvider(ethProvider);
        const signer = await ethProvider.getSigner();
        setSigner(signer);
        await initializeContracts(signer);
      }
    });
    window.ethereum?.on("accountsChanged", (accounts: string[]) => {
      setAccount(accounts[0] || null);
      setIsConnected(!!accounts.length);
      if (accounts.length) connectWallet();
    });
    window.ethereum?.on("chainChanged", () => window.location.reload());
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
    burnRate,
    tgeTime,
    isTgeSet,
    supportedPaymentMethods,
    claimableAmount,
    connectWallet,
    switchToArbitrumSepolia,
    buyTokens,
    claimTokens,
    getClaimableAmount,
    getRounds,
    getTokensAvailable,
    loadQSEBalance,
    getQSEAmountFromPayment,
    getPaymentRateForMethod: (method) => PAYMENT_RATES[method].usdRate,
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
