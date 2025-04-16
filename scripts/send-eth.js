/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/send-eth.js
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Hardhat account to send from (Account #0)
  const fromPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const fromAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  // Your Phantom wallet address to send to
  const toAddress = "0xa7d3e631d2310d1e7b6e8754600ef91974c788df";

  // Amount to send (e.g., 10 ETH)
  const amount = ethers.parseEther("10");

  // Connect to the Hardhat network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(fromPrivateKey, provider);

  // Check balance
  const balance = await provider.getBalance(fromAddress);
  console.log(`Balance of ${fromAddress}: ${ethers.formatEther(balance)} ETH`);

  if (balance < amount) {
    throw new Error("Insufficient balance to send ETH");
  }

  // Get fee data (ethers v6)
  const feeData = await provider.getFeeData();

  // Send transaction
  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: amount,
    gasLimit: 21000, // Standard gas limit for ETH transfer
    maxFeePerGas: feeData.maxFeePerGas, // Use maxFeePerGas instead of gasPrice
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  });

  console.log(`Transaction sent! Hash: ${tx.hash}`);

  // Wait for confirmation
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  console.log(`Sent ${ethers.formatEther(amount)} ETH to ${toAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
