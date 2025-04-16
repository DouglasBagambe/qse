/* eslint-disable @typescript-eslint/no-require-imports */
// hardhat.config.ts
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: { artifacts: "./app/artifacts" },
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: {
      url: "https://sepolia.infura.io/v3/201fb4feef8441f5ace3a42c8b4501df", // Replace with your Infura API key
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      timeout: 60000,
    },
  },
};
