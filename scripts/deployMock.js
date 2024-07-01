const hre = require("hardhat");
const config = require("../config.json");
const fs = require("fs");
const { ethers } = require("hardhat");


async function main() {

  // Deploy Mock WETH
  const mockWETH = await  hre.ethers.deployContract("MockERC20", ["Weth", "WETH"])
  await mockWETH.waitForDeployment();
  const mockWETHAddress = await mockWETH.getAddress();
  console.log("Mock WETH deployed to:", mockWETHAddress);

  const dataToken2 = {
    address: mockWETHAddress,
    abi: mockWETH.interface.format('json')
  }
  
}

main().catch((error) => { 
  console.error(error);
  process.exitCode = 1;
});
