/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/deploy.js
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  const QSEToken = await ethers.getContractFactory("QSEToken");
  const token = await QSEToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("QSEToken deployed to:", tokenAddress);

  const rate = 5000;
  const wallet = deployer.address;
  const startTime = Math.floor(Date.now() / 1000) + 60;
  const endTime = startTime + 30 * 24 * 60 * 60;
  const minPurchase = ethers.parseEther("0.01");
  const maxPurchase = ethers.parseEther("10");

  const QSECrowdsale = await ethers.getContractFactory("QSECrowdsale");
  const crowdsale = await QSECrowdsale.deploy(
    rate,
    wallet,
    tokenAddress,
    startTime,
    endTime,
    minPurchase,
    maxPurchase
  );
  await crowdsale.waitForDeployment();
  const crowdsaleAddress = await crowdsale.getAddress();
  console.log("QSECrowdsale deployed to:", crowdsaleAddress);

  const transferAmount = ethers.parseUnits("300000000", 18);
  const tx = await token.transfer(crowdsaleAddress, transferAmount);
  await tx.wait();
  console.log("Transferred 300M QSE to crowdsale");

  const balance = await token.balanceOf(crowdsaleAddress);
  console.log(
    "Crowdsale token balance:",
    ethers.formatUnits(balance, 18),
    "QSE"
  );

  const contractAddresses = {
    tokenAddress,
    crowdsaleAddress,
    network: hre.network.name,
  };
  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to contract-addresses.json");

  const envContent = `NEXT_PUBLIC_QSE_TOKEN_ADDRESS=${tokenAddress}\nNEXT_PUBLIC_QSE_CROWDSALE_ADDRESS=${crowdsaleAddress}`;
  fs.writeFileSync(".env.local", envContent);
  console.log("Environment variables saved to .env.local");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
