// @ts-ignore
require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "arbitrum_sepolia",
  networks: {
    hardhat: {},
    arbitrum_sepolia: {
      url: `env.process.REACT_APP_ALCHEMY_ARBITRUM_API_URL`,
      accounts: [`0x${env.process.ARBITRUM_PRIVATE_KEY}`],
    },
  },
};
