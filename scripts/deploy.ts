import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CertifyRoles contract...");

  // Get the contract factory
  const CertifyRoles = await ethers.getContractFactory("CertifyRoles");

  // Deploy the contract
  const certifyRoles = await CertifyRoles.deploy();

  // Wait for the contract to be deployed
  await certifyRoles.waitForDeployment();

  const contractAddress = await certifyRoles.getAddress();
  
  console.log(`✅ CertifyRoles deployed to: ${contractAddress}`);
  console.log(`📋 Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`🔑 Deployer: ${(await ethers.getSigners())[0].address}`);
  
  // Wait for a few block confirmations before verification
  console.log("⏳ Waiting for block confirmations...");
  await certifyRoles.deploymentTransaction()?.wait(5);
  
  console.log(`🎯 Contract is ready for verification!`);
  console.log(`📝 Run this command to verify:`);
  console.log(`npx hardhat verify --network somnia ${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});