/* eslint-disable @typescript-eslint/no-require-imports */
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs").promises;
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  // Deploy QSE Token
  const QSE = await ethers.getContractFactory("QSE");
  const qseToken = await QSE.deploy(deployer.address);
  await qseToken.waitForDeployment();
  const qseTokenAddress = await qseToken.getAddress();
  console.log("QSE deployed to:", qseTokenAddress);

  // Deploy TestERC20 tokens (for USDT, USDC, DAI)
  const TestERC20 = await ethers.getContractFactory("TestERC20");

  const usdt = await TestERC20.deploy(
    "Tether USD",
    "USDT",
    6,
    ethers.parseUnits("1000000", 6)
  );
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("Test USDT deployed to:", usdtAddress);

  const usdc = await TestERC20.deploy(
    "USD Coin",
    "USDC",
    6,
    ethers.parseUnits("1000000", 6)
  );
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("Test USDC deployed to:", usdcAddress);

  const dai = await TestERC20.deploy(
    "Dai Stablecoin",
    "DAI",
    18,
    ethers.parseUnits("1000000", 18)
  );
  await dai.waitForDeployment();
  const daiAddress = await dai.getAddress();
  console.log("Test DAI deployed to:", daiAddress);

  // Deploy QSEPresale
  const QSEPresale = await ethers.getContractFactory("QSEPresale");
  const qsePresale = await QSEPresale.deploy(qseTokenAddress);
  await qsePresale.waitForDeployment();
  const qsePresaleAddress = await qsePresale.getAddress();
  console.log("QSEPresale deployed to:", qsePresaleAddress);

  // Configure a presale round
  const roundId = 1;
  const tokenPrice = ethers.parseUnits("0.6", 6); // $0.60 in 6 decimals
  const tokenAmount = ethers.parseUnits("300000000", 18); // 300M QSE
  const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
  const endTime = startTime + 30 * 24 * 60 * 60; // 30 days
  const vestingDuration = 12 * 20 * 60; // 12 months (using 20-minute vesting units for testing)
  const releasePercentageAtTGE = 20; // 20% at TGE
  const releasePercentageInVestingPerMonth = 80 / 12; // 80% over 12 months

  const txCreateRound = await qsePresale.createRound(
    roundId,
    tokenPrice,
    tokenAmount,
    startTime,
    endTime,
    vestingDuration,
    releasePercentageAtTGE,
    releasePercentageInVestingPerMonth
  );
  await txCreateRound.wait();
  console.log(`Created presale round ${roundId}`);

  // Transfer QSE tokens to QSEPresale
  const txTransfer = await qseToken.transfer(qsePresaleAddress, tokenAmount);
  await txTransfer.wait();
  console.log(
    `Transferred ${ethers.formatUnits(tokenAmount, 18)} QSE to QSEPresale`
  );

  // Verify presale balance
  const presaleBalance = await qseToken.balanceOf(qsePresaleAddress);
  console.log(
    "QSEPresale token balance:",
    ethers.formatUnits(presaleBalance, 18),
    "QSE"
  );

  // Save contract addresses
  const contractAddresses = {
    qseTokenAddress,
    qsePresaleAddress,
    usdtAddress,
    usdcAddress,
    daiAddress,
    network: hre.network.name,
  };
  await fs.writeFile(
    path.join(__dirname, "../contract-addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to contract-addresses.json");

  // Update .env.local
  const envContent = [
    `NEXT_PUBLIC_QSE_TOKEN_ADDRESS=${qseTokenAddress}`,
    `NEXT_PUBLIC_QSE_PRESALE_ADDRESS=${qsePresaleAddress}`,
    `NEXT_PUBLIC_USDT_ADDRESS=${usdtAddress}`,
    `NEXT_PUBLIC_USDC_ADDRESS=${usdcAddress}`,
    `NEXT_PUBLIC_DAI_ADDRESS=${daiAddress}`,
  ].join("\n");
  await fs.writeFile(path.join(__dirname, "../.env.local"), envContent);
  console.log("Environment variables saved to .env.local");

  // Copy artifacts to app/artifacts/contracts/
  const artifactDir = path.join(__dirname, "../artifacts/contracts");
  const targetDir = path.join(__dirname, "../app/artifacts/contracts");
  await fs.mkdir(targetDir, { recursive: true });

  const contractsToCopy = [
    "QSE.sol/QSE.json",
    "QSEPresale.sol/QSEPresale.json",
    "TestERC20.sol/TestERC20.json",
  ];
  for (const contractPath of contractsToCopy) {
    const sourcePath = path.join(artifactDir, contractPath);
    const targetPath = path.join(targetDir, path.basename(contractPath));
    try {
      await fs.copyFile(sourcePath, targetPath);
      console.log(`Copied ${contractPath} to app/artifacts/contracts/`);
    } catch (error) {
      console.error(`Failed to copy ${contractPath}:`, error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
