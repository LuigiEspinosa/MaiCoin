import { network } from "hardhat";
import { formatEther } from "ethers";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();

  console.log("Dep loying with:", deployer.address);

  // getContractFactory looks up the compiled artifact by contract name.
  // Constructor arg: initialOwner - sets the owner for onlyOwner functions.
  const MaiCoin = await ethers.getContractFactory("MaiCoin");
  const maiCoin = await MaiCoin.deploy(deployer.address);

  // waitForDeployment resolves once the trasaction is mined.
  // On hardhatMainnet this is instant. On Sepolia, expect 12-30 seconds.
  await maiCoin.waitForDeployment();

  const address = await maiCoin.getAddress();
  console.log("MaiCoin deployed to:", address);

  // Call a view function directly - no .read prefix meeded with ethers.js
  const supply = await maiCoin.totalSupply();
  console.log("Total supply:", formatEther(supply as bigint), "MAI");
}

// process.exit(1) on failure so CI treats a failed deploy as a
// failed job. main().catch(console.error) exits with code 0, masking the error.
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
