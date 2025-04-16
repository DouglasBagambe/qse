/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
// test/QSEToken.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

console.log("ethers:", ethers); // Debug log

describe("QSEToken", function () {
  let QSEToken;
  let qseToken;
  let owner;
  let addr1;
  let addr2;
  let MAX_SUPPLY;
  let INITIAL_SUPPLY;
  const BURN_RATE = 2;

  beforeEach(async function () {
    console.log("ethers in beforeEach:", ethers); // Debug log
    MAX_SUPPLY = ethers.utils.parseEther("1000000000"); // Line 19
    INITIAL_SUPPLY = ethers.utils.parseEther("300000000");

    [owner, addr1, addr2] = await ethers.getSigners();
    QSEToken = await ethers.getContractFactory("QSEToken");
    qseToken = await QSEToken.deploy(owner.address);
    await qseToken.deployed();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await qseToken.owner()).to.equal(owner.address);
    });

    it("should mint initial supply to owner", async function () {
      expect(await qseToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await qseToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("should have correct name and symbol", async function () {
      expect(await qseToken.name()).to.equal("QuantumSEC Analytics Token");
      expect(await qseToken.symbol()).to.equal("QSE");
    });

    it("should fail if owner address is zero", async function () {
      await expect(
        QSEToken.deploy(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid owner address");
    });
  });

  describe("Transfer", function () {
    it("should transfer tokens with burn", async function () {
      const amount = ethers.utils.parseEther("1000");
      const burnAmount = amount.mul(BURN_RATE).div(100);
      const transferAmount = amount.sub(burnAmount);

      await qseToken.transfer(addr1.address, amount);

      expect(await qseToken.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await qseToken.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY.sub(amount)
      );
      expect(await qseToken.totalSupply()).to.equal(
        INITIAL_SUPPLY.sub(burnAmount)
      );
    });

    it("should fail if insufficient balance", async function () {
      const amount = INITIAL_SUPPLY.add(1);
      await expect(qseToken.transfer(addr1.address, amount)).to.be.revertedWith(
        "Insufficient balance"
      );
    });
  });

  describe("TransferFrom", function () {
    it("should allow approved transfer with burn", async function () {
      const amount = ethers.utils.parseEther("1000");
      const burnAmount = amount.mul(BURN_RATE).div(100);
      const transferAmount = amount.sub(burnAmount);

      await qseToken.approve(addr1.address, amount);
      await qseToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, amount);

      expect(await qseToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await qseToken.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY.sub(amount)
      );
      expect(await qseToken.totalSupply()).to.equal(
        INITIAL_SUPPLY.sub(burnAmount)
      );
    });

    it("should fail if allowance exceeded", async function () {
      const amount = ethers.utils.parseEther("1000");
      await qseToken.approve(addr1.address, amount.sub(1));
      await expect(
        qseToken
          .connect(addr1)
          .transferFrom(owner.address, addr2.address, amount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });
  });

  describe("Vesting", function () {
    it("should allocate vested tokens", async function () {
      const amount = ethers.utils.parseEther("10000");
      const duration = 60 * 60 * 24; // 1 day

      await qseToken.allocateVestedTokens(addr1.address, amount, duration);

      expect(await qseToken.vestedTokens(addr1.address)).to.equal(amount);
      const vestingEnd = await qseToken.vestingEndTime(addr1.address);
      const blockTimestamp = (await ethers.provider.getBlock("latest"))
        .timestamp;
      expect(vestingEnd).to.be.closeTo(blockTimestamp + duration, 10); // Allow 10s variance
      expect(await qseToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("should fail vesting if not owner", async function () {
      const amount = ethers.utils.parseEther("10000");
      const duration = 60 * 60 * 24;
      await expect(
        qseToken
          .connect(addr1)
          .allocateVestedTokens(addr2.address, amount, duration)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burn", function () {
    it("should burn tokens manually", async function () {
      const amount = ethers.utils.parseEther("1000");
      await qseToken.burn(amount);

      expect(await qseToken.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY.sub(amount)
      );
      expect(await qseToken.totalSupply()).to.equal(INITIAL_SUPPLY.sub(amount));
    });

    it("should fail if burn amount exceeds balance", async function () {
      const amount = INITIAL_SUPPLY.add(1);
      await expect(qseToken.burn(amount)).to.be.revertedWith(
        "Invalid burn amount"
      );
    });
  });
});
