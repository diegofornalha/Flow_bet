import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const FLOW_PRIVATE_KEY = process.env.FLOW_PRIVATE_KEY!;

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
      testnet: {
        url: `https://testnet.evm.nodes.onflow.org`,
        accounts: [FLOW_PRIVATE_KEY],
        gas: 1000,
      }
    }
  };

export default config;
