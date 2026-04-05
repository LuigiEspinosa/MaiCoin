import { expect } from "chai";
import { network } from "hardhat";
import { parseEther, formatEther } from "ethers";

describe("token", () => {
  // Is called once per loadFixture snapshot.
  // loadFixture resets the chain to this exact state before each test
  // that calls it - no state bleeds between tests.
  async function deployFixture() {
    const { ethers, networkHelpers } = await network.connect();
    const [owner, alice, bob] = await ethers.getSigners();

    const MaiCoin = await ethers.getContractFactory("MaiCoin");
    const token = await MaiCoin.deploy(owner.address);
    await token.waitForDeployment();

    return { networkHelpers, token, owner, alice, bob };
  }

  it("has correct name and symbol", async () => {
    const { networkHelpers } = await network.connect();
    const { token } = await networkHelpers.loadFixture(deployFixture);

    expect(await token.name()).to.equal("MaiCoin");
    expect(await token.symbol()).to.equal("MAI");
    expect(await token.decimals()).to.equal(18n);
  });

  it("mints 1 billion MAI to deployer on deploy", async () => {
    const { networkHelpers } = await network.connect();
    const { token, owner } = await networkHelpers.loadFixture(deployFixture);

    const balance = await token.balanceOf(owner.address);
    expect(formatEther(balance as bigint)).to.equal("1000000000.0");
    expect(await token.totalSupply()).to.equal(balance);
  });

  it("transfers tokens between accounts", async () => {
    const { networkHelpers } = await network.connect();
    const { token, owner, alice } = await networkHelpers.loadFixture(
      deployFixture,
    );

    await token.transfer(alice.address, parseEther("100"));

    expect(formatEther(await token.balanceOf(alice.address))).to.equal("100.0");
    expect(formatEther(await token.balanceOf(owner.address))).to.equal(
      formatEther(parseEther("1000000000") - parseEther("100")),
    );
  });

  it("emit Transfer event on transfer", async () => {
    const { networkHelpers } = await network.connect();
    const { token, owner, alice } = await networkHelpers.loadFixture(
      deployFixture,
    );

    await expect(token.transfer(alice.address, parseEther("50")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, alice.address, parseEther("50"));
  });

  it("reverts transfer when balance is insufficient", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice, bob } = await networkHelpers.loadFixture(
      deployFixture,
    );

    // alice has 0 tokens - any transfer should revert
    await expect(
      token.connect(alice).transfer(bob.address, parseEther("1")),
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("allows owner to mint tokens", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice } = await networkHelpers.loadFixture(deployFixture);

    await token.mint(alice.address, parseEther("500"));

    expect(formatEther(await token.balanceOf(alice.address))).to.equal("500.0");
    expect(formatEther(await token.totalSupply())).to.equal("1000000500.0");
  });

  it("reverts mint from non-owner", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice, bob } = await networkHelpers.loadFixture(
      deployFixture,
    );

    await expect(
      token.connect(alice).mint(bob.address, parseEther("100")),
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("allows any holder to burn their own tokens", async () => {
    const { networkHelpers } = await network.connect();
    const { token, owner } = await networkHelpers.loadFixture(deployFixture);

    const before = await token.balanceOf(owner.address);
    await token.burn(parseEther("1000"));

    expect(await token.balanceOf(owner.address)).to.equal(
      before - parseEther("1000"),
    );
    expect(await token.totalSupply()).to.equal(before - parseEther("1000"));
  });

  it("reverts burn when balance is insufficient", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice } = await networkHelpers.loadFixture(deployFixture);

    await expect(
      token.connect(alice).burn(parseEther("1")),
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  // burnFrom is an advertised feature and the allowance path must be
  // tested before the contract is immutably deployed to Sepolia

  it("allows burnFrom with prior approved", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice, bob } = await networkHelpers.loadFixture(
      deployFixture,
    );

    // owner -> alice: transfer 100 MAI
    await token.transfer(alice.address, parseEther("100"));

    // alice approves bob to spend 50 MAI on her behalf
    await token.connect(alice).approve(bob.address, parseEther("50"));

    expect(await token.allowance(alice.address, bob.address)).to.equal(
      parseEther("50"),
    );

    // bob burns 50 MAI from alice's balance
    await token.connect(bob).burnFrom(alice.address, parseEther("50"));

    expect(formatEther(await token.balanceOf(alice.address))).to.equal("50.0");
    expect(await token.allowance(alice.address, bob.address)).to.equal(0n);
  });

  it("reverts burnFrom without sufficient allowance", async () => {
    const { networkHelpers } = await network.connect();
    const { token, alice, bob } = await networkHelpers.loadFixture(
      deployFixture,
    );

    await token.transfer(alice.address, parseEther("100"));
    // no approve call - bob has zero allowance

    await expect(
      token.connect(bob).burnFrom(alice.address, parseEther("1")),
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
  });

  // Ownership transfer is irreversible on Sepolia. Verifying that the
  // old owner loses mint access after trasnfer is critical before deploy.
  it("reverts mint after ownership transfer", async () => {
    const { networkHelpers } = await network.connect();
    const { token, owner, alice, bob } = await networkHelpers.loadFixture(
      deployFixture,
    );

    // transfer ownership to alice
    await token.transferOwnership(alice.address);

    // original owner can no longer mint
    await expect(
      token.connect(owner).mint(bob.address, parseEther("1")),
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

    // new owner (alice) can mint
    await token.connect(alice).mint(bob.address, parseEther("1"));
    expect(formatEther(await token.balanceOf(bob.address))).to.equal("1.0");
  });
});
