import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    testnet: {
      url: process.env.FLOW_ACCESS_NODE || "http://localhost:8888",
      accounts: [process.env.FLOW_PRIVATE_KEY || ""]
    }
  }
};

export default config; 