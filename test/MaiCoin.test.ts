import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, formatEther } from "ethers";

describe("MaiCoin", () => {
  async function deployFixture() {
    const { ethers } = await network.connect();
    const [owner, alice] = await ethers.getSigners();
    const MaiCoin = await ethers.getContractFactory("MaiCoin");
    const maiCoin = await MaiCoin.deploy(owner.address);
    await maiCoin.waitForDeployment();
    return { maiCoin, owner, alice };
  }

  it("has correct name and symbol", async () => {
    const { maiCoin } = await deployFixture();
    expect(await maiCoin.name()).to.equal("MaiCoin");
    expect(await maiCoin.symbol()).to.equal("MAI");
  });

  it("mints 1 billion MAI to deployer", async () => {
    const { maiCoin, owner } = await deployFixture();
    const balance = await maiCoin.balanceOf(owner.address);
    expect(formatEther(balance as bigint)).to.equal("1000000000.0");
  });

  it("reverts mint from non-owner", async () => {
    const { maiCoin, alice } = await deployFixture();
    await expect(
      maiCoin.connect(alice).mint(alice.address, parseEther("100")),
    ).to.be.revertedWithCustomError(maiCoin, "OwnableUnauthorizedAccount");
  });
});
