const config = {
  // Network configurations
  networks: {
    mainnet: {
      chainId: 1,
      name: "Ethereum Mainnet",
      rpcUrl:
        process.env.MAINNET_RPC_URL ||
        "https://mainnet.infura.io/v3/your-infura-key",
    },
    sepolia: {
      chainId: 11155111,
      name: "Sepolia Testnet",
      rpcUrl:
        process.env.SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/your-infura-key",
    },
  },

  // Contract addresses
  contracts: {
    qseToken:
      process.env.QSE_TOKEN_ADDRESS ||
      "0x0000000000000000000000000000000000000000",
    usdt:
      process.env.USDT_ADDRESS || "0x4F5D783857e4e137452d38580E1d53C61b6c7a4d",
    usdc:
      process.env.USDC_ADDRESS || "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    dai:
      process.env.DAI_ADDRESS || "0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357",
  },

  // API configurations
  api: {
    baseUrl: process.env.API_BASE_URL || "https://api.example.com",
  },

  // Feature flags
  features: {
    enableTestnet: process.env.ENABLE_TESTNET === "true",
    enableMainnet: process.env.ENABLE_MAINNET === "true",
  },
};

module.exports = config;
