const hre = require("hardhat");
const config = require("../config.json");

async function main() {
    // Deploy aggregator contract
    aggregator = await hre.ethers.deployContract("Aggregator",[
        [
          config.UNISWAP.V2_ROUTER_02_ADDRESS,
          config.SUSHISWAP.V2_ROUTER_02_ADDRESS,
        ],
        2
      ])

    await aggregator.waitForDeployment()


    const { chainId } = await ethers.provider.getNetwork()

    console.log(`
        Aggregator deployed to: ${aggregator.target}
        on network chainID: ${chainId}
        \n`)
    }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
