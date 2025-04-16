/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/deployCrowdsale.js
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log(
    "Balance:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  const QSE_TOKEN_ADDRESS = "0x7B069841EcDD221b2C0e8a3c314AdaC0D0e15c6f";
  const rate = 5000;
  const wallet = deployer.address;
  const startTime = Math.floor(Date.now() / 1000) + 300;
  const endTime = startTime + 30 * 24 * 60 * 60;
  const minPurchase = ethers.parseEther("0.01");
  const maxPurchase = ethers.parseEther("10");

  const QSECrowdsale = await ethers.getContractFactory("QSECrowdsale");
  const crowdsale = await QSECrowdsale.deploy(
    rate,
    wallet,
    QSE_TOKEN_ADDRESS,
    startTime,
    endTime,
    minPurchase,
    maxPurchase
  );
  await crowdsale.waitForDeployment();
  const crowdsaleAddress = await crowdsale.getAddress();
  console.log("QSECrowdsale deployed to:", crowdsaleAddress);

  fs.writeFileSync(
    "contract-addresses-sepolia.json",
    JSON.stringify(
      {
        tokenAddress: QSE_TOKEN_ADDRESS,
        crowdsaleAddress,
        network: hre.network.name,
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    ".env.local",
    `NEXT_PUBLIC_QSE_TOKEN_ADDRESS=${QSE_TOKEN_ADDRESS}\nNEXT_PUBLIC_QSE_CROWDSALE_ADDRESS=${crowdsaleAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
